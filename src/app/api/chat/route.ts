import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit } from '@/lib/rateLimit';
import { withCache } from '@/lib/cache';

// Input validation schema
const chatSchema = z.object({
  message: z
    .string()
    .min(1, 'Message is required')
    .max(500, 'Message is too long (max 500 characters)'),
});

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'mock-key');

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
    const parseResult = chatSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json({ error: parseResult.error.issues[0].message }, { status: 400 });
    }

    const { message } = parseResult.data;
    const cacheKey = `chat_${message.trim().toLowerCase()}`;

    // 3. Cached Response Logic
    const reply = await withCache(cacheKey, 3600000, async () => {
      // For demonstration, if no API key is provided, we return a mock response
      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'mock-key') {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        return "I'm your AI Election Assistant! I'm currently running in mock mode because the Gemini API key hasn't been configured yet.";
      }

      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      const promptContext = `You are a helpful, non-partisan AI Election Assistant. Your goal is to help users understand the voting process, registration deadlines, and how to vote. Provide concise, accurate information. If you don't know something, advise them to check their local election office website. \n\nUser Question: ${message}`;

      const result = await model.generateContent(promptContext);
      const response = await result.response;
      return response.text();
    });

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
