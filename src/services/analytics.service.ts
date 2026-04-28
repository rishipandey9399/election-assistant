import { BigQuery } from '@google-cloud/bigquery';

/**
 * AnalyticsService manages data streaming to Google BigQuery.
 */
export class AnalyticsService {
  private bigquery: BigQuery;
  private datasetId = 'election_analytics';
  private tableId = 'assistant_interactions';

  constructor() {
    this.bigquery = new BigQuery();
  }

  /**
   * Logs an assistant interaction for historical civic engagement analysis.
   *
   * @param userId Unique identifier for the user.
   * @param question Question asked.
   * @param response Response provided.
   */
  async logInteraction(userId: string | null, question: string, response: string): Promise<void> {
    // Development/Mock check
    if (process.env.NODE_ENV === 'development' || !process.env.GOOGLE_CLOUD_PROJECT) {
      console.log('[AnalyticsService Mock] Logging:', { userId, question });
      return;
    }

    try {
      const rows = [
        {
          timestamp: BigQuery.timestamp(new Date()),
          user_id: userId || 'anonymous',
          question: question,
          response_length: response.length,
        },
      ];

      await this.bigquery.dataset(this.datasetId).table(this.tableId).insert(rows);
    } catch (error) {
      // Fail silently to avoid interrupting the main user flow
      console.error('AnalyticsService.logInteraction Error:', error);
    }
  }
}

export const analyticsService = new AnalyticsService();
