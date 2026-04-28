import { NextResponse } from 'next/server';
import { AppError, ErrorCode } from './errors';
import { ZodError } from 'zod';
import logger from './logger';

/**
 * Standard API Response Interface
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: Record<string, unknown> | Record<string, string[]> | unknown;
  };
}

/**
 * Standardized success response helper
 */
export function successResponse<T>(data: T, status: number = 200) {
  const body: ApiResponse<T> = {
    success: true,
    data,
  };
  return NextResponse.json(body, { status });
}

/**
 * Global error handler for API routes
 */
export function errorResponse(error: unknown) {
  logger.error({ err: error }, 'API Route Error');

  let body: ApiResponse;

  if (error instanceof AppError) {
    body = {
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
    body = {
      success: false,
      error: {
        message: 'Validation failed',
        code: ErrorCode.VALIDATION_ERROR,
        details: error.flatten().fieldErrors,
      },
    };
    return NextResponse.json(body, { status: 400 });
  }

  // Fallback for unknown errors
  body = {
    success: false,
    error: {
      message: 'An unexpected error occurred',
      code: ErrorCode.INTERNAL_SERVER_ERROR,
    },
  };
  return NextResponse.json(body, { status: 500 });
}
