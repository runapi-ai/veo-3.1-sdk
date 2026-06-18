"""Veo 3.1 client."""

from __future__ import annotations

from typing import Any, Optional

from runapi.core import ClientOptions, HttpClient, resolve_api_key

from .resources.extend_video import ExtendVideo
from .resources.text_to_video import TextToVideo
from .resources.upscale_video import UpscaleVideo


class Veo31Client:
    """Veo 3.1 video API client.

    Example::

        client = Veo31Client(api_key="sk-...")
        result = client.text_to_video.run(
            model="veo-3.1-fast", prompt="A drone shot over mountains at sunset"
        )
    """

    def __init__(self, api_key: Optional[str] = None, **options: Any) -> None:
        resolved_api_key = resolve_api_key(api_key)
        client_options = ClientOptions(api_key=resolved_api_key, **options)
        http = client_options.http_client or HttpClient(client_options)
        self.text_to_video = TextToVideo(http)
        self.extend_video = ExtendVideo(http)
        self.upscale_video = UpscaleVideo(http)
