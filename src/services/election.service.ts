import { env } from '@/lib/env';
import logger from '@/lib/logger';

export interface Election {
  id: string;
  name: string;
  electionDay: string;
  ocdDivisionId: string;
}

export interface VoterInfoResponse {
  election?: Election;
  pollingLocations?: Array<{
    address: {
      locationName?: string;
      line1: string;
      city: string;
      state: string;
      zip: string;
    };
    pollingHours?: string;
    startDate?: string;
    endDate?: string;
  }>;
  contests?: Array<{
    type: string;
    office?: string;
    level?: string[];
    candidates?: Array<{
      name: string;
      party?: string;
    }>;
  }>;
  state?: Array<{
    name: string;
    electionAdministrationBody?: {
      name: string;
      electionInfoUrl?: string;
      electionRegistrationUrl?: string;
      votingLocationFinderUrl?: string;
    };
  }>;
}

export interface ElectionsResponse {
  kind: string;
  elections: Election[];
}

export class CivicApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'CivicApiError';
  }
}

/**
 * ElectionService handles interactions with the Google Civic Information API.
 * Includes in-flight request deduplication to optimize concurrent API calls.
 */
export class ElectionService {
  private apiKey: string;
  private baseUrl = 'https://www.googleapis.com/civicinfo/v2';
  private pendingRequests = new Map<string, Promise<unknown>>();

  constructor(apiKey: string = env.GOOGLE_CIVIC_API_KEY) {
    this.apiKey = apiKey;
  }

  /**
   * Internal fetch wrapper with timeout and retry logic.
   */
  private async fetchWithRetry(url: string, retries = 3, timeout = 10000): Promise<Response> {
    const lastError: Error | null = null;

    for (let i = 0; i < retries; i++) {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(id);

        if (response.status >= 500) {
          throw new CivicApiError(response.status, `Server error: ${response.statusText}`);
        }

        return response;
      } catch (err: unknown) {
        clearTimeout(id);
        const error = err as Error;

        if (error.name === 'AbortError') {
          logger.warn({ url, attempt: i + 1 }, 'ElectionService request timed out');
        } else {
          logger.warn({ url, attempt: i + 1, err }, 'ElectionService request failed');
        }

        // Exponential backoff: 500ms, 1000ms, 2000ms
        if (i < retries - 1) {
          await new Promise((resolve) => setTimeout(resolve, Math.pow(2, i) * 500));
        }
      }
    }

    throw lastError || new Error('Request failed after retries');
  }

  /**
   * Helper method to deduplicate concurrent identical API requests.
   * If a request for the given URL is already in flight, returns the existing Promise.
   */
  private async dedupeRequest<T>(url: string): Promise<T> {
    if (this.pendingRequests.has(url)) {
      return this.pendingRequests.get(url) as Promise<T>;
    }

    const requestPromise = this.fetchWithRetry(url)
      .then(async (response) => {
        if (!response.ok) {
          throw new CivicApiError(response.status, `Civic Info API error: ${response.statusText}`);
        }
        return response.json();
      })
      .finally(() => {
        this.pendingRequests.delete(url);
      });

    this.pendingRequests.set(url, requestPromise);
    return requestPromise;
  }

  /**
   * Fetches voter information including polling places and upcoming contests.
   * Leverages request deduplication for optimal performance.
   *
   * @param address The registered address of the voter.
   * @returns A promise that resolves to the civic information data.
   * @throws {CivicApiError} When the upstream API returns a non-200 response.
   */
  async getVoterInfo(address: string): Promise<VoterInfoResponse> {
    if (!address || address.trim() === '') {
      throw new Error('Address is required for Voter Info');
    }
    const url = `${this.baseUrl}/voterinfo?key=${this.apiKey}&address=${encodeURIComponent(address)}&production=true`;

    try {
      return await this.dedupeRequest<VoterInfoResponse>(url);
    } catch (error) {
      logger.error({ err: error, address }, 'ElectionService.getVoterInfo Error');
      throw error;
    }
  }

  /**
   * Fetches a list of upcoming elections nationally and locally.
   * Leverages request deduplication for optimal performance.
   *
   * @returns A promise that resolves to the elections list.
   * @throws {CivicApiError} When the upstream API returns a non-200 response.
   */
  async getElections(): Promise<ElectionsResponse> {
    const url = `${this.baseUrl}/elections?key=${this.apiKey}`;
    try {
      return await this.dedupeRequest<ElectionsResponse>(url);
    } catch (error) {
      logger.error({ err: error }, 'ElectionService.getElections Error');
      throw error;
    }
  }
}

export const createElectionService = (apiKey?: string) => new ElectionService(apiKey);
