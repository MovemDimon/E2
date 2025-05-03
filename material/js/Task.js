// Task.js
import { CONFIG } from './config.js';

const TASK_REWARDS = {
  invite3: 10000,
  invite5: 20000,
  invite10: 70000,
  invite20: 200000
};

let balance = 0;
let invitedFriends = 0;

async function init() {
  const res = await fetch(`${CONFIG.API_BASE_URL}/user/state`);
  const data = await res.json();
  balance = data.balance;
  invitedFriends = data.invitedFriends;
  updateDisplay();
}

// تابع تکمیل تسک بدون پارامتر reward
async function completeTask(taskName) {
  const reward = TASK_REWARDS[taskName];
  if (!reward) {
    alert('تسک نامعتبر است.');
    return;
  }
  try {
    const res = await fetch(`${CONFIG.API_BASE_URL}/task/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskName })
    });
    const result = await res.json();
    if (result.error) {
      alert(result.error);
      return;
    }
    balance = result.newBalance;
    invitedFriends = result.invitedFriends;
    updateDisplay();
    alert(`🎉 تسک ${taskName} با موفقیت انجام شد و ${reward.toLocaleString()} کوین دریافت کردید!`);
  } catch (err) {
    console.error(err);
    alert('خطا در برقراری ارتباط با سرور.');
  }
}

function updateDisplay() {
  document.getElementById('balance').textContent = balance;
  document.getElementById('inviteCount').textContent = invitedFriends;
  updateInviteButtons();
}

function updateInviteButtons() {
  Object.entries(TASK_REWARDS).forEach(([key, _]) => {
    const n = Number(key.replace('invite', ''));
    const btn = document.getElementById(`claimInvite${n}`);
    if (btn) btn.disabled = invitedFriends < n;
  });
}

async function inviteFriend() {
  try {
    const res = await fetch(`${CONFIG.API_BASE_URL}/invite`, { method: 'POST' });
    const data = await res.json();
    if (!data.error) {
      invitedFriends = data.invitedFriends;
      updateDisplay();
    }
  } catch (err) {
    console.error(err);
  }
}

// Initialize on load
init();
