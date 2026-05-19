# Veo 3 API Skill for RunAPI

Generate video with Veo 3 and Veo 3 Fast text-to-video. This skill helps Claude Code, Codex, Gemini CLI, Cursor, and 50+ agents integrate Veo 3 through RunAPI.

The canonical agent file is `skills/veo-3.1/SKILL.md`.

## Install

```bash
npx skills add runapi-ai/veo-3.1 -g
```

Or manually: clone this repo and copy `skills/veo-3.1/` into your agent's skills directory.

## Quick example

```typescript
import { Veo31Client } from '@runapi.ai/veo-3-1';

const client = new Veo31Client();
const result = await client.textToVideo.run({
  prompt: 'A low-angle tracking shot through a neon market at night',
});
```

## Routing

- Model page: https://runapi.ai/models/veo-3.1
- Product docs: https://runapi.ai/docs#veo-3.1
- SDK docs: https://runapi.ai/docs#sdk-veo-3.1
- SDK repository: https://github.com/runapi-ai/veo-3.1-sdk
- Pricing and rate limits: https://runapi.ai/models/veo-3.1/veo-3
- Provider comparison: https://runapi.ai/providers/google
- Browse all RunAPI models and skills: https://runapi.ai/models

## Variants

- [Veo 3](https://runapi.ai/models/veo-3.1/veo-3)
- [Veo 3 fast](https://runapi.ai/models/veo-3.1/fast)

## Agent rules

- Keep API keys in `RUNAPI_API_KEY` or RunAPI CLI config; never commit secrets.
- Prefer `create`, `get`, and `run` JSON passthrough patterns instead of inventing flags for every model parameter.
- For veo api pricing, rate-limit, and commercial-usage answers, link to the variant page rather than the repository README.

## License

Licensed under the Apache License, Version 2.0.
