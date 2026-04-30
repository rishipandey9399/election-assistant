# 🗳️ Election Assistant

A production-grade, AI-powered election assistant designed to help voters navigate upcoming elections, find polling places, and get answers to election-related questions with high reliability and accessibility.

## ✨ Features

- **AI Voter Assistant**: Interactive chat interface powered by Google Gemini to answer complex election queries.
- **Polling Place Locator**: Find your designated polling location and ballot information using the Google Civic Information API.
- **Election Timeline**: Visual roadmap of important dates (registration, early voting, general election).
- **Hardened Security**: Comprehensive Content Security Policy (CSP), CSRF protection, and Subresource Integrity (SRI).
- **Resilient Infrastructure**: Circuit breaker patterns, dual-layer caching (Redis + In-memory), and exponential backoff retries for API reliability.
- **Accessibility First**: 100% ARIA-compliant UI with integrated axe-core testing across Chrome, Firefox, and Safari.

## 🛠 Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **AI**: [Google Gemini API](https://ai.google.dev/)
- **Data**: [Google Civic Information API](https://developers.google.com/civic-information)
- **Styling**: [Vanilla CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- **State/Cache**: [Redis](https://redis.io/) (ioredis)
- **Testing**: [Jest](https://jestjs.io/) & [Playwright](https://playwright.dev/)
- **Logging**: [Pino](https://getpino.io/)

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- Redis instance (optional for local dev, uses in-memory fallback)
- Google Cloud Project with Civic Info and Gemini APIs enabled

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/election-assistant.git
   cd election-assistant
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your API keys.

4. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔑 Environment Variables

| Variable                | Description                                 | Default                            |
| :---------------------- | :------------------------------------------ | :--------------------------------- |
| `GOOGLE_CIVIC_API_KEY`  | API Key for Google Civic Information API    | Required                           |
| `GOOGLE_GEMINI_API_KEY` | API Key for Google Gemini (Generative AI)   | Required                           |
| `REDIS_URL`             | Redis connection string                     | `undefined` (falls back to memory) |
| `CRON_SECRET`           | Secret for verifying notification cron jobs | `mock-secret`                      |
| `SENDGRID_API_KEY`      | API Key for email notifications             | Optional                           |
| `TWILIO_ACCOUNT_SID`    | Twilio SID for SMS notifications            | Optional                           |

## 🧪 Testing

### Unit & Integration Tests (Jest)

```bash
npm run test          # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### End-to-End Tests (Playwright)

```bash
npx playwright install # Install browser engines
npm run test:e2e       # Run cross-browser tests (Chromium, Firefox, WebKit)
```

## 🏗 Deployment

### Google Cloud Run (Recommended)

1. Build the production image:
   ```bash
   docker build -t gcr.io/[PROJECT-ID]/election-assistant .
   ```
2. Push to Container Registry:
   ```bash
   docker push gcr.io/[PROJECT-ID]/election-assistant
   ```
3. Deploy to Cloud Run:
   ```bash
   gcloud run deploy election-assistant --image gcr.io/[PROJECT-ID]/election-assistant --platform managed
   ```

## 🛡 Security

The project implements several security best practices:

- **CSP**: Strict Content Security Policy with violation reporting via `/api/csp-report`.
- **Honeypot**: Bot detection on all forms.
- **SRI**: Subresource Integrity for external scripts.
- **Rate Limiting**: Redis-backed rate limiting on all API routes.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
