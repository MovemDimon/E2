import fs from 'fs';

// خواندن فایل config.json
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

// صادر کردن تنظیمات
export const CONFIG = {
  API_BASE_URL: config.API_BASE_URL,
  WS_HOSTS: config.WS_HOSTS
};
