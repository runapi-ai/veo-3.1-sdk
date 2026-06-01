<p align="center">
  <a href="https://runapi.ai"><img src="https://runapi.ai/icon.svg" height="56" alt="RunAPI"></a>
</p>

<h3 align="center">
  <a href="https://github.com/runapi-ai/veo-3.1-sdk">Veo 3 API SDK for RunAPI</a>
</h3>

<p align="center">
  Veo 3 API SDKs for JavaScript, Ruby, and Go on RunAPI.
</p>

<div align="center">

[![npm](https://img.shields.io/npm/v/@runapi.ai/veo-3.1)](https://www.npmjs.com/package/@runapi.ai/veo-3.1)
[![RubyGems](https://img.shields.io/gem/v/runapi-veo-3.1)](https://rubygems.org/gems/runapi-veo-3.1)
[![Go Reference](https://pkg.go.dev/badge/github.com/runapi-ai/veo-3.1-sdk/go.svg)](https://pkg.go.dev/github.com/runapi-ai/veo-3.1-sdk/go)
[![License](https://img.shields.io/github/license/runapi-ai/veo-3.1-sdk)](https://github.com/runapi-ai/veo-3.1-sdk/blob/main/LICENSE)

</div>
<br/>

The veo api SDK packages JavaScript, Ruby, and Go clients for Veo 3 video generation on RunAPI. Use this veo api SDK for text-to-video, image-to-video, video extension, and 1080p upgrade workflows.

## Installation

```bash
npm install @runapi.ai/veo-3-1
# or
pnpm add @runapi.ai/veo-3-1
# or
yarn add @runapi.ai/veo-3-1
```

## Quick Start

```typescript
import { Veo31Client } from '@runapi.ai/veo-3-1';

const client = new Veo31Client({
  apiKey: 'your-api-key',
  baseUrl: 'https://runapi.ai', // optional
});

const result = await client.textToVideo.run({
  prompt: 'A dog playing in a park on a sunny day',
  model: 'veo-3.1-fast',
  aspect_ratio: '16:9',
  duration_seconds: 8,
});

console.log('Video URL:', result.videos?.[0].url);
```

## Features

- **Text-to-Video**: Generate videos from text prompts
- **Image-to-Video**: Animate static images or create transitions between two images
- **Video Extension**: Extend existing videos with additional content
- **1080P Upgrade**: Request high-definition versions of generated videos
- **Full TypeScript Support**: Complete type definitions for all API endpoints
- **Automatic Polling**: Built-in polling for async video generation
- **Error Handling**: Comprehensive error types from @runapi.ai/core

## API Reference

### Client Initialization

```typescript
const client = new Veo31Client({
  apiKey: string;      // Required: Your RunAPI.ai API key
  baseUrl?: string;    // Optional: API base URL (defaults to production)
});
```

### Video Generation

#### Text-to-Video

```typescript
const result = await client.textToVideo.run({
  prompt: 'A beautiful sunset over mountains',
  model: 'veo-3.1-fast', // or 'veo-3.1' for higher quality
  aspect_ratio: '16:9', // or '9:16', 'auto'
  duration_seconds: 8, // optional: 4, 6, or 8 seconds
  seeds: 12345, // optional: for reproducibility
  enable_translation: true, // optional: auto-translate to English
  watermark: 'MyBrand', // optional
  callback_url: 'https://your-domain.com/webhook', // optional
});
```

#### Image-to-Video

```typescript
const result = await client.textToVideo.run({
  prompt: 'The dog starts running energetically',
  model: 'veo-3.1-fast',
  input_mode: 'first_and_last_frames',
  first_frame_image_url: 'https://cdn.runapi.ai/public/samples/image-to-video.jpg',
  aspect_ratio: '16:9',
  duration_seconds: 8,
});
```

#### Manual Control (Create + Poll)

```typescript
const task = await client.textToVideo.create({
  prompt: 'A serene lake',
  model: 'veo-3.1-fast',
});

const status = await client.textToVideo.get(task.id);
console.log('Status:', status.status);
```

### Video Extension

```typescript
const original = await client.textToVideo.run({
  prompt: 'A dog playing with a ball',
  model: 'veo-3.1-fast',
});

const extended = await client.extendVideo.run({
  source_task_id: original.id,
  prompt: 'The dog catches the ball and runs back',
});
```

### 1080P Upgrade

```typescript
const original = await client.textToVideo.run({
  prompt: 'A cinematic landscape',
  model: 'veo-3.1',
  aspect_ratio: '16:9',
});

const hd = await client.upscaleVideo.run({
  source_task_id: original.id,
  output_resolution: '1080p',
  index: 0,
});

console.log('1080P video:', hd.videos?.[0]?.url);
```

## Models

| Model | Description | Pricing | Use Case |
|-------|-------------|---------|----------|
| `veo-3.1` | Quality model | [Pricing](https://runapi.ai/models/veo-3.1/veo-3.1) | High fidelity, production use |
| `veo-3.1-fast` | Fast model | [Pricing](https://runapi.ai/models/veo-3.1/fast) | Rapid iteration and drafts |

## Input Modes

| Type | Description | Requirements |
|------|-------------|--------------|
| `text` | Pure text-to-video | Prompt only |
| `first_and_last_frames` | Image-to-video | `first_frame_image_url`, optional `last_frame_image_url` |
| `reference` | Reference-based | `reference_image_urls` with 1-3 images, veo-3.1-fast only, 16:9 only |

## Aspect Ratios

- `16:9`: Landscape (default, supports 1080P upgrade)
- `9:16`: Portrait (mobile-friendly)
- `auto`: Automatic cropping based on input

## Duration

Text, image, and reference-image requests can set `duration_seconds` to `4`, `6`, or `8` seconds. When omitted, the service uses the default duration.

## Error Handling

```typescript
import {
  Veo31Client,
  AuthenticationError,
  InsufficientCreditsError,
  ValidationError,
  TaskFailedError,
} from '@runapi.ai/veo-3-1';

try {
  const result = await client.textToVideo.run({
    prompt: 'A beautiful scene',
    model: 'veo-3.1-fast',
  });
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Invalid API key');
  } else if (error instanceof InsufficientCreditsError) {
    console.error('Not enough credits');
  } else if (error instanceof ValidationError) {
    console.error('Invalid parameters');
  } else if (error instanceof TaskFailedError) {
    console.error('Video generation failed');
  }
}
```

## Advanced Usage

### Callbacks

```typescript
const result = await client.textToVideo.create({
  prompt: 'A video',
  model: 'veo-3.1-fast',
  callback_url: 'https://your-domain.com/webhook',
});
```

Webhook payload on completion:
```typescript
{
  id: string;
  status: 'completed' | 'failed';
  videos?: VideoMetadata[];
  error?: string;
}
```

### Reproducible Generation

```typescript
const result1 = await client.textToVideo.run({
  prompt: 'A scene',
  model: 'veo-3.1-fast',
  seeds: 42857,
});

const result2 = await client.textToVideo.run({
  prompt: 'A scene',
  model: 'veo-3.1-fast',
  seeds: 42857,
});
```

For full veo api documentation including all parameters and response formats, visit https://runapi.ai/docs#veo-3.1.

## License

MIT

## Support

For issues and questions, please visit [https://github.com/runapi-ai/runapi.ai](https://github.com/runapi-ai/runapi.ai)
