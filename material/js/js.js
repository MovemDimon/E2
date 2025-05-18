// js.js

let balance = parseInt(localStorage.getItem('balance')) || 0;

window.addEventListener('storage', ({ key, newValue }) => {
  if (key === 'balance') {
    balance = parseInt(newValue) || 0;
    updateBalance();
  }
});

function updateBalance() {
  const el = document.getElementById('balance');
  el && (el.textContent = balance);
}

/**
 * ثبت تسک به‌صورت روزانه
 * @param {string} taskUrlKey ‑ کلیدی که date ISO توش ذخیره می‌شه
 * @param {number} reward ‑ مقدار جایزه
 * @param {string} url ‑ آدرسی که باید باز کنه
 */
function completeTaskUrl(taskUrlKey, reward, url) {
  const today = new Date().toISOString().split('T')[0];
  if (localStorage.getItem(taskUrlKey) === today) {
    return alert('⚠️ این تسک امروز قبلاً ثبت شده.');
  }
  balance += reward;
  localStorage.setItem('balance', balance);
  localStorage.setItem(taskUrlKey, today);
  updateBalance();
  window.open(url, '_blank');
  alert(`🎉 تبریک! ${reward.toLocaleString()} سکه جایزه گرفتی.`);
}
