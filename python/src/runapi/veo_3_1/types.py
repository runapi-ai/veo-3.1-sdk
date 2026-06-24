"""Veo 3.1 model lists, enums, and response models."""

from __future__ import annotations

from runapi.core import BaseModel, TaskResponse, optional, required

OUTPUT_RESOLUTIONS = ["1080p", "4k"]


class Video(BaseModel):
    url = optional(str)
    resolution = optional(str)
    has_audio = optional()


class Source(BaseModel):
    url = optional(str)


class AsyncTaskResponse(TaskResponse):
    """Veo 3.1 async task status response."""

    id = required(str)
    status = optional(str, enum=lambda: TaskResponse.Status.ALL)


class TextToVideoResponse(AsyncTaskResponse):
    """Veo 3.1 text-to-video task status response."""

    videos = optional([lambda: Video])
    sources = optional([lambda: Source])


class ExtendVideoResponse(AsyncTaskResponse):
    """Veo 3.1 extend-video task status response."""

    videos = optional([lambda: Video])
    sources = optional([lambda: Source])


class UpscaleVideoResponse(AsyncTaskResponse):
    """Veo 3.1 video upscale task status response."""

    source_task_id = optional(str)
    videos = optional([lambda: Video])
    sources = optional([lambda: Source])
    media_ids = optional([str])


class CompletedTextToVideoResponse(TextToVideoResponse):
    """Narrowed response from ``run()`` once polling observes completion."""

    videos = required([lambda: Video])


class CompletedExtendVideoResponse(ExtendVideoResponse):
    """Narrowed response from ``run()`` once polling observes completion."""

    videos = required([lambda: Video])


class CompletedUpscaleVideoResponse(UpscaleVideoResponse):
    """Narrowed response from ``run()`` once polling observes completion."""

    videos = required([lambda: Video])
