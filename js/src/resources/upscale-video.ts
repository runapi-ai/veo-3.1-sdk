import type { HttpClient, RequestOptions, PollingOptions } from '@runapi.ai/core';
import { compactParams } from '@runapi.ai/core';
import { pollUntilComplete } from '@runapi.ai/core/internal';
import type {
  CompletedUpscaleVideoResponse,
  UpscaleVideoParams,
  UpscaleVideoResponse,
  TaskCreateResponse,
} from '../types';

const ENDPOINT = '/api/v1/veo_3_1/upscale_video';

/** Increase resolution of a completed text-to-video or extend-video task to 1080p or 4K. */
export class UpscaleVideo {
  constructor(private readonly http: HttpClient) {}

  /**
   * Create an upscale video task and wait until complete.
   * @param params Upscale video parameters.
   * @param options Per-request and polling overrides.
   * @returns The completed upscale video response.
   */
  async run(params: UpscaleVideoParams, options?: RequestOptions & PollingOptions): Promise<CompletedUpscaleVideoResponse> {
    const { id } = await this.create(params, options);
    const response = await pollUntilComplete<UpscaleVideoResponse>(() => this.get(id, options), {
      maxWaitMs: options?.maxWaitMs,
      pollIntervalMs: options?.pollIntervalMs,
    });
    return response as CompletedUpscaleVideoResponse;
  }

  /**
   * Create an upscale video task; returns immediately with a task id.
   * @param params Upscale video parameters.
   * @param options Per-request overrides.
   * @returns The task creation result.
   */
  async create(params: UpscaleVideoParams, options?: RequestOptions): Promise<TaskCreateResponse> {
    return this.http.request<TaskCreateResponse>('POST', ENDPOINT, {
      body: compactParams(params),
      ...options,
    });
  }

  /**
   * Fetch the current status of an upscale video task.
   * @param id The task id.
   * @param options Per-request overrides.
   * @returns The current upscale video task status.
   */
  async get(id: string, options?: RequestOptions): Promise<UpscaleVideoResponse> {
    return this.http.request<UpscaleVideoResponse>('GET', `${ENDPOINT}/${id}`, {
      ...options,
    });
  }
}
