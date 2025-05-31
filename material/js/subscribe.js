// ░█████╗░░█████╗░██╗███╗░░██╗███████╗
// ██╔══██╗██╔══██╗██║████╗░██║██╔════╝
// ██║░░╚═╝██║░░██║██║██╔██╗██║█████╗░░
// ██║░░██╗██║░░██║██║██║╚████║██╔══╝░░
// ╚█████╔╝╚█████╔╝██║██║░╚███║███████╗
// ░╚════╝░░╚════╝░╚═╝╚═╝░░╚══╝╚══════╝

// Constants
const YOUTUBE_CHANNEL_URL = 'https://youtube.com/@vantar-holding?si=9E5GCxb8k5l5NFur';
const INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/vantar_holding/profilecard/?igsh=MXFmdTFucGxlaXlxOA==';

// Initialize coins
function initCoins() {
  if (!localStorage.getItem('coins')) {
    localStorage.setItem('coins', '0');
  }
  updateCoinDisplay();
}

// Update coin display
function updateCoinDisplay() {
  const coins = parseInt(localStorage.getItem('coins')) || 0;
  const coinDisplay = document.getElementById('coinCount');
  if (coinDisplay) coinDisplay.textContent = coins.toLocaleString('en-US');
}

// Reward handling
function completeOneTimeTask(taskKey, reward) {
  if (localStorage.getItem(taskKey) === 'done') {
    showNotification('⚠️ You have already completed this task.');
    return false;
  }

  const coins = parseInt(localStorage.getItem('coins')) || 0;
  localStorage.setItem('coins', coins + reward);
  localStorage.setItem(taskKey, 'done');

  updateCoinDisplay();
  showNotification(`🎉 Congratulations! You earned ${reward} coins.`);
  return true;
}

// Fake verification (YouTube & Instagram)
async function fakeVerifyTask(taskKey, reward, redirectUrl) {
  showNotification('⏳ Redirecting, please complete the action...');
  window.open(redirectUrl, '_blank');
  
  await new Promise(resolve => setTimeout(resolve, 30000));
  return completeOneTimeTask(taskKey, reward);
}

// Telegram verification (real)
async function verifyTelegramSubscribe() {
  const userId = localStorage.getItem('telegramUserId');
  
  if (!userId) {
    showNotification('⚠️ Please log in with Telegram first.');
    return false;
  }

  try {
    showNotification('⏳ Verifying your Telegram subscription...');
    const response = await fetch('/api/verify-telegram-subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });

    if (!response.ok) {
      showNotification('⚠️ Verification failed. Please try again.');
      return false;
    }

    const data = await response.json();
    return data.ok === true;
  } catch (error) {
    showNotification('❌ Server error. Please try again later.');
    return false;
  }
}

// Event Handlers
async function onTelegramSubscribeClick() {
  if (await verifyTelegramSubscribe()) {
    completeOneTimeTask('subscribeTelegram', 100);
  } else {
    showNotification('❌ Verification failed. Please join the channel first.');
  }
}

async function onYouTubeSubscribeClick() {
  await fakeVerifyTask('subscribeYouTube', 100, YOUTUBE_CHANNEL_URL);
}

async function onInstagramFollowClick() {
  await fakeVerifyTask('followInstagram', 100, INSTAGRAM_PROFILE_URL);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  initCoins();
  
  // Attach event listeners to buttons
  const btnTelegram = document.getElementById('btnTelegram');
  const btnYouTube = document.getElementById('btnYouTube');
  const btnInstagram = document.getElementById('btnInstagram');
  
  if (btnTelegram) {
    btnTelegram.addEventListener('click', onTelegramSubscribeClick);
  }
  
  if (btnYouTube) {
    btnYouTube.addEventListener('click', onYouTubeSubscribeClick);
  }
  
  if (btnInstagram) {
    btnInstagram.addEventListener('click', onInstagramFollowClick);
  }
});
