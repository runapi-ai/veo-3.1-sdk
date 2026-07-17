import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import { AuthenticationError } from '@runapi.ai/core';
import { Veo31Client } from '../../src/client';

const originalEnv = process.env.RUNAPI_API_KEY;

describe('Veo31Client', () => {
  beforeEach(() => {
    delete process.env.RUNAPI_API_KEY;
  });

  afterAll(() => {
    if (originalEnv === undefined) {
      delete process.env.RUNAPI_API_KEY;
    } else {
      process.env.RUNAPI_API_KEY = originalEnv;
    }
  });

  it('throws when apiKey missing and env unset', () => {
    expect(() => new Veo31Client()).toThrow(AuthenticationError);
    expect(() => new Veo31Client({ apiKey: '' })).toThrow(AuthenticationError);
  });

  it('reads apiKey from RUNAPI_API_KEY env var', () => {
    process.env.RUNAPI_API_KEY = 'env-key';
    const client = new Veo31Client();
    expect(client).toBeInstanceOf(Veo31Client);
    expect(client.textToVideo).toBeDefined();
  });

  it('initializes with valid API key', () => {
    const client = new Veo31Client({ apiKey: 'test-key' });
    expect(client).toBeInstanceOf(Veo31Client);
    expect(client.textToVideo).toBeDefined();
    expect(client.extendVideo).toBeDefined();
    expect(client.upscaleVideo).toBeDefined();
  });

  it('accepts baseUrl option', () => {
    const client = new Veo31Client({
      apiKey: 'test-key',
      baseUrl: 'https://runapi.ai',
    });
    expect(client).toBeInstanceOf(Veo31Client);
  });
});
