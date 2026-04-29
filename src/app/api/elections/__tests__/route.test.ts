/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * @jest-environment node
 */

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

import { GET } from '../route';

jest.mock('@/services/election.service', () => ({
  createElectionService: jest.fn().mockReturnValue({
    getElections: jest.fn().mockResolvedValue({
      elections: [{ id: 'mock-id', name: 'Mock Election' }],
    }),
  }),
}));

jest.mock('@/lib/cache', () => ({
  withCache: jest.fn((_key: string, _ttl: number, fetcher: () => Promise<unknown>) => fetcher()),
}));

jest.mock('@/lib/logger', () => ({
  __esModule: true,
  default: { info: jest.fn(), error: jest.fn(), warn: jest.fn(), debug: jest.fn() },
}));

describe('Elections API Route', () => {
  beforeAll(() => {
    process.env.GOOGLE_CIVIC_API_KEY = 'real-key';
  });

  afterAll(() => {
    delete process.env.GOOGLE_CIVIC_API_KEY;
  });

  it('returns mock elections data successfully', async () => {
    const req = new Request('http://localhost/api/elections');
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.elections).toBeDefined();
    expect(data.elections[0].name).toBe('Mock Election');
  });

  it('returns 500 on unexpected service errors', async () => {
    jest.isolateModules(async () => {
      const { GET } = require('../route');
      const { createElectionService } = require('@/services/election.service');
      const mockService = createElectionService();
      mockService.getElections.mockRejectedValueOnce(new Error('Unexpected crash'));

      const req = new Request('http://localhost/api/elections');
      const response = await GET(req);

      expect(response.status).toBe(500);
    });
  });
});
