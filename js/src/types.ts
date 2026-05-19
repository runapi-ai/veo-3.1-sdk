import type { AsyncTaskStatus } from '@runapi.ai/core';

export type Veo31Model = 'veo-3.1' | 'veo-3.1-fast';
export type TargetResolution = '1080p' | '4k';

/**
 * Video generation types.
 * - TEXT_2_VIDEO: Pure text-to-video generation
 * - FIRST_AND_LAST_FRAMES_2_VIDEO: Image-to-video with 1-2 images
 * - REFERENCE_2_VIDEO: Reference-based generation with 1-3 images (fast model only, 16:9 only)
 */
export type GenerationType =
  | 'TEXT_2_VIDEO'
  | 'FIRST_AND_LAST_FRAMES_2_VIDEO'
  | 'REFERENCE_2_VIDEO';

/**
 * Video aspect ratios.
 * - 16:9: Landscape
 * - 9:16: Portrait
 * - auto: Automatic cropping based on input dimensions
 */
export type AspectRatio = '16:9' | '9:16' | 'auto';

export interface TextToVideoParams {
  /** Text description of desired video content */
  prompt: string;
  /** Model to use for generation */
  model: Veo31Model;
  /** Type of generation (defaults to TEXT_2_VIDEO) */
  generation_type?: GenerationType;
  /** Video aspect ratio (defaults to 16:9) */
  aspect_ratio?: AspectRatio;
  /** Random seed (10000-99999) for reproducibility */
  seeds?: number;
  /** Auto-translate prompt to English (default: true) */
  enable_translation?: boolean;
  /** Optional watermark text to add to video */
  watermark?: string;
  /** URL for completion callback */
  callback_url?: string;
  /** 1-3 image URLs for image-to-video or reference-based generation */
  image_urls?: string[];
}

export interface ExtendVideoParams {
  /** Task ID of the original video to extend */
  task_id: string;
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
  /** Task ID of the original video */
  task_id: string;
  /** Target output resolution */
  target_resolution: TargetResolution;
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

export interface TextToVideoResponse {
  id: string;
  status: AsyncTaskStatus;
  model?: Veo31Model;
  videos?: VideoMetadata[];
  error?: string;
  [key: string]: unknown;
}

export interface ExtendVideoResponse {
  id: string;
  status: AsyncTaskStatus;
  original_task_id?: string;
  videos?: VideoMetadata[];
  error?: string;
  [key: string]: unknown;
}

export interface UpscaleVideoResponse {
  id: string;
  status: AsyncTaskStatus;
  original_task_id?: string;
  video?: VideoMetadata;
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
  video: VideoMetadata;
};
