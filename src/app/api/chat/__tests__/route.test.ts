/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * @jest-environment node
 */

// Mock next/server for the node test environment
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: unknown, init?: ResponseInit) =>
      new Response(JSON.stringify(data), {
        ...init,
        headers: { 'content-type': 'application/json', ...(init?.headers ?? {}) },
      }),
    next: () => new Response(null, { status: 200 }),
  },
}));

import { POST } from '../route';

// Mock services
jest.mock('@/services/ai.service', () => ({
  createAIService: jest.fn().mockReturnValue({
    askAssistant: jest.fn().mockResolvedValue('Mocked text from Gemini SDK'),
  }),
}));

jest.mock('@/services/analytics.service', () => ({
  analyticsService: {
    logInteraction: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('@/lib/rateLimit', () => ({
  rateLimit: jest.fn().mockReturnValue(true),
}));

// Mock the cache utility
jest.mock('@/lib/cache', () => ({
  withCache: jest.fn((_key: string, _ttl: number, fetcher: () => Promise<unknown>) => fetcher()),
}));

// Mock logger
jest.mock('@/lib/logger', () => ({
  __esModule: true,
  default: { info: jest.fn(), error: jest.fn(), warn: jest.fn(), debug: jest.fn() },
}));

// Mock redis
jest.mock('@/lib/redis', () => ({ redis: null, quitRedis: jest.fn() }));

describe('Chat API Route', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('returns a 400 error if message is missing', async () => {
    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error.message).toMatch(/Validation failed/i);
  });

  it('returns a mock fallback response when GEMINI_API_KEY is not set or is mock-key', async () => {
    process.env.GEMINI_API_KEY = 'mock-key';

    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'Hello' }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.reply).toContain('mock mode');
  });

  it('uses the Gemini model when GEMINI_API_KEY is properly set', async () => {
    process.env.GEMINI_API_KEY = 'real-api-key-123';

    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'Hello' }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.reply).toBe('Mocked text from Gemini SDK');
  });

  it('returns 429 when rate limit is exceeded', async () => {
    jest.isolateModules(async () => {
      const { POST } = require('../route');
      const { rateLimit } = require('@/lib/rateLimit');
      rateLimit.mockReturnValueOnce(false);

      const req = new Request('http://localhost/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: 'Hello' }),
      });

      const response = await POST(req);
      expect(response.status).toBe(429);
    });
  });

  it('returns 500 on unexpected errors', async () => {
    jest.isolateModules(async () => {
      const { POST } = require('../route');
      const { createAIService } = require('@/services/ai.service');
      const mockService = createAIService();
      mockService.askAssistant.mockRejectedValueOnce(new Error('Unexpected crash'));

      const req = new Request('http://localhost/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: 'Hello' }),
      });

      const response = await POST(req);
      expect(response.status).toBe(500);
    });
  });
});
