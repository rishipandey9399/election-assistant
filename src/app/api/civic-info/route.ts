import { NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit } from '@/lib/rateLimit';
import { withCache } from '@/lib/cache';

// Input validation schema
const addressSchema = z.object({
  address: z.string().min(5, 'A valid address is required').max(200, 'Address is too long'),
});

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting Check
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    if (!rateLimit(ip, 10, 60000)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // 2. Input Validation
    const body = await req.json();
    const parseResult = addressSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json({ error: parseResult.error.issues[0].message }, { status: 400 });
    }

    const { address } = parseResult.data;
    const cacheKey = `civic_${address.trim().toLowerCase()}`;

    // 3. Cached Data Logic
    const data = await withCache(cacheKey, 86400000, async () => {
      // 24 hour cache
      console.log(`Mocking civic info for address: ${address}`);

      // Mock response representing Google Civic Information API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        pollingLocations: [
          {
            locationName: 'Community Center Gymnasium',
            address: {
              line1: '123 Main Street',
              city: 'Anytown',
              state: 'CA',
              zip: '90210',
            },
            pollingHours: '7:00 AM - 8:00 PM',
            notes: 'Please enter through the side doors.',
          },
        ],
        state: [
          {
            name: 'California',
            electionAdministrationBody: {
              name: 'California Secretary of State',
              electionInfoUrl: 'https://www.sos.ca.gov/elections',
              electionRegistrationUrl: 'https://registertovote.ca.gov/',
              electionRegistrationConfirmationUrl: 'https://voterstatus.sos.ca.gov/',
              absenteeVotingInfoUrl:
                'https://www.sos.ca.gov/elections/voter-registration/vote-mail',
              votingLocationFinderUrl: 'https://www.sos.ca.gov/elections/polling-place',
            },
          },
        ],
      };
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Civic Info API Error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
