import { rateLimit } from '../rateLimit';
import { redis } from '../redis';

// Mock Redis module
jest.mock('../redis', () => ({
  redis: {
    incr: jest.fn(),
    pexpire: jest.fn(),
  },
}));

describe('rateLimit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('In-Memory Fallback', () => {
    it('falls back to in-memory if Redis fails', async () => {
      (redis?.incr as jest.Mock).mockRejectedValue(new Error('Redis Down'));
      const req = new Request('http://localhost', { headers: { 'x-forwarded-for': '1.1.1.1' } });

      const result = await rateLimit(req, 1, 60000);
      expect(result).toBe(true); // Should succeed via fallback
    });

    it('blocks in-memory if limit exceeded after fallback', async () => {
      (redis?.incr as jest.Mock).mockRejectedValue(new Error('Redis Down'));
      const req = new Request('http://localhost', { headers: { 'x-forwarded-for': '2.2.2.2' } });

      await rateLimit(req, 1, 60000);
      const result = await rateLimit(req, 1, 60000);
      expect(result).toBe(false);
    });
  });

  describe('Redis Path', () => {
    it('uses Redis INCR and PEXPIRE', async () => {
      (redis?.incr as jest.Mock).mockResolvedValue(1);
      const req = new Request('http://localhost', { headers: { 'x-forwarded-for': '3.3.3.3' } });

      const result = await rateLimit(req, 5, 10000);

      expect(result).toBe(true);
      expect(redis?.incr).toHaveBeenCalledWith('ratelimit:3.3.3.3');
      expect(redis?.pexpire).toHaveBeenCalledWith('ratelimit:3.3.3.3', 10000);
    });

    it('blocks if Redis INCR exceeds limit', async () => {
      (redis?.incr as jest.Mock).mockResolvedValue(6);
      const req = new Request('http://localhost', { headers: { 'x-forwarded-for': '4.4.4.4' } });

      const result = await rateLimit(req, 5, 10000);

      expect(result).toBe(false);
    });
  });
});
