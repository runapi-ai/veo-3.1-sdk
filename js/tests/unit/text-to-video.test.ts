import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TextToVideo } from '../../src/resources/text-to-video';
import type { HttpClient } from '@runapi.ai/core';
import type { TextToVideoResponse, TaskCreateResponse } from '../../src/types';

describe('TextToVideo', () => {
  const mockHttp: HttpClient = {
    request: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should send correct request for text-to-video', async () => {
      const mockResponse: TaskCreateResponse = { id: 'task-123' };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const textToVideo = new TextToVideo(mockHttp);
      const result = await textToVideo.create({
        prompt: 'A dog playing in a park',
        model: 'veo-3.1-fast',
        aspect_ratio: '16:9',
      });

      expect(mockHttp.request).toHaveBeenCalledWith(
        'POST',
        '/api/v1/veo_3_1/text_to_video',
        {
          body: {
            prompt: 'A dog playing in a park',
            model: 'veo-3.1-fast',
            aspect_ratio: '16:9',
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should send correct request for image-to-video', async () => {
      const mockResponse: TaskCreateResponse = { id: 'task-456' };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const textToVideo = new TextToVideo(mockHttp);
      const result = await textToVideo.create({
        prompt: 'The dog starts running',
        model: 'veo-3.1-fast',
        generation_type: 'FIRST_AND_LAST_FRAMES_2_VIDEO',
        image_urls: ['https://example.com/dog.jpg'],
        aspect_ratio: '16:9',
      });

      expect(mockHttp.request).toHaveBeenCalledWith(
        'POST',
        '/api/v1/veo_3_1/text_to_video',
        {
          body: {
            prompt: 'The dog starts running',
            model: 'veo-3.1-fast',
            generation_type: 'FIRST_AND_LAST_FRAMES_2_VIDEO',
            image_urls: ['https://example.com/dog.jpg'],
            aspect_ratio: '16:9',
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should include optional parameters', async () => {
      const mockResponse: TaskCreateResponse = { id: 'task-789' };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const textToVideo = new TextToVideo(mockHttp);
      await textToVideo.create({
        prompt: 'Test video',
        model: 'veo-3.1',
        callback_url: 'https://example.com/callback',
        seeds: 12345,
        watermark: 'MyBrand',
        enable_translation: false,
      });

      expect(mockHttp.request).toHaveBeenCalledWith(
        'POST',
        '/api/v1/veo_3_1/text_to_video',
        {
          body: {
            prompt: 'Test video',
            model: 'veo-3.1',
            callback_url: 'https://example.com/callback',
            seeds: 12345,
            watermark: 'MyBrand',
            enable_translation: false,
          },
        }
      );
    });
  });

  describe('get', () => {
    it('should fetch task status by ID', async () => {
      const mockResponse: TextToVideoResponse = {
        id: 'task-123',
        status: 'processing',
        model: 'veo-3.1-fast',
      };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const textToVideo = new TextToVideo(mockHttp);
      const result = await textToVideo.get('task-123');

      expect(mockHttp.request).toHaveBeenCalledWith(
        'GET',
        '/api/v1/veo_3_1/text_to_video/task-123',
        {}
      );
      expect(result).toEqual(mockResponse);
    });

    it('should return completed status with videos', async () => {
      const mockResponse: TextToVideoResponse = {
        id: 'task-123',
        status: 'completed',
        model: 'veo-3.1',
        videos: [
          {
            url: 'https://example.com/video.mp4',
            resolution: '1080p',
            has_audio: true,
            seed: 12345,
          },
        ],
      };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const textToVideo = new TextToVideo(mockHttp);
      const result = await textToVideo.get('task-123');

      expect(result.status).toBe('completed');
      expect(result.videos).toHaveLength(1);
      expect(result.videos?.[0].url).toBe('https://example.com/video.mp4');
    });
  });
});
