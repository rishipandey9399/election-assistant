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
  async getVoterInfo(address: string): Promise<VoterInfoResponse> {
    if (!address || address.trim() === '') {
      throw new Error('Address is required for Voter Info');
    }
    const url = `${this.baseUrl}/voterinfo?key=${this.apiKey}&address=${encodeURIComponent(address)}&production=true`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Civic Info API error: ${response.statusText}`);
      }
      return (await response.json()) as VoterInfoResponse;
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
  async getElections(): Promise<ElectionsResponse> {
    const url = `${this.baseUrl}/elections?key=${this.apiKey}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Civic Info API error: ${response.statusText}`);
      }
      return (await response.json()) as ElectionsResponse;
    } catch (error) {
      logger.error({ err: error }, 'ElectionService.getElections Error');
      throw error;
    }
  }
}

export const createElectionService = (apiKey?: string) => new ElectionService(apiKey);
