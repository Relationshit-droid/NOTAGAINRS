module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((react-native.*|@react-native.*|expo.*|@expo.*|@unimodules.*|@react-navigation.*|@react-native-async-storage.*|@testing-library.*)/))',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@screens/(.*)$': '<rootDir>/src/screens/$1',
    '^firebase/app$': '<rootDir>/__mocks__/firebase/app.ts',
    '^firebase/functions$': '<rootDir>/__mocks__/firebase/functions.ts',
    '^@firebase/(.*)$': '<rootDir>/__mocks__/firebase/$1.ts',
    '^@react-native-firebase/(.*)$': '<rootDir>/__mocks__/firebase-native/$1.ts',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/**/*.stories.{ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
  // Let `jest-expo` preset handle the test environment
};
