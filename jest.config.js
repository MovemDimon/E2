// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  moduleFileExtensions: ['js', 'json'],
  collectCoverage: true,
  coverageDirectory: 'coverage',

  // نادیده‌گرفتن فولدرهای غیرتستی
  testPathIgnorePatterns: [
    '/node_modules/',
    '/cypress/'
  ],

  // این الگو هر فایل *.test.js یا *.spec.js را در کل پروژه پیدا می‌کند
  testMatch: [
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ]
};
