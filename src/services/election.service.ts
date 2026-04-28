import { env } from '@/lib/env';
import logger from '@/lib/logger';

/**
 * ElectionService handles interactions with the Google Civic Information API.
 */
export class ElectionService {
  private apiKey: string;
  private baseUrl = 'https://www.googleapis.com/civicinfo/v2';

  constructor(apiKey: string = env.GOOGLE_CIVIC_API_KEY) {
    this.apiKey = apiKey;
  }

  /**
   * Fetches voter information including polling places and upcoming contests.
   *
   * @param address The registered address of the voter.
   * @returns A promise that resolves to the civic information data.
   */
  async getVoterInfo(address: string): Promise<unknown> {
    const url = `${this.baseUrl}/voterinfo?key=${this.apiKey}&address=${encodeURIComponent(address)}&production=true`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Civic Info API error: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      logger.error({ err: error, address }, 'ElectionService.getVoterInfo Error');
      throw error;
    }
  }

  /**
   * Fetches a list of upcoming elections.
   *
   * @returns A promise that resolves to the elections list.
   */
  async getElections(): Promise<unknown> {
    const url = `${this.baseUrl}/elections?key=${this.apiKey}`;
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      logger.error({ err: error }, 'ElectionService.getElections Error');
      throw error;
    }
  }
}

export const createElectionService = (apiKey?: string) => new ElectionService(apiKey);
