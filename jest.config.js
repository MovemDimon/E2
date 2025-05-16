// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  transform: { '^.+\\.js$': 'babel-jest' },
  moduleFileExtensions: ['js', 'json'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/cypress/'
  ]
};
