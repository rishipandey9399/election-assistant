import { NextResponse } from 'next/server';
import { z } from 'zod';

import { errorResponse } from '@/lib/api-utils';
import { withCache } from '@/lib/cache';
import { AppError, ErrorCode } from '@/lib/errors';
import { rateLimit } from '@/lib/rateLimit';
import { createElectionService } from '@/services/election.service';

// Input validation schema
const addressSchema = z.object({
  address: z.string().min(5, 'Address is too short'),
});

const electionService = createElectionService();

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting Check
    const isAllowed = await rateLimit(req);
    if (!isAllowed) {
      throw new AppError('Too many requests', ErrorCode.RATE_LIMIT_EXCEEDED, 429);
    }

    // 2. Input Validation
    const body = await req.json();
    const { address } = addressSchema.parse(body);

    const cacheKey = `civic_${address.trim().toLowerCase()}`;

    // 3. Service Call with Cache (24 hour)
    const data = await withCache(cacheKey, 86400000, async () => {
      // Mock mode check
      if (!process.env.GOOGLE_CIVIC_API_KEY || process.env.GOOGLE_CIVIC_API_KEY === 'mock-key') {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return {
          pollingLocations: [
            {
              locationName: 'Community Center Gymnasium',
              address: { line1: '123 Main Street', city: 'Anytown', state: 'CA', zip: '90210' },
              pollingHours: '7:00 AM - 8:00 PM',
            },
          ],
          state: [
            { name: 'California', electionAdministrationBody: { name: 'Secretary of State' } },
          ],
        };
      }
      return await electionService.getVoterInfo(address);
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return errorResponse(error);
  }
}
