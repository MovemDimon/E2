document.addEventListener('DOMContentLoaded', function() {
  var image = document.getElementById('coin');
  var label = document.querySelector('h1');
  var totalEl = document.getElementById('total');
  var powerEl = document.getElementById('power');
  var progress = document.querySelector('.progress');

  var state = { coins: 0, total: 500, power: 500, count: 1 };

  function loadState() {
    const saved = JSON.parse(localStorage.getItem('clicker') || '{}');
    state = Object.assign(state, saved);
  }

  function saveState() {
    localStorage.setItem('clicker', JSON.stringify(state));
  }

  loadState();
  updateUI();

  image.addEventListener('click', function() {
    state.coins += state.count;
    saveState();
    updateUI();
  });

  function updateUI() {
    totalEl.textContent = state.coins;
    powerEl.textContent = state.power;
    progress.style.width = (state.coins / state.total) * 100 + '%';
  }

  // --------------------------
  // 🔁 [افزوده‌شده] همگام‌سازی هفتگی
  // --------------------------
  try {
    const lastSync = parseInt(localStorage.getItem('lastSync') || '0', 10);
    const now = Date.now();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;

    if (now - lastSync > oneWeek) {
      if (typeof syncAllData === 'function') {
        syncAllData();
        localStorage.setItem('lastSync', now.toString());
      } else {
        console.warn("تابع syncAllData یافت نشد!");
      }
    }
  } catch (err) {
    console.error("خطا در بررسی sync هفتگی:", err);
  }

});
