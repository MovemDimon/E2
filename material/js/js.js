// Function to update the coin display
function updateCoinDisplay() {
  const coins = parseInt(localStorage.getItem('coins')) || 0;
  const coinDisplay = document.getElementById('coinCount');

  if (coinDisplay) coinDisplay.textContent = coins.toLocaleString('en-US');
}

// Update when coin value changes
window.addEventListener('storage', ({ key }) => {
  if (key === 'coins') updateCoinDisplay();
});

// Initial load
updateCoinDisplay();

/**
 * Register daily task completion
 */
function completeTaskUrl(taskUrl, reward, url, taskUrlKey) {
  const today = new Date().toISOString().split('T')[0];

  if (localStorage.getItem(taskUrlKey) === today) {
    return showNotification('⚠️ This task has already been completed today.');
  }

  // Increase coin count
  let coins = parseInt(localStorage.getItem('coins')) || 0;
  coins += reward;
  localStorage.setItem('coins', coins);
  localStorage.setItem(taskUrlKey, today);

  // Update UI
  updateCoinDisplay();
  window.open(url, '_blank');
  showNotification(`🎉 Congratulations! You earned ${reward.toLocaleString()} coins.`);
}
