"""Veo 3.1 text-to-video resource."""

from __future__ import annotations

from typing import Any, Dict

from runapi.core import Resource, ValidationError

from ..types import (
    ASPECT_RATIOS,
    DURATIONS,
    INPUT_MODES,
    MODELS,
    CompletedTextToVideoResponse,
    TextToVideoResponse,
)


class TextToVideo(Resource):
    """Generate videos from text, image, and reference-image prompts."""

    ENDPOINT = "/api/v1/veo_3_1/text_to_video"

    RESPONSE_CLASS = TextToVideoResponse
    COMPLETED_RESPONSE_CLASS = CompletedTextToVideoResponse

    def run(self, **params: Any) -> Any:
        """Generate a video and poll until it completes.

        Args:
            **params: text-to-video parameters (model, ...).

        Returns:
            The completed (narrowed) text-to-video response.
        """
        task = self.create(**params)
        return self._poll_until_complete(lambda: self.get(task.id))

    def create(self, **params: Any) -> Any:
        """Create a text-to-video task and return immediately with an id.

        Args:
            **params: text-to-video parameters (model, ...).

        Returns:
            The task creation result with an id.
        """
        compacted = self._compact_params(params)
        self._validate_params(compacted)
        return self._request("post", self.ENDPOINT, body=compacted)

    def get(self, id: str) -> Any:
        """Fetch the current status of a text-to-video task.

        Args:
            id: The task id returned by ``create``.

        Returns:
            The current task status.
        """
        return self._request("get", f"{self.ENDPOINT}/{id}")

    def _validate_params(self, params: Dict[str, Any]) -> None:
        if not params.get("model"):
            raise ValidationError("model is required")
        if not params.get("prompt"):
            raise ValidationError("prompt is required")

        model = params.get("model")
        if model not in MODELS:
            raise ValidationError(f"Invalid model: {model}. Must be one of: {', '.join(MODELS)}")

        self._validate_optional(params, "aspect_ratio", ASPECT_RATIOS)
        self._validate_optional(params, "input_mode", INPUT_MODES)
        self._validate_duration(params)

        self._validate_input_mode(params)

    def _validate_duration(self, params: Dict[str, Any]) -> None:
        duration_seconds = params.get("duration_seconds")
        if not duration_seconds:
            return
        if duration_seconds in DURATIONS:
            return

        raise ValidationError(
            f"Invalid duration_seconds: {duration_seconds}. Must be one of: {', '.join(str(d) for d in DURATIONS)}"
        )

    def _validate_input_mode(self, params: Dict[str, Any]) -> None:
        input_mode = params.get("input_mode")
        if not input_mode:
            return

        if input_mode == "first_and_last_frames":
            if not self._field_present(params, "first_frame_image_url"):
                raise ValidationError("first_frame_image_url is required for first_and_last_frames")
            if self._field_present(params, "reference_image_urls"):
                raise ValidationError("reference_image_urls requires input_mode reference")
        elif input_mode == "reference":
            urls = params.get("reference_image_urls")
            if not urls:
                raise ValidationError("reference_image_urls is required for reference")
            if not (isinstance(urls, list) and 1 <= len(urls) <= 3):
                raise ValidationError("reference_image_urls must contain 1-3 items for reference")
            model = params.get("model")
            if model != "veo-3.1-fast":
                raise ValidationError("reference requires model veo-3.1-fast")
            ar = params.get("aspect_ratio")
            if ar and ar != "16:9":
                raise ValidationError("reference requires aspect_ratio 16:9")
            if self._field_present(params, "first_frame_image_url") or self._field_present(params, "last_frame_image_url"):
                raise ValidationError(
                    "first_frame_image_url and last_frame_image_url require input_mode first_and_last_frames"
                )
        else:
            if self._field_present(params, "first_frame_image_url") or self._field_present(params, "last_frame_image_url"):
                raise ValidationError(
                    "first_frame_image_url and last_frame_image_url require input_mode first_and_last_frames"
                )
            if self._field_present(params, "reference_image_urls"):
                raise ValidationError("reference_image_urls requires input_mode reference")

    @staticmethod
    def _field_present(params: Dict[str, Any], key: str) -> bool:
        value = params.get(key)
        if isinstance(value, list):
            return len(value) > 0
        return value is not None and str(value) != ""
