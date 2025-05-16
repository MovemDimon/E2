// jest.config.js
module.exports = {
  // محیط jsdom برای DOM APIs
  testEnvironment: 'jsdom',

  // تبدیل فایل‌های .js با babel-jest
  transform: {
    '^.+\\.js$': 'babel-jest'
  },

  // پسوندهای مجاز
  moduleFileExtensions: ['js', 'json'],

  // گردآوری گزارش پوشش تست
  collectCoverage: true,
  coverageDirectory: 'coverage',

  // IGNORE کردن فولدر cypress از یونیت تست‌ها
  testPathIgnorePatterns: [
    '/node_modules/',
    '/cypress/'
  ],

  // اگر می‌خواهی فقط src/__tests__ را بگردد می‌توانی از testMatch استفاده کنی:
  // testMatch: ['<rootDir>/src/**/__tests__/**/*.js']
};
