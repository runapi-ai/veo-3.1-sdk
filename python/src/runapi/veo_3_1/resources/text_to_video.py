"""Veo 3.1 text-to-video resource."""

from __future__ import annotations

from typing import Any, Dict, Optional

from runapi.core import Resource, ValidationError, RequestOptions

from ..contract_gen import CONTRACT
from ..types import (
    CompletedTextToVideoResponse,
    TextToVideoResponse,
)


class TextToVideo(Resource):
    """Generate videos from text, image, and reference-image prompts."""

    ENDPOINT = "/api/v1/veo_3_1/text_to_video"

    RESPONSE_CLASS = TextToVideoResponse
    COMPLETED_RESPONSE_CLASS = CompletedTextToVideoResponse

    def run(self, options: Optional[RequestOptions] = None, **params: Any) -> Any:
        """Generate a video and poll until it completes.

        Args:
            **params: text-to-video parameters (model, ...).

        Returns:
            The completed (narrowed) text-to-video response.
        """
        task = self.create(options=options, **params)
        return self._poll_until_complete(lambda: self.get(task.id, options=options))

    def create(self, options: Optional[RequestOptions] = None, **params: Any) -> Any:
        """Create a text-to-video task and return immediately with an id.

        Args:
            **params: text-to-video parameters (model, ...).

        Returns:
            The task creation result with an id.
        """
        compacted = self._compact_params(params)
        self._validate_params(compacted)
        return self._request("post", self.ENDPOINT, body=compacted, options=options)

    def get(self, id: str, options: Optional[RequestOptions] = None) -> Any:
        """Fetch the current status of a text-to-video task.

        Args:
            id: The task id returned by ``create``.

        Returns:
            The current task status.
        """
        return self._request("get", f"{self.ENDPOINT}/{id}", options=options)

    def _validate_params(self, params: Dict[str, Any]) -> None:
        self._validate_contract(CONTRACT["text-to-video"], params)

        if not params.get("prompt"):
            raise ValidationError("prompt is required")

        self._validate_input_mode(params)

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
            model = params.get("model")
            if model not in {"veo-3.1-fast", "veo-3.1-lite"}:
                raise ValidationError("reference requires model veo-3.1-fast or veo-3.1-lite")
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
