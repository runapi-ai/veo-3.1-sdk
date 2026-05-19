import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpscaleVideo } from '../../src/resources/upscale-video';
import type { HttpClient } from '@runapi.ai/core';
import type { UpscaleVideoResponse, TaskCreateResponse } from '../../src/types';

describe('UpscaleVideo', () => {
  const mockHttp: HttpClient = {
    request: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should send correct 1080p request', async () => {
      const mockResponse: TaskCreateResponse = { id: 'upscale-123' };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const upscaleVideo = new UpscaleVideo(mockHttp);
      const result = await upscaleVideo.create({
        task_id: 'task-123',
        target_resolution: '1080p',
        index: 0,
        callback_url: 'https://example.com/callback',
      });

      expect(mockHttp.request).toHaveBeenCalledWith(
        'POST',
        '/api/v1/veo_3_1/upscale_video',
        {
          body: {
            task_id: 'task-123',
            target_resolution: '1080p',
            index: 0,
            callback_url: 'https://example.com/callback',
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should send correct 4k request', async () => {
      const mockResponse: TaskCreateResponse = { id: 'upscale-456' };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const upscaleVideo = new UpscaleVideo(mockHttp);
      await upscaleVideo.create({
        task_id: 'task-456',
        target_resolution: '4k',
      });

      expect(mockHttp.request).toHaveBeenCalledWith(
        'POST',
        '/api/v1/veo_3_1/upscale_video',
        {
          body: {
            task_id: 'task-456',
            target_resolution: '4k',
          },
        }
      );
    });
  });

  describe('get', () => {
    it('should fetch upscale status by ID', async () => {
      const mockResponse: UpscaleVideoResponse = {
        id: 'upscale-123',
        status: 'processing',
        original_task_id: 'task-123',
      };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const upscaleVideo = new UpscaleVideo(mockHttp);
      const result = await upscaleVideo.get('upscale-123');

      expect(mockHttp.request).toHaveBeenCalledWith(
        'GET',
        '/api/v1/veo_3_1/upscale_video/upscale-123',
        {}
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
