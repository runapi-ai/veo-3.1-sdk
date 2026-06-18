import { BaseClient, type ClientOptions } from '@runapi.ai/core';
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
export class Veo31Client extends BaseClient {
  /** Generate video from text, first/last frame images, or reference images for style/subject guidance. */
  public readonly textToVideo: TextToVideo;
  /** Append additional footage to a previously generated video. */
  public readonly extendVideo: ExtendVideo;
  /** Increase video resolution to 1080p or 4K. */
  public readonly upscaleVideo: UpscaleVideo;

  constructor(options: ClientOptions = {}) {
    super(options);
    this.textToVideo = new TextToVideo(this.http);
    this.extendVideo = new ExtendVideo(this.http);
    this.upscaleVideo = new UpscaleVideo(this.http);
  }
}
