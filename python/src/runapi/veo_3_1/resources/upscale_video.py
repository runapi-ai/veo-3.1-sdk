"""Veo 3.1 video upscaling resource."""

from __future__ import annotations

from typing import Any, Dict, Optional

from runapi.core import Resource, ValidationError, RequestOptions

from ..types import (
    OUTPUT_RESOLUTIONS,
    CompletedUpscaleVideoResponse,
    UpscaleVideoResponse,
)


class UpscaleVideo(Resource):
    """Upscale a previously generated video by referencing its task id."""

    ENDPOINT = "/api/v1/veo_3_1/upscale_video"

    RESPONSE_CLASS = UpscaleVideoResponse
    COMPLETED_RESPONSE_CLASS = CompletedUpscaleVideoResponse

    def run(self, options: Optional[RequestOptions] = None, **params: Any) -> Any:
        """Upscale a video and poll until it completes.

        Args:
            **params: video upscale parameters (model, ...).

        Returns:
            The completed (narrowed) video upscale response.
        """
        task = self.create(options=options, **params)
        return self._poll_until_complete(lambda: self.get(task.id, options=options))

    def create(self, options: Optional[RequestOptions] = None, **params: Any) -> Any:
        """Create a video upscale task and return immediately with an id.

        Args:
            **params: video upscale parameters (model, ...).

        Returns:
            The task creation result with an id.
        """
        compacted = self._compact_params(params)
        self._validate_params(compacted)
        return self._request("post", self.ENDPOINT, body=compacted, options=options)

    def get(self, id: str, options: Optional[RequestOptions] = None) -> Any:
        """Fetch the current status of a video upscale task.

        Args:
            id: The task id returned by ``create``.

        Returns:
            The current task status.
        """
        return self._request("get", f"{self.ENDPOINT}/{id}", options=options)

    def _validate_params(self, params: Dict[str, Any]) -> None:
        if not params.get("source_task_id"):
            raise ValidationError("source_task_id is required")
        output_resolution = params.get("output_resolution")
        if output_resolution not in OUTPUT_RESOLUTIONS:
            raise ValidationError(f"output_resolution must be one of: {', '.join(OUTPUT_RESOLUTIONS)}")
