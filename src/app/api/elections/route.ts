import { NextResponse } from 'next/server';

import { errorResponse } from '@/lib/api-utils';
import { withCache } from '@/lib/cache';
import { AppError, ErrorCode } from '@/lib/errors';
import { rateLimit } from '@/lib/rateLimit';
import { createElectionService } from '@/services/election.service';

const electionService = createElectionService();

export async function GET(req: Request) {
  try {
    // 1. Rate Limiting Check
    const isAllowed = await rateLimit(req);
    if (!isAllowed) {
      throw new AppError('Too many requests', ErrorCode.RATE_LIMIT_EXCEEDED, 429);
    }

    const cacheKey = `civic_elections`;

    // 3. Service Call with Cache (24 hour)
    const data = await withCache(cacheKey, 86400000, async () => {
      // Mock mode check
      if (
        !process.env.GOOGLE_CIVIC_API_KEY ||
        process.env.GOOGLE_CIVIC_API_KEY.startsWith('mock')
      ) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return {
          elections: [
            {
              id: 'mock-1',
              name: 'Voter Registration Deadline',
              electionDay: '2024-10-07',
              ocdDivisionId: 'ocd-division/country:us/state:ca',
            },
            {
              id: 'mock-2',
              name: 'Early Voting Begins',
              electionDay: '2024-10-28',
              ocdDivisionId: 'ocd-division/country:us/state:ca',
            },
            {
              id: 'mock-3',
              name: 'General Election',
              electionDay: '2024-11-05',
              ocdDivisionId: 'ocd-division/country:us/state:ca',
            },
          ],
        };
      }
      return await electionService.getElections();
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return errorResponse(error);
  }
}
