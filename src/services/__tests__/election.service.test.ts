/**
 * @jest-environment node
 */

// Mock logger before any service imports
jest.mock('@/lib/logger', () => ({
  __esModule: true,
  default: { info: jest.fn(), error: jest.fn(), warn: jest.fn(), debug: jest.fn() },
}));

import { ElectionService, createElectionService } from '../election.service';

/** Helper that returns a mocked global fetch */
function mockFetch(body: unknown, ok = true, status = 200) {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    status,
    statusText: ok ? 'OK' : 'Not Found',
    json: jest.fn().mockResolvedValue(body),
  }) as unknown as typeof fetch;
}

describe('ElectionService', () => {
  afterEach(() => jest.restoreAllMocks());

  describe('constructor / factory', () => {
    it('createElectionService returns an ElectionService instance', () => {
      expect(createElectionService()).toBeInstanceOf(ElectionService);
    });

    it('accepts a custom apiKey', () => {
      const svc = new ElectionService('custom-key');
      expect(svc).toBeInstanceOf(ElectionService);
    });
  });

  describe('getVoterInfo', () => {
    it('returns parsed JSON on success', async () => {
      const payload = { pollingLocations: [{ locationName: 'Gym' }] };
      mockFetch(payload);

      const svc = new ElectionService('test-key');
      const result = await svc.getVoterInfo('123 Main St');

      expect(result).toEqual(payload);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('voterinfo'),
        expect.any(Object)
      );
    });

    it('throws an error when the API returns a non-ok response', async () => {
      mockFetch({}, false, 404);

      const svc = new ElectionService('test-key');
      await expect(svc.getVoterInfo('Bad Address')).rejects.toThrow('Civic Info API error');
    });

    it('retries on server errors (5xx)', async () => {
      const payload = { pollingLocations: [{ locationName: 'Gym' }] };
      global.fetch = jest
        .fn()
        .mockResolvedValueOnce({ ok: false, status: 500, statusText: 'Internal Error' })
        .mockResolvedValueOnce({ ok: true, status: 200, json: async () => payload });

      const svc = new ElectionService('test-key');
      // Use a shorter timeout for tests if possible or just wait
      const result = await svc.getVoterInfo('123 Main St');

      expect(result).toEqual(payload);
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('getElections', () => {
    it('returns a list of elections on success', async () => {
      const payload = { elections: [{ id: '1', name: 'General Election' }] };
      mockFetch(payload);

      const svc = new ElectionService('test-key');
      const result = await svc.getElections();

      expect(result).toEqual(payload);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('elections'),
        expect.any(Object)
      );
    });
  });
});
