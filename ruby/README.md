# Veo API Ruby SDK for RunAPI

The veo api Ruby SDK is the language-specific package for Veo 3 on RunAPI. Use this veo api package for text-to-video, image-to-video, video-to-video, animation, and edit flows when your application needs JSON request bodies, task status lookup, and consistent RunAPI errors in Ruby.

This veo api README is the Ruby package guide inside the public `veo3-sdk` repository. For the repository overview, start at `../README.md`; for model details, use https://runapi.ai/models/veo-3.1; for API reference, use https://runapi.ai/docs#veo-3.1; for SDK docs, use https://runapi.ai/docs#sdk-veo-3.1.

## Install

```bash
gem install runapi-veo3
```

## Quick start

```ruby
require "runapi-veo3"

client = RunApi::Veo3::Client.new
task = client.generations.create(
  # Pass the Veo 3 JSON request body from https://runapi.ai/docs#veo-3.1.
)
status = client.generations.get(task.id)
```

Use `create` when you want to submit a task and return quickly, `get` when you need the latest task state, and `run` when a script should create and poll until completion. In web request handlers, prefer `create` plus webhook or later `get` polling so a worker is not held open.

## Language notes

Use Ruby keyword arguments and the `RunApi::Veo3` error classes when building video jobs, Rails workers, or scripts. The available resources include generations, extensions, hd1080p, and hd4k. Keep `RUNAPI_API_KEY` in the environment or your secret manager; never commit API keys or callback secrets.

## Links

- Model page: https://runapi.ai/models/veo-3.1
- SDK docs: https://runapi.ai/docs#sdk-veo-3.1
- Product docs: https://runapi.ai/docs#veo-3.1
- Pricing and rate limits: https://runapi.ai/models/veo-3.1/veo-3
- Provider comparison: https://runapi.ai/providers/google
- Full catalog: https://runapi.ai/models
- Repository: https://github.com/runapi-ai/veo3-sdk

## License

Licensed under the Apache License, Version 2.0.
