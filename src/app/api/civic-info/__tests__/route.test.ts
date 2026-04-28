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

// Mock ElectionService
jest.mock('@/services/election.service', () => ({
  createElectionService: jest.fn().mockReturnValue({
    getVoterInfo: jest.fn().mockResolvedValue({
      pollingLocations: [{ locationName: 'Community Center Gymnasium' }],
      state: [{ name: 'California', electionAdministrationBody: { name: 'Secretary of State' } }],
    }),
  }),
}));

jest.mock('@/lib/rateLimit', () => ({
  rateLimit: jest.fn().mockReturnValue(true),
}));

// Mock the cache utility
jest.mock('@/lib/cache', () => ({
  withCache: jest.fn((key: string, ttl: number, fetcher: () => Promise<unknown>) => fetcher()),
}));

// Mock logger
jest.mock('@/lib/logger', () => ({
  __esModule: true,
  default: { info: jest.fn(), error: jest.fn(), warn: jest.fn(), debug: jest.fn() },
}));

// Mock redis
jest.mock('@/lib/redis', () => ({ redis: null, quitRedis: jest.fn() }));

describe('Civic Info API Route', () => {
  it('returns a 400 error if address is missing', async () => {
    const req = new Request('http://localhost/api/civic-info', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error.message).toMatch(/Validation failed/i);
  });

  it('returns mock polling location data when given an address', async () => {
    // Fast-forward timers if needed, or just let the 1s delay run.
    // Since we are not using fake timers here, we'll just wait for the promise to resolve.
    const req = new Request('http://localhost/api/civic-info', {
      method: 'POST',
      body: JSON.stringify({ address: '123 Test St' }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(data.pollingLocations).toBeDefined();
    expect(data.pollingLocations[0].locationName).toBe('Community Center Gymnasium');
    expect(data.state[0].name).toBe('California');
  });

  it('returns 429 when rate limit is exceeded', async () => {
    jest.isolateModules(async () => {
      const { POST } = require('../route');
      const { rateLimit } = require('@/lib/rateLimit');
      rateLimit.mockReturnValueOnce(false);

      const req = new Request('http://localhost/api/civic-info', {
        method: 'POST',
        body: JSON.stringify({ address: '123 Test St' }),
      });

      const response = await POST(req);
      expect(response.status).toBe(429);
    });
  });

  it('returns 500 on unexpected errors', async () => {
    jest.isolateModules(async () => {
      const { POST } = require('../route');
      const { createElectionService } = require('@/services/election.service');
      const mockService = createElectionService();
      mockService.getVoterInfo.mockRejectedValueOnce(new Error('Unexpected crash'));

      const req = new Request('http://localhost/api/civic-info', {
        method: 'POST',
        body: JSON.stringify({ address: '123 Test St' }),
      });

      const response = await POST(req);
      expect(response.status).toBe(500);
    });
  });
});
