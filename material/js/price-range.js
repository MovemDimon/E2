function updatePriceRangeDisplay() {
  const coins = parseInt(localStorage.getItem('coins')) || 0;

  const minUsd = (coins * 0.0003).toFixed(2);
  const maxUsd = (coins * 0.0007).toFixed(2);

  const minEl = document.getElementById('minUsd');
  const maxEl = document.getElementById('maxUsd');

  if (minEl) minEl.textContent = `$${minUsd}`;
  if (maxEl) maxEl.textContent = `$${maxUsd}`;
}

// به‌روزرسانی اولیه
updatePriceRangeDisplay();

// اگر مقدار سکه‌ها تغییر کرد، بازه دلاری هم به‌روز شود
window.addEventListener('storage', ({ key }) => {
  if (key === 'coins') updatePriceRangeDisplay();
});
