// تابع به‌روزرسانی نمایش سکه‌ها
function updateCoinDisplay() {
  const coins = parseInt(localStorage.getItem('coins')) || 0;
  const coinDisplay = document.getElementById('coinCount');
  if (coinDisplay) coinDisplay.textContent = coins.toLocaleString();
}

// به‌روزرسانی هنگام تغییر مقدار سکه‌ها
window.addEventListener('storage', ({ key }) => {
  if (key === 'coins') updateCoinDisplay();
});

// مقداردهی اولیه
updateCoinDisplay();

/**
 * ثبت تکمیل کار روزانه
 */
function completeTaskUrl(taskUrl, reward, url, taskUrlKey) {
  const today = new Date().toISOString().split('T')[0];

  if (localStorage.getItem(taskUrlKey) === today) {
    return showNotification('⚠️ این کار امروز قبلاً انجام شده است');
  }

  // افزایش سکه‌ها
  let coins = parseInt(localStorage.getItem('coins')) || 0;
  coins += reward;
  localStorage.setItem('coins', coins);
  localStorage.setItem(taskUrlKey, today);
  
  // به‌روزرسانی UI
  updateCoinDisplay();
  window.open(url, '_blank');
  showNotification(`🎉 تبریک! ${reward.toLocaleString()} سکه دریافت کردید`);
}
