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

/** Append additional footage to a completed text-to-video task. */
export class ExtendVideo {
  constructor(private readonly http: HttpClient) {}

  /**
   * Create an extend video task and wait until complete.
   * @param params Extend video parameters.
   * @param options Per-request and polling overrides.
   * @returns The completed extend video response.
   */
  async run(params: ExtendVideoParams, options?: RequestOptions & PollingOptions): Promise<CompletedExtendVideoResponse> {
    const { id } = await this.create(params, options);
    const response = await pollUntilComplete<ExtendVideoResponse>(() => this.get(id, options), {
      maxWaitMs: options?.maxWaitMs,
      pollIntervalMs: options?.pollIntervalMs,
    });
    return response as CompletedExtendVideoResponse;
  }

  /**
   * Create an extend video task; returns immediately with a task id.
   * @param params Extend video parameters.
   * @param options Per-request overrides.
   * @returns The task creation result.
   */
  async create(params: ExtendVideoParams, options?: RequestOptions): Promise<TaskCreateResponse> {
    return this.http.request<TaskCreateResponse>('POST', ENDPOINT, {
      body: compactParams(params),
      ...options,
    });
  }

  /**
   * Fetch the current status of an extend video task.
   * @param id The task id.
   * @param options Per-request overrides.
   * @returns The current extend video task status.
   */
  async get(id: string, options?: RequestOptions): Promise<ExtendVideoResponse> {
    return this.http.request<ExtendVideoResponse>('GET', `${ENDPOINT}/${id}`, {
      ...options,
    });
  }
}
