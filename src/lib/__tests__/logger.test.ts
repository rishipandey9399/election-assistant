/**
 * @jest-environment node
 *
 * Logger is mocked in jest.setup.ts globally. These tests validate the real
 * module's structure so coverage is attributed correctly.
 */

// Unmock logger for this file so we actually exercise logger.ts
jest.unmock('@/lib/logger');

describe('logger', () => {
  let logger: typeof import('@/lib/logger').default;

  beforeEach(async () => {
    // Re-import fresh module to pick up NODE_ENV
    jest.resetModules();
    logger = (await import('@/lib/logger')).default;
  });

  it('exports an object with the standard pino log methods', () => {
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.debug).toBe('function');
  });

  it('has level set to "silent" in test environment', () => {
    // NODE_ENV is "test" in Jest runs
    expect(logger.level).toBe('silent');
  });

  it('does not throw when calling logger.info', () => {
    expect(() => logger.info('test message')).not.toThrow();
  });

  it('does not throw when calling logger.error with an object', () => {
    expect(() => logger.error({ err: new Error('boom') }, 'error context')).not.toThrow();
  });

  it('does not throw when calling logger.warn', () => {
    expect(() => logger.warn('warning message')).not.toThrow();
  });
});
