import type { AsyncTaskStatus } from '@runapi.ai/core';
import type { contract } from './contract_gen';

type ContractModel<T> = T extends { readonly models: readonly (infer Model extends string)[] } ? Model : never;

export type Veo31Model = ContractModel<(typeof contract)[keyof typeof contract]>;
export type OutputResolution = '1080p' | '4k';

/**
 * Input modes for video generation.
 * - text: pure text-to-video generation
 * - first_and_last_frames: image-to-video with first/last frame images
 * - reference: reference-based generation with 1-3 reference images (Fast or Lite; Lite uses 8s and 16:9)
 */
export type InputMode = 'text' | 'first_and_last_frames' | 'reference';

/**
 * Video aspect ratios.
 * - 16:9: Landscape
 * - 9:16: Portrait
 * - auto: Automatic cropping based on input dimensions
 */
export type AspectRatio = '16:9' | '9:16' | 'auto';
export type Duration = 4 | 6 | 8;

export interface TextToVideoParams {
  /** Text description of desired video content */
  prompt: string;
  /** Model to use for generation */
  model: Veo31Model;
  /** Input mode (defaults to text) */
  input_mode?: InputMode;
  /** Video aspect ratio (defaults to 16:9) */
  aspect_ratio?: AspectRatio;
  /** Generated video duration in seconds (defaults to 8) */
  duration_seconds?: Duration;
  /** Random seed (10000-99999) for reproducibility */
  seeds?: number;
  /** Auto-translate prompt to English (default: true) */
  enable_translation?: boolean;
  /** Optional watermark text to add to video */
  watermark?: string;
  /** URL for completion callback */
  callback_url?: string;
  /** First frame image URL for first_and_last_frames mode */
  first_frame_image_url?: string;
  /** Last frame image URL for first_and_last_frames mode */
  last_frame_image_url?: string;
  /** 1-3 reference image URLs for reference mode */
  reference_image_urls?: string[];
}

export interface ExtendVideoParams {
  /** Task ID of the original video to extend */
  source_task_id: string;
  /** Optional text description for the extension content */
  prompt?: string;
  /** Random seed (10000-99999) for reproducibility */
  seeds?: number;
  /** Optional watermark text to add to extended video */
  watermark?: string;
  /** URL for completion callback */
  callback_url?: string;
}

export interface UpscaleVideoParams {
  /** Task ID of the source video */
  source_task_id: string;
  /** Output resolution */
  output_resolution: OutputResolution;
  /** Video index if multiple videos were generated (default: 0) */
  index?: number;
  /** URL for completion callback */
  callback_url?: string;
}

export interface TaskCreateResponse {
  id: string;
}

export interface VideoMetadata {
  url: string;
  resolution: string;
  has_audio?: boolean;
  [key: string]: unknown;
}

export interface SourceMetadata {
  url: string;
  [key: string]: unknown;
}

export interface TextToVideoResponse {
  id: string;
  status: AsyncTaskStatus;
  model?: Veo31Model;
  videos?: VideoMetadata[];
  sources?: SourceMetadata[];
  error?: string;
  [key: string]: unknown;
}

export interface ExtendVideoResponse {
  id: string;
  status: AsyncTaskStatus;
  videos?: VideoMetadata[];
  sources?: SourceMetadata[];
  error?: string;
  [key: string]: unknown;
}

export interface UpscaleVideoResponse {
  id: string;
  status: AsyncTaskStatus;
  source_task_id?: string;
  videos?: VideoMetadata[];
  sources?: SourceMetadata[];
  media_ids?: string[];
  error?: string;
  [key: string]: unknown;
}

/**
 * Resolved responses returned by the `run()` methods after polling sees
 * `status: 'completed'`.
 */
export type CompletedTextToVideoResponse = TextToVideoResponse & {
  status: 'completed';
  videos: VideoMetadata[];
};

export type CompletedExtendVideoResponse = ExtendVideoResponse & {
  status: 'completed';
  videos: VideoMetadata[];
};

export type CompletedUpscaleVideoResponse = UpscaleVideoResponse & {
  status: 'completed';
  videos: VideoMetadata[];
};
