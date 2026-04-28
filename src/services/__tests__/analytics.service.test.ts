/* eslint-disable @typescript-eslint/no-require-imports */
import { AnalyticsService } from '../analytics.service';

jest.mock('@google-cloud/bigquery', () => {
  return {
    BigQuery: jest.fn().mockImplementation(() => ({
      dataset: jest.fn().mockReturnValue({
        table: jest.fn().mockReturnValue({
          insert: jest.fn().mockResolvedValue([{}]),
        }),
      }),
    })),
    timestamp: jest.fn().mockReturnValue('mock-timestamp'),
  };
});

describe('AnalyticsService', () => {
  it('should log to console in dev mode', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const service = new AnalyticsService();
    await service.logInteraction('user1', 'hi', 'hello');
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should call bigquery in production-like env', async () => {
    const originalEnv = process.env.GOOGLE_CLOUD_PROJECT;
    process.env.GOOGLE_CLOUD_PROJECT = 'test-project';

    const service = new AnalyticsService();
    await service.logInteraction('user1', 'hi', 'hello');

    const { BigQuery } = require('@google-cloud/bigquery');
    expect(BigQuery).toHaveBeenCalled();

    process.env.GOOGLE_CLOUD_PROJECT = originalEnv;
  });
});
