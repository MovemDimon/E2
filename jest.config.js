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
  
  const path = require('path');

module.exports = {
  configureWebpack: {
    entry: path.resolve(__dirname, 'material/js/main.js')
  }
};

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
