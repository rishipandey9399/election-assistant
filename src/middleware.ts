import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Strict Content Security Policy.
 * Only allows resources from trusted, known origins.
 */
const isDev = process.env.NODE_ENV === 'development';
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://maps.googleapis.com https://maps.gstatic.com ${isDev ? "'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://*.googleapis.com https://*.gstatic.com",
  "frame-ancestors 'none'",
  'report-uri /api/csp-report',
].join('; ');

/**
 * Security headers applied to every response.
 */
const SECURITY_HEADERS: Record<string, string> = {
  'Content-Security-Policy': CSP,
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self)',
};

/**
 * Middleware for global security checks and header injection.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. CSRF Protection for API Routes
  if (pathname.startsWith('/api') && request.method === 'POST') {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');

    // In production, ensure origin matches host
    if (process.env.NODE_ENV === 'production' && origin) {
      const originHost = new URL(origin).host;
      if (originHost !== host) {
        return new NextResponse(
          JSON.stringify({
            success: false,
            error: { message: 'CSRF Protection: Invalid Origin', code: 'FORBIDDEN' },
          }),
          { status: 403, headers: { 'content-type': 'application/json' } }
        );
      }
    }
  }

  // 2. Bot Detection
  const userAgent = request.headers.get('user-agent') || '';
  const suspiciousBots = ['curl', 'wget', 'python-requests', 'libwww-perl', 'postman'];
  if (suspiciousBots.some((bot) => userAgent.toLowerCase().includes(bot))) {
    // Only block if not in development
    if (process.env.NODE_ENV === 'production') {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: { message: 'Automated access restricted', code: 'BOT_BLOCKED' },
        }),
        { status: 403, headers: { 'content-type': 'application/json' } }
      );
    }
  }

  // 3. Prevent suspicious query parameters
  const url = request.nextUrl;
  if (url.searchParams.has('script') || url.searchParams.has('exec')) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: { message: 'Potential malicious request blocked', code: 'BAD_REQUEST' },
      }),
      { status: 400, headers: { 'content-type': 'application/json' } }
    );
  }

  // 3. Attach security headers to every response
  const response = NextResponse.next();
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: ['/api/:path*', '/((?!_next/static|_next/image|favicon.ico).*)'],
};
