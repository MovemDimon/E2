// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  moduleFileExtensions: ['js', 'json'],
  collectCoverage: true,
  coverageDirectory: 'coverage',

  // این فولدرها را نادیده بگیرد
  testPathIgnorePatterns: [
    '/node_modules/',
    '/cypress/'
  ],

  // ← این بخش را جایگزین کنید:
  testMatch: [
    // هر فایلی که در src/__tests__ با پسوند .test.js باشد
    '<rootDir>/src/__tests__/**/*.test.js'
  ]
};
