import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ExtendVideo } from '../../src/resources/extend-video';
import type { HttpClient } from '@runapi.ai/core';
import type { ExtendVideoResponse, TaskCreateResponse } from '../../src/types';

describe('ExtendVideo', () => {
  const mockHttp: HttpClient = {
    request: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should send correct extend-video request', async () => {
    const mockResponse: TaskCreateResponse = { id: 'ext-123' };
    vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

    const extendVideo = new ExtendVideo(mockHttp);
    const result = await extendVideo.create({
      source_task_id: 'task-123',
      prompt: 'Continue the scene',
      seeds: 12345,
      watermark: 'MyBrand',
    });

    expect(mockHttp.request).toHaveBeenCalledWith(
      'POST',
      '/api/v1/veo_3_1/extend_video',
      {
        body: {
          source_task_id: 'task-123',
          prompt: 'Continue the scene',
          seeds: 12345,
          watermark: 'MyBrand',
        },
      }
    );
    expect(result).toEqual(mockResponse);
  });

  it('should fetch extend-video status by ID', async () => {
    const mockResponse: ExtendVideoResponse = {
      id: 'ext-123',
      status: 'processing',
    };
    vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

    const extendVideo = new ExtendVideo(mockHttp);
    const result = await extendVideo.get('ext-123');

    expect(mockHttp.request).toHaveBeenCalledWith(
      'GET',
      '/api/v1/veo_3_1/extend_video/ext-123',
      {}
    );
    expect(result).toEqual(mockResponse);
  });

  it('should return completed status with videos and sources', async () => {
    const mockResponse: ExtendVideoResponse = {
      id: 'ext-123',
      status: 'completed',
      videos: [
        {
          url: 'https://cdn.runapi.ai/public/samples/result.mp4',
          resolution: '1080p',
          has_audio: true,
        },
      ],
      sources: [
        {
          url: 'https://cdn.runapi.ai/public/samples/source.mp4',
        },
      ],
    };
    vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

    const extendVideo = new ExtendVideo(mockHttp);
    const result = await extendVideo.get('ext-123');

    expect(result.status).toBe('completed');
    expect(result.videos?.[0].url).toBe('https://cdn.runapi.ai/public/samples/result.mp4');
    expect(result.sources?.[0].url).toBe('https://cdn.runapi.ai/public/samples/source.mp4');
  });
});
