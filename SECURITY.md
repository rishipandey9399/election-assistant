# Security Policy

## Content Security Policy (CSP) Exceptions

The application uses a strict Content Security Policy to prevent XSS and data injection attacks. However, due to architectural requirements of the Next.js App Router and the Google Maps API, there are two intentional exceptions in the development and production configurations:

### 1. `unsafe-inline` for Scripts

**Where:** `script-src` and `style-src`
**Why:**

- **Next.js Hydration:** Next.js (versions 13+) relies heavily on injecting inline scripts into the HTML payload to hydrate client components. Without `'unsafe-inline'`, all React events (like form submissions, button clicks) fail to attach, breaking core interactivity.
- **Google Maps API:** The `@googlemaps/js-api-loader` dynamically injects inline styles and scripts into the DOM to render the map tiles. Google's documentation explicitly requires `'unsafe-inline'` for this to function.

### 2. `unsafe-eval` for Scripts (Development Only)

**Where:** `script-src` (ONLY when `NODE_ENV === 'development'`)
**Why:**

- **React Fast Refresh:** Next.js uses `eval()` under the hood during local development to support Hot Module Replacement (HMR). This directive is automatically stripped out in production environments.

### Subresource Integrity (SRI)

We are aiming to enforce Subresource Integrity (SRI) across all statically injected third-party scripts. Next.js experimental features currently handle this internally (`experimental.sri`).

## Reporting Vulnerabilities

If you discover any security-related issues, please reach out to the development team immediately before opening any public issues.
