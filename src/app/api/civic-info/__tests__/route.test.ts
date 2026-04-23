/**
 * @jest-environment node
 */
import { POST } from '../route';

describe('Civic Info API Route', () => {
  it('returns a 400 error if address is missing', async () => {
    const req = new Request('http://localhost/api/civic-info', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toMatch(
      /expected string, received undefined|Required|A valid address is required/i
    );
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

    expect(response.status).toBe(200);
    expect(data.pollingLocations).toBeDefined();
    expect(data.pollingLocations[0].locationName).toBe('Community Center Gymnasium');
    expect(data.state[0].name).toBe('California');
  });
});
