import type { HttpClient, RequestOptions, PollingOptions } from '@runapi.ai/core';
import { compactParams } from '@runapi.ai/core';
import { pollUntilComplete } from '@runapi.ai/core/internal';
import type {
  CompletedExtendVideoResponse,
  ExtendVideoParams,
  ExtendVideoResponse,
  TaskCreateResponse,
} from '../types';

const ENDPOINT = '/api/v1/veo_3_1/extend_video';

export class ExtendVideo {
  constructor(private readonly http: HttpClient) {}

  async run(params: ExtendVideoParams, options?: RequestOptions & PollingOptions): Promise<CompletedExtendVideoResponse> {
    const { id } = await this.create(params, options);
    const response = await pollUntilComplete<ExtendVideoResponse>(() => this.get(id, options), {
      maxWaitMs: options?.maxWaitMs,
      pollIntervalMs: options?.pollIntervalMs,
    });
    return response as CompletedExtendVideoResponse;
  }

  async create(params: ExtendVideoParams, options?: RequestOptions): Promise<TaskCreateResponse> {
    return this.http.request<TaskCreateResponse>('POST', ENDPOINT, {
      body: compactParams(params),
      ...options,
    });
  }

  async get(id: string, options?: RequestOptions): Promise<ExtendVideoResponse> {
    return this.http.request<ExtendVideoResponse>('GET', `${ENDPOINT}/${id}`, {
      ...options,
    });
  }
}
