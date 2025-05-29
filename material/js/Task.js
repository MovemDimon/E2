// ==== تنظیمات سیستم دعوت ====
const TASK_CONFIG = {
  thresholds: {
    invite3: 3,
    invite5: 5,
    invite10: 10,
    invite20: 20,
  },
  rewards: {
    invite3: 10000,
    invite5: 20000,
    invite10: 70000,
    invite20: 200000,
  },
};

// ==== وضعیت محلی ====
let invitedFriends = parseInt(localStorage.getItem('invitedFriends')) || 0;

// ==== تابع به‌روزرسانی نمایش سکه‌ها ====
function updateCoinDisplay() {
  const coins = parseInt(localStorage.getItem('coins')) || 0;
  const coinDisplay = document.getElementById('coinCount');
  if (coinDisplay) coinDisplay.textContent = coins.toLocaleString();
}

// ==== تکمیل کار دعوت ====
async function completeTask(taskName) {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    showNotification('⚠️ لطفاً ابتدا وارد شوید');
    return;
  }

  if (localStorage.getItem(taskName) === 'true') {
    showNotification('⚠️ این جایزه قبلاً دریافت شده است');
    return;
  }

  const required = TASK_CONFIG.thresholds[taskName];
  const reward = TASK_CONFIG.rewards[taskName];

  if (invitedFriends < required) {
    const remaining = required - invitedFriends;
    showNotification(`⚠️ برای دریافت جایزه باید ${remaining} دوست${remaining === 1 ? '' : 'ان'} دیگر دعوت کنید`);
    return;
  }

  try {
    const res = await fetch('/verify-invites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: taskName, userId }),
    });

    const { valid } = await res.json();
    if (!valid) {
      showNotification('⚠️ تأیید سرور انجام نشد');
      return;
    }
  } catch {
    showNotification('❌ خطا در اتصال به سرور');
    return;
  }

  // اعطای جایزه
  let coins = parseInt(localStorage.getItem('coins')) || 0;
  coins += reward;
  localStorage.setItem('coins', coins);
  localStorage.setItem(taskName, 'true');

  updateCoinDisplay();
  updateInviteTaskStatus();
  showNotification(`🎉 تبریک! ${reward.toLocaleString()} سکه دریافت کردید`);

  if (typeof syncWithServer === 'function') syncWithServer();
}

// ==== به‌روزرسانی وضعیت دکمه‌ها ====
function updateInviteTaskStatus() {
  ['invite3', 'invite5', 'invite10', 'invite20'].forEach(key => {
    const btnId = `claim${key.charAt(0).toUpperCase() + key.slice(1)}`;
    const btn = document.getElementById(btnId);
    if (btn) {
      const completed = localStorage.getItem(key) === 'true';
      btn.disabled = completed;
      btn.textContent = completed ? '✅ دریافت شد' : '💎 دریافت جایزه';
    }
  });

  const status = document.getElementById('inviteTaskStatus');
  if (status) {
    status.textContent = invitedFriends >= 3
      ? '✅ حداقل ۳ دوست دعوت کرده‌اید'
      : `⚠️ ${3 - invitedFriends} دعوت دیگر برای دریافت جایزه`;
  }
}

// ==== راه‌اندازی اولیه ====
document.addEventListener('DOMContentLoaded', () => {
  updateCoinDisplay();
  updateInviteTaskStatus();
});
