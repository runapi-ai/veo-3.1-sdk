"""Veo 3.1 video extension resource."""

from __future__ import annotations

from typing import Any, Optional

from runapi.core import Resource, RequestOptions

from ..types import CompletedExtendVideoResponse, ExtendVideoResponse


class ExtendVideo(Resource):
    """Extend a previously generated video by referencing its task id."""

    ENDPOINT = "/api/v1/veo_3_1/extend_video"

    RESPONSE_CLASS = ExtendVideoResponse
    COMPLETED_RESPONSE_CLASS = CompletedExtendVideoResponse

    def run(self, options: Optional[RequestOptions] = None, **params: Any) -> Any:
        """Extend a video and poll until it completes.

        Args:
            **params: extend-video parameters (model, ...).

        Returns:
            The completed (narrowed) extend-video response.
        """
        task = self.create(options=options, **params)
        return self._poll_until_complete(lambda: self.get(task.id, options=options))

    def create(self, options: Optional[RequestOptions] = None, **params: Any) -> Any:
        """Create an extend-video task and return immediately with an id.

        Args:
            **params: extend-video parameters (model, ...).

        Returns:
            The task creation result with an id.
        """
        compacted = self._compact_params(params)
        return self._request("post", self.ENDPOINT, body=compacted, options=options)

    def get(self, id: str, options: Optional[RequestOptions] = None) -> Any:
        """Fetch the current status of an extend-video task.

        Args:
            id: The task id returned by ``create``.

        Returns:
            The current task status.
        """
        return self._request("get", f"{self.ENDPOINT}/{id}", options=options)
