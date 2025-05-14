// ========== Initialization ==========
const body = document.body;
const image = body.querySelector('#coin');
const h1 = body.querySelector('h1');

function initLocalStorageDefaults() {
  if (localStorage.getItem('coins') == null) {
    localStorage.setItem('coins', '0');
  }
  h1.textContent = Number(localStorage.getItem('coins')).toLocaleString();

  if (localStorage.getItem('total') == null) {
    localStorage.setItem('total', '500');
  }
  body.querySelector('#total').textContent = `${localStorage.getItem('total')}`;

  if (localStorage.getItem('power') == null) {
    localStorage.setItem('power', '500');
  }
  body.querySelector('#power').textContent = localStorage.getItem('power');

  if (localStorage.getItem('count') == null) {
    localStorage.setItem('count', '1');
  }

  updatePowerProgress();
}

function updatePowerProgress() {
  const power = Number(localStorage.getItem('power'));
  const total = Number(localStorage.getItem('total'));
  const percent = (100 * power) / total;
  body.querySelector('.progress').style.width = `${percent}%`;
}

// ========== Coin Click Event ==========
image.addEventListener('click', (e) => {
  let x = e.offsetX;
  let y = e.offsetY;
  navigator.vibrate(5);

  let coins = Number(localStorage.getItem('coins'));
  let power = Number(localStorage.getItem('power'));

  if (power > 0) {
    coins += 1;
    power -= 1;
    localStorage.setItem('coins', coins.toString());
    localStorage.setItem('power', power.toString());
    h1.textContent = coins.toLocaleString();
    body.querySelector('#power').textContent = power.toString();
    updatePowerProgress();
  }

  // انیمیشن سکه
  if (x < 150 && y < 150) {
    image.style.transform = 'translate(-0.25rem, -0.25rem) skewY(-10deg) skewX(5deg)';
  } else if (x < 150 && y > 150) {
    image.style.transform = 'translate(-0.25rem, 0.25rem) skewY(-10deg) skewX(5deg)';
  } else if (x > 150 && y > 150) {
    image.style.transform = 'translate(0.25rem, 0.25rem) skewY(10deg) skewX(-5deg)';
  } else if (x > 150 && y < 150) {
    image.style.transform = 'translate(0.25rem, -0.25rem) skewY(10deg) skewX(-5deg)';
  }
  setTimeout(() => { image.style.transform = 'translate(0px, 0px)'; }, 100);
});

// ========== Passive Power Regen ==========
setInterval(() => {
  let count = Number(localStorage.getItem('count'));
  let power = Number(localStorage.getItem('power'));
  const total = Number(localStorage.getItem('total'));
  if (power < total) {
    power = Math.min(total, power + count);
    localStorage.setItem('power', power.toString());
    body.querySelector('#power').textContent = power.toString();
    updatePowerProgress();
  }
}, 1000);

// ========== Weekly Sync System ==========
const oneWeekMs = 7 * 24 * 60 * 60 * 1000;

async function syncWithServer() {
  const userId = localStorage.getItem('userId');
  const authToken = localStorage.getItem('authToken');
  if (!userId || !authToken) {
    console.warn('Sync skipped: Missing user ID or auth token');
    return;
  }

  // 1. ارسال وضعیت کاربر
  await fetch('/data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      userId,
      balance: parseInt(localStorage.getItem('balance')) || 0,
      invitedFriends: parseInt(localStorage.getItem('invitedFriends')) || 0
    })
  }).catch(err => console.error('User sync error:', err));

  // 2. ارسال آخرین پرداخت (در صورت وجود)
  const lastPaymentRaw = localStorage.getItem('lastPayment');
  if (lastPaymentRaw) {
    await fetch('/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: lastPaymentRaw
    }).catch(err => console.error('Payment sync error:', err));

    localStorage.removeItem('lastPayment');
  }

  localStorage.setItem('lastSyncDate', new Date().toISOString());
}

// ========== App Load ==========
document.addEventListener('DOMContentLoaded', () => {
  initLocalStorageDefaults();
  const lastSyncDate = localStorage.getItem('lastSyncDate');
  if (!lastSyncDate || (Date.now() - new Date(lastSyncDate).getTime()) >= oneWeekMs) {
    syncWithServer();
  }
});
