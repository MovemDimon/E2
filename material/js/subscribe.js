// موجودی مشترک
let balance = +localStorage.getItem('balance') || 0;
function updateBalance() {
  const el = document.getElementById('balance');
  el && (el.textContent = balance.toLocaleString());
}
updateBalance();

/**
 * ثبت تسک یک‌بار اجرا
 */
function completeOneTimeTask(taskKey, reward) {
  if (localStorage.getItem(taskKey) === 'done') {
    return alert('⚠️ این تسک قبلاً انجام شده.');
  }
  balance += reward;
  localStorage.setItem('balance', balance);
  localStorage.setItem(taskKey, 'done');
  updateBalance();
  alert(`🎉 تبریک! ${reward.toLocaleString()} سکه جایزه گرفتی.`);
}

/**
 * اعتبارسنجی سروری عمومی
 */
async function verifySubscribe(apiPath, storageKey) {
  const userId = localStorage.getItem(storageKey);
  if (!userId) {
    alert('⚠️ لطفاً اول لاگین کن.');
    return false;
  }
  try {
    const res = await fetch(apiPath, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    const { ok } = await res.json();
    if (!ok) alert('⚠️ هنوز تسک انجام نشده.');
    return ok;
  } catch {
    alert('❌ خطا در ارتباط با سرور.');
    return false;
  }
}

// === توابع کلیک ===

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
