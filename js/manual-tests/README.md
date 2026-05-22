# Veo 3.1 SDK Manual Testing Guide

This directory contains manual test scripts for validating the `@runapi.ai/veo-3-1` SDK with real API calls.

## Prerequisites

### 1. Start Rails Server

```bash
bin/dev
```

Server should be available at `http://localhost:3000`.

### 2. Get API Key

```bash
bin/rails console
```

Then:
```ruby
ApiToken.first.token
```

### 3. Configure Environment Variables

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```env
RUNAPI_API_KEY=your-api-key-here
RUNAPI_BASE_URL=http://localhost:3000
```

## Available Tests

### Test 1: Text-to-Video Generation
**File:** `test-text-to-video.ts`

Tests pure text-to-video generation.

```bash
cd sdk/js
pnpm --filter @runapi.ai/veo-3-1 test:text2video
```

### Test 2: Image-to-Video Generation
**File:** `test-image-to-video.ts`

Tests image-to-video with 1 or 2 images.

```bash
pnpm --filter @runapi.ai/veo-3-1 test:image2video
```

### Test 3: Reference-to-Video Generation
**File:** `test-reference-to-video.ts`

Tests reference-based generation with 1-3 images (veo-3.1-fast only, 16:9 only).

```bash
pnpm --filter @runapi.ai/veo-3-1 test:reference2video
```

### Test 4: Video Extension
**File:** `test-extend-video.ts`

Tests extending existing videos.

```bash
pnpm --filter @runapi.ai/veo-3-1 test:extend-video
```

### Test 5: 1080p Upgrade
**File:** `test-upscale-video.ts`

Tests requesting 1080p versions of videos.

```bash
pnpm --filter @runapi.ai/veo-3-1 test:upscale-video
```

### Test 6: Model Comparison
**File:** `test-model-comparison.ts`

Compares veo-3.1 vs veo-3.1-fast models.

```bash
pnpm --filter @runapi.ai/veo-3-1 run test:model
```

### Test 7: Error Handling
**File:** `test-error-handling.ts`

Tests error scenarios and error types.

```bash
pnpm --filter @runapi.ai/veo-3-1 run test:errors
```

### Test 8: Run All Tests
**File:** `test-all.ts`

Runs all tests sequentially with summary report.

```bash
pnpm --filter @runapi.ai/veo-3-1 test:all
# or
pnpm --filter @runapi.ai/veo-3-1 test:manual
```

## Test Coverage

- ✅ Text-to-video generation (TEXT_2_VIDEO)
- ✅ Image-to-video generation (FIRST_AND_LAST_FRAMES_2_VIDEO)
- ✅ Reference-to-video generation (REFERENCE_2_VIDEO)
- ✅ Video extension
- ✅ 1080p upgrade (UpscaleVideo)
- ✅ veo-3.1-fast model
- ✅ veo-3.1 quality model
- ✅ create() method (async task creation)
- ✅ get() method (status polling)
- ✅ run() method (complete workflow)
- ✅ Error handling (AuthenticationError, ValidationError, NotFoundError, etc.)

## Troubleshooting

### "API key is required" Error
```bash
echo $RUNAPI_API_KEY
export RUNAPI_API_KEY="your-token"
```

### "Connection refused" Error
```bash
curl http://localhost:3000/api/v1/me
bin/dev
```

### "Insufficient credits" Error
Check credits in Rails console:
```ruby
User.first.account.credits
```

## Tips

1. Start with text-to-video test for quick verification
2. Use veo-3.1-fast for faster testing (50 credits vs 100)
3. Monitor backend logs: `tail -f log/development.log`
4. Verify generated videos by clicking result URLs
