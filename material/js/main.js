// ========== Initialization ==========
const body = document.body;
const coinEl = document.getElementById('coin');
const countEl = document.querySelector('h1');

// ==== Invite Tracking Helpers ====
function incrementInviteCount(inviterId) {
  const selfId = localStorage.getItem('userId');
  if (inviterId === selfId) return;
  let invited = parseInt(localStorage.getItem('invitedFriends')) || 0;
  invited++;
  localStorage.setItem('invitedFriends', invited);
  // Update invite task buttons if available
  if (typeof updateInviteTaskStatus === 'function') {
    updateInviteTaskStatus();
  }
}

function registerReferral() {
  try {
    const referrerId = Telegram.WebApp.initDataUnsafe?.start_param;
    if (referrerId && !localStorage.getItem('invitedBy')) {
      localStorage.setItem('invitedBy', referrerId);
      incrementInviteCount(referrerId);
    }
  } catch (e) {
    console.warn('Referral registration skipped:', e);
  }
}

function initLocalStorageDefaults() {
  if (localStorage.getItem('coins') == null) localStorage.setItem('coins', '0');
  if (localStorage.getItem('total') == null) localStorage.setItem('total', '500');
  if (localStorage.getItem('power') == null) localStorage.setItem('power', '500');
  if (localStorage.getItem('count') == null) localStorage.setItem('count', '1');
  renderStats();
}

function renderStats() {
  countEl.textContent = Number(localStorage.getItem('coins')).toLocaleString();
  document.getElementById('total').textContent = localStorage.getItem('total');
  document.getElementById('power').textContent = localStorage.getItem('power');
  updatePowerProgress();
}

function updatePowerProgress() {
  const power = +localStorage.getItem('power');
  const total = +localStorage.getItem('total');
  document.querySelector('.progress').style.width = `${(100 * power / total)}%`;
}

// Coin click (safe)
if (coinEl) {
  coinEl.addEventListener('click', e => {
    navigator.vibrate?.(5);
    let coins = +localStorage.getItem('coins');
    let power = +localStorage.getItem('power');
    if (power <= 0) return;
    coins++; power--;
    localStorage.setItem('coins', coins);
    localStorage.setItem('power', power);
    renderStats();
    animateCoin(e);
  });
}

function animateCoin({ offsetX: x, offsetY: y }) {
  const translateX = x < 150 ? -0.25 : 0.25;
  const translateY = y < 150 ? -0.25 : 0.25;
  const skewX = x < 150 ? 5 : -5;
  const skewY = x < 150 ? -10 : 10;
  coinEl.style.transform = `translate(${translateX}rem, ${translateY}rem) skewX(${skewX}deg) skewY(${skewY}deg)`;
  setTimeout(() => coinEl.style.transform = '', 100);
}

// Passive regen
setInterval(() => {
  let power = +localStorage.getItem('power');
  const total = +localStorage.getItem('total');
  const count = +localStorage.getItem('count');
  if (power < total) {
    localStorage.setItem('power', Math.min(total, power + count));
    renderStats();
  }
}, 1000);

// Weekly sync
const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
async function syncWithServer() {
  const userId = localStorage.getItem('userId');
  const authToken = localStorage.getItem('authToken');
  if (!userId || !authToken) return;
  const payload = {
    userId,
    invitedBy: localStorage.getItem('invitedBy') || null,
    invitedFriends: +localStorage.getItem('invitedFriends') || 0,
    balance: +localStorage.getItem('balance') || 0,
    coins: localStorage.getItem('coins'),
    total: localStorage.getItem('total'),
    power: localStorage.getItem('power'),
    count: localStorage.getItem('count'),
    tasks: {
      invite3: localStorage.getItem('invite3'),
      invite5: localStorage.getItem('invite5'),
      invite10: localStorage.getItem('invite10'),
      invite20: localStorage.getItem('invite20'),
    }
  };
  try {
    const res = await fetch('/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(res.statusText);
    localStorage.setItem('lastSyncDate', new Date().toISOString());
  } catch (e) {
    console.error('Sync Error:', e);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initLocalStorageDefaults();
  registerReferral();

  const last = localStorage.getItem('lastSyncDate');
  if (!last || Date.now() - new Date(last) >= oneWeekMs) {
    syncWithServer();
  }
});
