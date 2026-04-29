/**
 * @jest-environment node
 */
import { POST } from '../route';

jest.mock('@/lib/logger', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

describe('Notifications Remind API', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv, CRON_SECRET: 'test-secret' };
    global.fetch = jest.fn().mockResolvedValue({ ok: true });
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('returns 401 if unauthorized', async () => {
    const req = new Request('http://localhost/api/notifications/remind', {
      method: 'POST',
      headers: { authorization: 'Bearer wrong' },
    });
    const response = await POST(req);
    expect(response.status).toBe(401);
  });

  it('validates input and sends email/sms if providers configured', async () => {
    process.env.SENDGRID_API_KEY = 'sg-key';
    process.env.TWILIO_ACCOUNT_SID = 'tw-sid';
    process.env.TWILIO_AUTH_TOKEN = 'tw-token';
    process.env.TWILIO_PHONE_NUMBER = '+123456';

    const body = {
      eventId: '123',
      userEmail: 'test@example.com',
      userPhone: '+1999999',
      message: 'Vote tomorrow!',
    };

    const req = new Request('http://localhost/api/notifications/remind', {
      method: 'POST',
      headers: { authorization: 'Bearer test-secret' },
      body: JSON.stringify(body),
    });

    const response = await POST(req);
    expect(response.status).toBe(200);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('returns 400 for invalid input', async () => {
    const req = new Request('http://localhost/api/notifications/remind', {
      method: 'POST',
      headers: { authorization: 'Bearer test-secret' },
      body: JSON.stringify({ eventId: '123' }), // Missing email/phone
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
  });
});
