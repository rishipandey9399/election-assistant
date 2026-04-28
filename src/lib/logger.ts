import pino from 'pino';

const isTest = process.env.NODE_ENV === 'test';
const isDev = process.env.NODE_ENV === 'development';

/**
 * Structured Logger for production observability.
 * - Test: silent (no output, no open handles)
 * - Development: pino-pretty for readable output
 * - Production: JSON output for Google Cloud Logging
 */
const logger = pino({
  level: isTest ? 'silent' : process.env.LOG_LEVEL || 'info',
  ...(!isTest && isDev
    ? {
        transport: {
          target: 'pino-pretty',
          options: { colorize: true },
        },
      }
    : {}),
  base: {
    env: process.env.NODE_ENV,
    service: 'election-assistant',
  },
});

export default logger;
