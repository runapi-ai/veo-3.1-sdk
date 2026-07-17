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
        source_task_id: 'task-123',
        output_resolution: '1080p',
        index: 0,
        callback_url: 'https://your-domain.com/api/callback',
      });

      expect(mockHttp.request).toHaveBeenCalledWith(
        'POST',
        '/api/v1/veo_3_1/upscale_video',
        {
          body: {
            source_task_id: 'task-123',
            output_resolution: '1080p',
            index: 0,
            callback_url: 'https://your-domain.com/api/callback',
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
        source_task_id: 'task-456',
        output_resolution: '4k',
      });

      expect(mockHttp.request).toHaveBeenCalledWith(
        'POST',
        '/api/v1/veo_3_1/upscale_video',
        {
          body: {
            source_task_id: 'task-456',
            output_resolution: '4k',
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
        source_task_id: 'task-123',
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

    it('should return completed status with videos, sources, and media ids', async () => {
      const mockResponse: UpscaleVideoResponse = {
        id: 'upscale-123',
        status: 'completed',
        source_task_id: 'task-123',
        videos: [
          {
            url: 'https://cdn.runapi.ai/public/samples/result.mp4',
            resolution: '4k',
          },
        ],
        sources: [
          {
            url: 'https://cdn.runapi.ai/public/samples/thumb.jpg',
          },
        ],
        media_ids: ['media-1'],
      };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const upscaleVideo = new UpscaleVideo(mockHttp);
      const result = await upscaleVideo.get('upscale-123');

      expect(result.status).toBe('completed');
      expect(result.videos?.[0].url).toBe('https://cdn.runapi.ai/public/samples/result.mp4');
      expect(result.sources?.[0].url).toBe('https://cdn.runapi.ai/public/samples/thumb.jpg');
      expect(result.media_ids).toEqual(['media-1']);
    });
  });
});
