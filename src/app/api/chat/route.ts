import { NextResponse } from 'next/server';
import { z } from 'zod';

import { errorResponse } from '@/lib/api-utils';
import { withCache } from '@/lib/cache';
import { CACHE_TTL } from '@/lib/constants';
import { AppError, ErrorCode } from '@/lib/errors';
import { rateLimit } from '@/lib/rateLimit';
import { createAIService } from '@/services/ai.service';
import { analyticsService } from '@/services/analytics.service';

// Input validation schema
const chatSchema = z.object({
  message: z.string().min(1, 'Message is required'),
});

const aiService = createAIService();

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting
    const isAllowed = await rateLimit(req);
    if (!isAllowed) {
      throw new AppError('Too many requests', ErrorCode.RATE_LIMIT_EXCEEDED, 429);
    }

    // 2. Validation
    const body = await req.json();
    const { message } = chatSchema.parse(body);

    const cacheKey = `chat_${message.trim().toLowerCase()}`;

    // 3. Service Call with Cache
    const reply = await withCache(cacheKey, CACHE_TTL.CHAT_RESPONSE_MS, async () => {
      // Mock mode check
      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'mock-key') {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return "I'm running in mock mode. Please configure the Gemini API key.";
      }
      return await aiService.askAssistant(message);
    });

    // 4. Analytics Logging
    analyticsService.logInteraction(null, message, reply as string).catch(console.error);

    return NextResponse.json({ reply });
  } catch (error) {
    return errorResponse(error);
  }
}
