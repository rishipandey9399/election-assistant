import { NextResponse } from 'next/server';

import logger from '@/lib/logger';

/**
 * Handles CSP violation reports sent by the browser.
 * In a production environment, these should be logged to an observability tool.
 */
export async function POST(req: Request) {
  try {
    const report = await req.json();

    // Log the violation for monitoring
    logger.warn({ cspReport: report['csp-report'] }, 'CSP Violation Detected');

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    logger.error({ err: error }, 'Failed to process CSP report');
    return new NextResponse(null, { status: 400 });
  }
}
