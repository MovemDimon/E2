// تابع به‌روزرسانی نمایش سکه‌ها
function updateCoinDisplay() {
  const coins = parseInt(localStorage.getItem('coins')) || 0;
  const coinDisplay = document.getElementById('coinCount');
  if (coinDisplay) coinDisplay.textContent = coins.toLocaleString();
}

// مقداردهی اولیه
updateCoinDisplay();

/**
 * ثبت تکمیل کار یک‌باره
 */
function completeOneTimeTask(taskKey, reward) {
  if (localStorage.getItem(taskKey) === 'done') {
    return showNotification('⚠️ این کار قبلاً انجام شده است');
  }

  // افزایش سکه‌ها
  let coins = parseInt(localStorage.getItem('coins')) || 0;
  coins += reward;
  localStorage.setItem('coins', coins);
  localStorage.setItem(taskKey, 'done');
  
  // به‌روزرسانی UI
  updateCoinDisplay();
  showNotification(`🎉 تبریک! ${reward.toLocaleString()} سکه دریافت کردید`);
}

/**
 * تأیید اشتراک از سرور
 */
async function verifySubscribe(apiPath, storageKey) {
  const userId = localStorage.getItem(storageKey);
  if (!userId) {
    showNotification('⚠️ لطفاً ابتدا وارد شوید');
    return false;
  }

  try {
    const res = await fetch(apiPath, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });

    const { ok } = await res.json();
    if (!ok) showNotification('⚠️ هنوز این کار را انجام نداده‌اید');
    return ok;
  } catch {
    showNotification('❌ خطا در اتصال به سرور');
    return false;
  }
}

// === کنترل‌کننده‌های کلیک ===
async function onTelegramSubscribeClick() {
  if (await verifySubscribe('/api/verify-telegram-subscribe', 'telegramUserId')) {
    completeOneTimeTask('subscribeTelegram', 100);
  }
}

async function onYouTubeSubscribeClick() {
  if (await verifySubscribe('/api/verify-youtube-subscribe', 'youtubeAccessToken')) {
    completeOneTimeTask('subscribeYouTube', 150);
  }
}

async function onInstagramFollowClick() {
  if (await verifySubscribe('/api/verify-instagram-follow', 'instagramAccessToken')) {
    completeOneTimeTask('followInstagram', 150);
  }
}
