// Constants for channel links
const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/channel/UCxxxxxxxxxxxxxxxxx';
const INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/yourpage';

// Utility: update display of coin count
function updateCoinDisplay() {
  const coins = parseInt(localStorage.getItem('coins')) || 0;
  const coinDisplay = document.getElementById('coinCount');
  if (coinDisplay) coinDisplay.textContent = coins.toLocaleString('en-US');
}

// Initial display
updateCoinDisplay();

// Reward completion of a one-time task
function completeOneTimeTask(taskKey, reward) {
  if (localStorage.getItem(taskKey) === 'done') {
    return showNotification('⚠️ You have already completed this task.');
  }

  let coins = parseInt(localStorage.getItem('coins')) || 0;
  coins += reward;
  localStorage.setItem('coins', coins);
  localStorage.setItem(taskKey, 'done');

  updateCoinDisplay();
  showNotification(`🎉 Congratulations! You earned ${reward.toLocaleString('en-US')} coins.`);
}

// Fake verification for YouTube & Instagram
typeFakeVerify(async function fakeVerifyTask(taskKey, reward, redirectUrl) {
  showNotification('⏳ Redirecting, please complete the action and wait...');
  // Open the platform link
  window.open(redirectUrl, '_blank');

  // Simulate verification delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  completeOneTimeTask(taskKey, reward);
});

// Real verification for Telegram
async function verifyTelegramSubscribe() {
  const userId = localStorage.getItem('telegramUserId');
  if (!userId) {
    showNotification('⚠️ Please log in first.');
    return false;
  }

  showNotification('⏳ Verifying your Telegram subscription, please wait...');
  try {
    const res = await fetch('/api/verify-telegram-subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });

    const { ok } = await res.json();
    if (!ok) showNotification('⚠️ You haven’t joined the channel yet.');
    return ok;
  } catch {
    showNotification('❌ Server error. Please try again later.');
    return false;
  }
}

// Event handlers
async function onTelegramSubscribeClick() {
  // Real verification via server
  if (await verifyTelegramSubscribe()) {
    completeOneTimeTask('subscribeTelegram', 100);
  }
}

async function onYouTubeSubscribeClick() {
  await fakeVerifyTask('subscribeYouTube', 100, YOUTUBE_CHANNEL_URL);
}

async function onInstagramFollowClick() {
  await fakeVerifyTask('followInstagram', 100, INSTAGRAM_PROFILE_URL);
}

// Attach event listeners
const btnTelegram = document.getElementById('btnTelegram');
if (btnTelegram) btnTelegram.addEventListener('click', onTelegramSubscribeClick);

const btnYouTube = document.getElementById('btnYouTube');
if (btnYouTube) btnYouTube.addEventListener('click', onYouTubeSubscribeClick);

const btnInstagram = document.getElementById('btnInstagram');
if (btnInstagram) btnInstagram.addEventListener('click', onInstagramFollowClick);
