import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/', '<rootDir>/e2e/'],

  /**
   * Coverage configuration.
   * Collected from all source files (excluding tests, types, and generated files)
   * to surface untested modules — not just files that happen to be imported.
   */
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/app/layout.tsx', // Server wrapper — no testable logic
    '!src/app/globals.css',
    '!src/types/**',
    // Infrastructure setup files — purely SDK instantiation, no testable branches
    '!src/lib/firebase.ts',
    '!src/lib/redis.ts',
    '!src/lib/firestore.ts', // Covered by dedicated firestore.test.ts but excluded from global threshold
  ],

  /**
   * Minimum thresholds. Build fails if any metric drops below these values.
   * Incremented incrementally to force coverage growth with each PR.
   */
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 55,
      lines: 65,
      statements: 65,
    },
    // Per-directory floors — enforced independently of global
    './src/lib/': {
      branches: 65, // env.ts branches fully covered; cache/rateLimit cover most paths
      functions: 30, // env.ts getters are infrastructure; logger is import-time config
      lines: 75,
      statements: 75,
    },
    './src/services/': {
      branches: 80,
      functions: 85,
      lines: 95,
      statements: 95,
    },
  },
};

export default createJestConfig(config);
