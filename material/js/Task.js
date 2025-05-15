// Task.js

// ==== پیکربندی تسک‌ها (همان thresholds و rewards قبلی) ====
const TASK_CONFIG = {
  thresholds: { invite3: 3, invite5: 5, invite10: 10, invite20: 20 },
  rewards:    { invite3: 10000, invite5: 20000, invite10: 70000, invite20: 200000 }
};

// ==== state محلی ====
let balance = parseInt(localStorage.getItem('balance')) || 0;
let invitedFriends = parseInt(localStorage.getItem('invitedFriends')) || 0;

// === تکمیل تسک دعوت دوستان ===
function completeTask(taskName) {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    alert('⚠️ لطفاً ابتدا وارد شوید.');
    return;
  }
  if (localStorage.getItem(taskName) === 'true') {
    alert('⚠️ این تسک قبلاً ثبت شده.');
    return;
  }

  const required = TASK_CONFIG.thresholds[taskName];
  const reward   = TASK_CONFIG.rewards[taskName];

  if (invitedFriends >= required) {
    balance += reward;
    localStorage.setItem('balance', balance);
    localStorage.setItem(taskName, 'true');
    updateBalance();
    alert(`🎉 تبریک! ${reward.toLocaleString()} سکه جایزه گرفتی.`);
    if (typeof syncWithServer === 'function') syncWithServer();
  } else {
    alert(`⚠️ برای تکمیل این تسک باید ${required} دعوت داشته باشی. فعلاً ${invitedFriends} دعوت شده‌اند.`);
  }
}

// === به‌روزرسانی نمایش موجودی ===
function updateBalance() {
  const el = document.getElementById('balance');
  if (el) el.textContent = balance.toLocaleString();
}

// === افزایش دعوت‌شده‌ها ===
function inviteFriend() {
  invitedFriends++;
  localStorage.setItem('invitedFriends', invitedFriends);
  updateInviteTaskStatus();
}

// === وضعیت دکمه‌های تسک ===
function updateInviteTaskStatus() {
  ['invite3','invite5','invite10','invite20'].forEach(key => {
    const btn = document.getElementById(`claim${key.charAt(0).toUpperCase()+key.slice(1)}`);
    if (btn) btn.disabled = invitedFriends < TASK_CONFIG.thresholds[key];
  });
  const status = document.getElementById('inviteTaskStatus');
  if (status) {
    status.textContent = invitedFriends >= TASK_CONFIG.thresholds.invite3
      ? "✅ حداقل ۳ دعوت انجام شده"
      : `⚠️ ${TASK_CONFIG.thresholds.invite3 - invitedFriends} دعوت دیگر نیاز است`;
  }
}

// ==== مقداردهی اولیه ====
updateBalance();
updateInviteTaskStatus();
