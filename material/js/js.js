let balance = parseInt(localStorage.getItem('balance')) || 0;

window.addEventListener('storage', ({ key, newValue }) => {
  if (key === 'balance') {
    balance = parseInt(newValue) || 0;
    updateBalance();
  }
});

function updateBalance() {
  const el = document.getElementById('balance');
  el && (el.textContent = balance.toLocaleString());
}

/**
 * Registers a daily task reward
 * @param {string} taskUrlKey - Key to store ISO date
 * @param {number} reward - Reward amount
 * @param {string} url - URL to open
 */
function completeTaskUrl(reward, taskUrl) {
  const today = new Date().toISOString().split('T')[0];

  if (localStorage.getItem(taskUrlKey) === today) {
    return showNotification('⚠️ This task has already been completed today.');
  }

  balance += reward;
  localStorage.setItem('balance', balance);
  localStorage.setItem(taskUrlKey, today);
  updateBalance();

  window.open(url, '_blank');

  showNotification(`🎉 Congrats! You've earned ${reward.toLocaleString()} coins.`);
}
