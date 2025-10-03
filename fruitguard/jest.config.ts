import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',  // Point to your Next.js app directory
});

const customJestConfig: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],  // Optional setup file
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',  // Adjust paths as needed
  },
  clearMocks: true,
};

export default createJestConfig(customJestConfig);
