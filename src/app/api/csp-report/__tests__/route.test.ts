/**
 * @jest-environment node
 */
jest.mock('@/lib/logger', () => ({
  __esModule: true,
  default: {
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

import logger from '@/lib/logger';

import { POST } from '../route';

describe('CSP Report API', () => {
  it('logs the CSP violation and returns 204', async () => {
    const report = { 'csp-report': { 'blocked-uri': 'http://evil.com' } };
    const req = new Request('http://localhost/api/csp-report', {
      method: 'POST',
      body: JSON.stringify(report),
    });

    const response = await POST(req);
    expect(response.status).toBe(204);

    expect(logger.warn).toHaveBeenCalledWith(
      expect.objectContaining({ cspReport: report['csp-report'] }),
      expect.any(String)
    );
  });

  it('returns 400 on invalid JSON', async () => {
    const req = new Request('http://localhost/api/csp-report', {
      method: 'POST',
      body: 'invalid-json',
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
  });
});
