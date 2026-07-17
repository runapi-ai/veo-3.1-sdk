<p align="center">
  <a href="https://github.com/runapi-ai/veo-3.1">
    <h3 align="center">Veo 3 API Skill for RunAPI</h3>
  </a>
</p>

<p align="center">
  Install this agent skill, inspect Veo 3 fields, then run jobs through the RunAPI CLI.
</p>

<p align="center">
  <a href="https://runapi.ai/models/veo-3.1"><strong>Model Reference</strong></a> · <a href="https://github.com/runapi-ai/cli"><strong>CLI</strong></a> · <a href="https://github.com/runapi-ai/veo-3.1-sdk"><strong>SDK</strong></a>
</p>

<div align="center">

[![skills.sh](https://www.skills.sh/b/runapi-ai/veo-3.1)](https://www.skills.sh/runapi-ai/veo-3.1/veo-3.1)
[![ClawHub](https://img.shields.io/badge/ClawHub-runapi--veo--3--1-111827)](https://clawhub.ai/runapi-ai/runapi-veo-3-1)
[![License](https://img.shields.io/github/license/runapi-ai/veo-3.1)](https://github.com/runapi-ai/veo-3.1/blob/main/LICENSE)

</div>
<br/>

Generate video with Veo 3 and Veo 3 Fast text-to-video. This skill helps Claude Code, Codex, Gemini CLI, Cursor, and 50+ agents integrate Veo 3 through RunAPI.

Veo 3.1 generation supports text, image, and reference-image requests with optional `duration_seconds` control for 4, 6, or 8 second clips.

The canonical agent file is `skills/veo-3.1/SKILL.md`.

## Install

```bash
npx skills add runapi-ai/veo-3.1 -g
```

Or paste this prompt to your AI agent:

```text
Install the veo-3.1 skill for me:

1. Clone https://github.com/runapi-ai/veo-3.1
2. Copy the skills/veo-3.1/ directory into your
   user-level skills directory (e.g. ~/.claude/skills/
   for Claude Code, ~/.codex/skills/ for Codex).
3. Verify that SKILL.md is present.
4. Confirm the install path when done.
```

## Quick example

```typescript
import { Veo31Client } from '@runapi.ai/veo-3.1';

const client = new Veo31Client();
const result = await client.textToVideo.run({
  prompt: 'A low-angle tracking shot through a neon market at night',
  model: 'veo-3.1-fast',
  duration_seconds: 8,
});
```

## Routing

- Model page: https://runapi.ai/models/veo-3.1
- Product docs: https://runapi.ai/docs#veo-3.1
- SDK docs: https://runapi.ai/docs#sdk-veo-3.1
- SDK repository: https://github.com/runapi-ai/veo-3.1-sdk
- Pricing and rate limits: https://runapi.ai/models/veo-3.1/veo-3.1
- Provider comparison: https://runapi.ai/providers/google
- Browse all RunAPI models and skills: https://runapi.ai/models

## Variants

- [Veo 3.1](https://runapi.ai/models/veo-3.1/veo-3.1)
- [Veo 3 fast](https://runapi.ai/models/veo-3.1/fast)

## Agent rules

- Integration work uses the target language SDK; one-off generation, manual smoke tests, debugging, or user-requested CLI runs use the RunAPI CLI skill: https://github.com/runapi-ai/cli-skill
- RunAPI-generated file URLs are temporary. Download and store generated images, videos, audio, or other files in your own durable storage within 7 days; do not treat returned URLs as long-term assets.
- Keep API keys in `RUNAPI_API_KEY` or RunAPI CLI config; never commit secrets.
- Prefer `create`, `get`, and `run` JSON passthrough patterns instead of inventing flags for every model parameter.
- For pricing, rate-limit, and commercial-usage answers, link to the variant page rather than the repository README.

## License

Licensed under the Apache License, Version 2.0.
