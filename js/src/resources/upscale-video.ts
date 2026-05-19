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

export class UpscaleVideo {
  constructor(private readonly http: HttpClient) {}

  async run(params: UpscaleVideoParams, options?: RequestOptions & PollingOptions): Promise<CompletedUpscaleVideoResponse> {
    const { id } = await this.create(params, options);
    const response = await pollUntilComplete<UpscaleVideoResponse>(() => this.get(id, options), {
      maxWaitMs: options?.maxWaitMs,
      pollIntervalMs: options?.pollIntervalMs,
    });
    return response as CompletedUpscaleVideoResponse;
  }

  async create(params: UpscaleVideoParams, options?: RequestOptions): Promise<TaskCreateResponse> {
    return this.http.request<TaskCreateResponse>('POST', ENDPOINT, {
      body: compactParams(params),
      ...options,
    });
  }

  async get(id: string, options?: RequestOptions): Promise<UpscaleVideoResponse> {
    return this.http.request<UpscaleVideoResponse>('GET', `${ENDPOINT}/${id}`, {
      ...options,
    });
  }
}
