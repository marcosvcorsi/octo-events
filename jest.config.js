/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  clearMocks: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**/*.ts',
    '!<rootDir>/src/**/index.ts',
  ],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleNameMapper: {
    '@/tests/(.+)$': '<rootDir>/tests/$1',
    '@/(.+)$': '<rootDir>/src/$1',
  },
  preset: 'ts-jest',
  testMatch: ['**/*.spec.ts'],
  setupFiles: ['<rootDir>/test/setup.ts'],
};
