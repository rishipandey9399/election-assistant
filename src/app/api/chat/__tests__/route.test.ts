/**
 * @jest-environment node
 */
import { POST } from '../route';

// Mock the GoogleGenerativeAI module
jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => {
      return {
        getGenerativeModel: jest.fn().mockReturnValue({
          generateContent: jest.fn().mockResolvedValue({
            response: {
              text: () => 'Mocked text from Gemini SDK',
            },
          }),
        }),
      };
    }),
  };
});

// Mock the cache utility
jest.mock('@/lib/cache', () => ({
  withCache: jest.fn((key: string, ttl: number, fetcher: () => Promise<unknown>) => fetcher()),
}));

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
    expect(data.error).toMatch(/expected string, received undefined|Required|Message is required/i);
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
});
