import { z } from 'zod';

const envSchema = z.object({
  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is missing'),
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1, 'FIREBASE_API_KEY is missing'),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1, 'FIREBASE_AUTH_DOMAIN is missing'),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1, 'FIREBASE_PROJECT_ID is missing'),
});

/**
 * Validates that all required environment variables are present.
 * This should be called early in the application lifecycle.
 */
export function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.flatten().fieldErrors);
    // In a real production environment, we might want to throw an error here
    // throw new Error('Invalid environment variables');
  } else {
    console.log('✅ Environment variables validated');
  }
}

export const env = envSchema.partial().parse(process.env);
