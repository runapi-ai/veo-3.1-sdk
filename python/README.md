# Veo API Python SDK for RunAPI

The veo api Python SDK is the language-specific package for Veo 3 on RunAPI. Use this veo api package for text-to-video, video extension, and video upscaling flows when your application needs JSON request bodies, task status lookup, and consistent RunAPI errors in Python.

This veo api README is the Python package guide inside the public `veo3-sdk` repository. For the repository overview, start at `../README.md`; for model details, use https://runapi.ai/models/veo-3.1; for API reference, use https://runapi.ai/docs#veo-3.1; for SDK docs, use https://runapi.ai/docs#sdk-veo-3.1.

## Install

```bash
pip install runapi-veo-3-1
```

## Quick start

```python
from runapi.veo_3_1 import Veo31Client

client = Veo31Client()  # reads RUNAPI_API_KEY, or pass api_key="sk-..."

task = client.text_to_video.create(
    model="veo-3.1-fast",
    prompt="A drone shot over mountains at sunset",
    duration_seconds=8,
)
status = client.text_to_video.get(task.id)

extension = client.extend_video.create(
    source_task_id=task.id,
    prompt="Continue the flight toward the coastline",
)

upscale = client.upscale_video.create(
    source_task_id=task.id,
    output_resolution="4k",
)
```

Use `create` to submit a task and return quickly, `get` to fetch the latest task state, and `run` when a script should create and poll until completion:

```python
result = client.text_to_video.run(
    model="veo-3.1-fast",
    prompt="A serene mountain lake at dawn",
)
print(result.videos[0].url)
```

In web request handlers, prefer `create` plus webhook or later `get` polling so a worker is not held open.

RunAPI-generated file URLs are temporary. Download and store generated images, videos, audio, or other files in your own durable storage within 7 days; do not treat returned URLs as long-term assets.

## Language notes

Pass parameters as keyword arguments and catch the `runapi.veo_3_1` error classes when building video jobs or scripts. Text-to-video request bodies can include `duration` with `4`, `6`, or `8` seconds. The available resources are `text_to_video`, `extend_video`, and `upscale_video`. Keep `RUNAPI_API_KEY` in the environment or your secret manager; never commit API keys or callback secrets.

## Links

- Model page: https://runapi.ai/models/veo-3.1
- SDK docs: https://runapi.ai/docs#sdk-veo-3.1
- Product docs: https://runapi.ai/docs#veo-3.1
- Pricing and rate limits: https://runapi.ai/models/veo-3.1/veo-3.1
- Provider comparison: https://runapi.ai/providers/google
- Full catalog: https://runapi.ai/models
- Repository: https://github.com/runapi-ai/veo3-sdk

## License

Licensed under the Apache License, Version 2.0.
