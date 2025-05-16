// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  transform: { '^.+\\.js$': 'babel-jest' },
  moduleFileExtensions: ['js', 'json'],
  collectCoverage: true,
  coverageDirectory: 'coverage',

  // نادیده‌گرفتن فولدرهای غیرتستی
  testPathIgnorePatterns: [
    '/node_modules/',
    '/cypress/'
  ],

  // ← این قسمت را قرار دهید:
  roots: [
    '<rootDir>'
  ],
  testMatch: [
    // هر فایلی با پسوند .test.js یا .spec.js در ریشه یا زیرپوشه‌ها
    '<rootDir>/**/*.test.js',
    '<rootDir>/**/*.spec.js'
  ]
};
