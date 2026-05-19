import { createHttpClient, type ClientOptions } from '@runapi.ai/core';
import { TextToVideo } from './resources/text-to-video';
import { ExtendVideo } from './resources/extend-video';
import { UpscaleVideo } from './resources/upscale-video';

/**
 * Veo 3.1 video API client.
 *
 * @example
 * ```typescript
 * const client = new Veo31Client({ apiKey: 'your-api-key' });
 *
 * const result = await client.textToVideo.run({
 *   model: 'veo-3.1-fast',
 *   prompt: 'A drone shot over mountains at sunset',
 * });
 * ```
 */
export class Veo31Client {
  /** Text, image, and reference-to-video operations. */
  public readonly textToVideo: TextToVideo;
  /** Video extension operations. */
  public readonly extendVideo: ExtendVideo;
  /** Video upscaling operations. */
  public readonly upscaleVideo: UpscaleVideo;

  constructor(options: ClientOptions = {}) {
    const http = createHttpClient(options);
    this.textToVideo = new TextToVideo(http);
    this.extendVideo = new ExtendVideo(http);
    this.upscaleVideo = new UpscaleVideo(http);
  }
}
