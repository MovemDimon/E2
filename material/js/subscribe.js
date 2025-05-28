// Shared Balance
let balance = +localStorage.getItem('balance') || 0;

function updateBalance() {
  const el = document.getElementById('balance');
  if (el) el.textContent = balance.toLocaleString();
}
updateBalance();

/**
 * One-Time Task Completion
 */
function completeOneTimeTask(taskKey, reward) {
  if (localStorage.getItem(taskKey) === 'done') {
    return showNotification('⚠️ This task has already been completed.');
  }

  balance += reward;
  localStorage.setItem('balance', balance);
  localStorage.setItem(taskKey, 'done');
  updateBalance();
  showNotification(`🎉 Congrats! You've earned ${reward.toLocaleString()} coins.`);
}

/**
 * Generic Server Verification
 */
async function verifySubscribe(apiPath, storageKey) {
  const userId = localStorage.getItem(storageKey);
  if (!userId) {
    showNotification('⚠️ Please log in first.');
    return false;
  }

  try {
    const res = await fetch(apiPath, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });

    const { ok } = await res.json();
    if (!ok) showNotification('⚠️ You haven’t completed this task yet.');
    return ok;
  } catch {
    showNotification('❌ Failed to connect to the server.');
    return false;
  }
}

// === Click Handlers ===

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
