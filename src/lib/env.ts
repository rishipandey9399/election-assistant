import { z } from 'zod';

const envSchema = z.object({
  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is missing'),
  GOOGLE_CIVIC_API_KEY: z.string().optional(), // Can be mock
  CRON_SECRET: z.string().min(10, 'CRON_SECRET is missing or too short'),
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1, 'FIREBASE_API_KEY is missing'),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1, 'FIREBASE_AUTH_DOMAIN is missing'),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1, 'FIREBASE_PROJECT_ID is missing'),
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().min(1, 'MAPS_API_KEY is missing'),
  REDIS_URL: z.string().url().optional(),
});

/**
 * Validated environment variables.
 * Using a getter to ensure we don't crash at build-time if variables are missing,
 * but fail-fast at runtime.
 */
export const env = {
  get GEMINI_API_KEY() {
    return process.env.GEMINI_API_KEY || '';
  },
  get GOOGLE_CIVIC_API_KEY() {
    return process.env.GOOGLE_CIVIC_API_KEY || '';
  },
  get CRON_SECRET() {
    return process.env.CRON_SECRET || '';
  },
  get NEXT_PUBLIC_FIREBASE_API_KEY() {
    return process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '';
  },
  get NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN() {
    return process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '';
  },
  get NEXT_PUBLIC_FIREBASE_PROJECT_ID() {
    return process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '';
  },
  get NEXT_PUBLIC_GOOGLE_MAPS_API_KEY() {
    return process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  },
  get REDIS_URL() {
    return process.env.REDIS_URL || '';
  },
};

/**
 * Validates that all required environment variables are present.
 * Should be called in layout.tsx or instrumentation.ts
 */
export function validateEnv() {
  if (process.env.NODE_ENV === 'test') return;
  // Skip environment validation during the Next.js build step
  if (process.env.npm_lifecycle_event === 'build') return;

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const issues = result.error.flatten().fieldErrors;
    console.error('❌ Invalid environment variables:', issues);

    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Critical environment variables missing: ${Object.keys(issues).join(', ')}`);
    }
  } else {
    console.log('✅ Environment variables validated');
  }
}
