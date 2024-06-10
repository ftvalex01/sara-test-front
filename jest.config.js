module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTest.js'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(axios)/)',
  ],
  moduleFileExtensions: ['js', 'jsx'],
  testMatch: [
    '**/__tests__/**/*.+(js|jsx|ts|tsx)',
    '**/?(*.)+(spec|test).+(js|jsx|ts|tsx)'
  ],
  moduleDirectories: ['node_modules', 'src'],
};
