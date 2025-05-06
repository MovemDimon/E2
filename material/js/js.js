// js.js (generic tasks - modified)
var balanceLocal = 0;

function initGenericTasks() {
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  balanceLocal = userData.balance || 0;
  updateBalance();
}

function completeTaskUrl(reward, taskUrl) {
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  userData.balance = (userData.balance || 0) + reward;
  balanceLocal = userData.balance;

  // ذخیره برای همگام‌سازی بعدی
  const syncQueue = JSON.parse(localStorage.getItem('syncQueue') || '[]');
  syncQueue.push({ type: 'task-url', taskUrl, reward, timestamp: Date.now() });
  localStorage.setItem('syncQueue', JSON.stringify(syncQueue));

  localStorage.setItem('userData', JSON.stringify(userData));
  updateBalance();

  window.open(taskUrl, '_blank');
}

function updateBalance() {
  document.getElementById('balance').textContent = balanceLocal;
}

initGenericTasks();
