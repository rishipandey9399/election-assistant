import { NextResponse } from 'next/server';
import { AppError, ErrorCode } from './errors';
import { ZodError } from 'zod';
import logger from './logger';

/** Shape of field-level validation errors returned by Zod. */
type FieldErrors = Record<string, string[]>;

/**
 * Standard envelope for every API response in the application.
 *
 * @template T - The shape of a successful response's `data` field.
 */
export interface ApiResponse<T = unknown> {
  /** Whether the request was handled successfully. */
  success: boolean;
  /** Present on successful responses. */
  data?: T;
  /** Present on error responses. */
  error?: {
    /** Human-readable description of the error. */
    message: string;
    /** Machine-readable error code (maps to {@link ErrorCode}). */
    code: string;
    /** Optional structured details, e.g. Zod field validation errors. */
    details?: FieldErrors | unknown;
  };
}

/**
 * Wraps a successful payload in the standard API envelope and returns a
 * `NextResponse` with the given HTTP status (default 200).
 *
 * @param data   - The data payload to embed in `{ success: true, data }`.
 * @param status - HTTP status code (default: 200).
 */
export function successResponse<T>(data: T, status: number = 200): NextResponse {
  const body: ApiResponse<T> = {
    success: true,
    data,
  };
  return NextResponse.json(body, { status });
}

/**
 * Centralized error handler for API route `catch` blocks.
 *
 * Recognises three error classes:
 * - {@link AppError}  → uses its `statusCode`, `code`, and `details`.
 * - {@link ZodError}  → returns 400 with flattened field errors.
 * - `unknown`         → returns 500 with a safe generic message.
 *
 * All errors are logged via the structured logger before being serialised.
 *
 * @param error - The caught value (typed `unknown` per best practice).
 */
export function errorResponse(error: unknown): NextResponse {
  logger.error({ err: error }, 'API Route Error');

  if (error instanceof AppError) {
    const body: ApiResponse = {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        details: error.details,
      },
    };
    return NextResponse.json(body, { status: error.statusCode });
  }

  if (error instanceof ZodError) {
    const body: ApiResponse = {
      success: false,
      error: {
        message: 'Validation failed',
        code: ErrorCode.VALIDATION_ERROR,
        details: error.flatten().fieldErrors as FieldErrors,
      },
    };
    return NextResponse.json(body, { status: 400 });
  }

  // Fallback: never leak internal details to the client
  const body: ApiResponse = {
    success: false,
    error: {
      message: 'An unexpected error occurred',
      code: ErrorCode.INTERNAL_SERVER_ERROR,
    },
  };
  return NextResponse.json(body, { status: 500 });
}
