---
name: veo-3.1
description: Generate videos with Veo 3.1 text-to-video, extend-video, and upscale-video through RunAPI.ai using the @runapi.ai/veo-3-1 Node/TypeScript SDK. Use when the user asks to add AI video generation, mentions Veo 3.1, or writes against @runapi.ai/veo-3-1. Triggers on "veo3", "veo 3.1", "video generation", "生成视频", "@runapi.ai/veo-3-1".
documentation: https://runapi.ai/models/veo-3.1
provider_page: https://runapi.ai/providers/google
catalog: https://runapi.ai/models
---
# @runapi.ai/veo-3-1 — RunAPI.ai Veo 3.1 video generation

Use `Veo31Client` for Veo 3.1 video tasks.

```ts
import { Veo31Client } from '@runapi.ai/veo-3-1';

const client = new Veo31Client({ apiKey: process.env.RUNAPI_API_KEY });

const result = await client.textToVideo.run({
  prompt: 'A low-angle tracking shot through a neon market at night',
});
```
