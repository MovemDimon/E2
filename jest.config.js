// jest.config.js
module.exports = {
  // محیط jsdom برای APIهای مرورگر
  testEnvironment: 'jsdom',

  // Babel برای تبدیل ES6
  transform: { '^.+\\.js$': 'babel-jest' },

  // پسوندهای مجاز
  moduleFileExtensions: ['js', 'json'],

  // پوشش تست
  collectCoverage: true,
  coverageDirectory: 'coverage',

  // نادیده گرفتن cypress
  testPathIgnorePatterns: [
    '/node_modules/',
    '/cypress/'
  ],

  // ← این بخش را اضافه کنید:
  roots: [
    '<rootDir>/src'    // فقط داخل src به دنبال تست بگرد
  ],
  testMatch: [
    // هر فایلی که در __tests__ یا با پسوند .test.js/.spec.js باشد
    '<rootDir>/src/**/__tests__/**/*.[jt]s?(x)',
    '<rootDir>/src/**/*.{spec,test}.[jt]s?(x)'
  ]
};
