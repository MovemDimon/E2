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

  // مسیرهای جستجوی تست
  roots: [
    '<rootDir>'
  ],
  testMatch: [
    '<rootDir>/**/*.test.js',
    '<rootDir>/**/*.spec.js'
  ]
};
