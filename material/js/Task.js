// ==== Invite System Configuration ====
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

// ==== Local Status ====
let invitedFriends = parseInt(localStorage.getItem('invitedFriends')) || 0;

// ==== Update Coin Display ====
function updateCoinDisplay() {
  const coins = parseInt(localStorage.getItem('coins')) || 0;
  const coinDisplay = document.getElementById('coinCount');
  if (coinDisplay) coinDisplay.textContent = coins.toLocaleString('en-US');
}

// ==== Complete Invite Task ====
async function completeTask(taskName) {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    showNotification('⚠️ Please log in first');
    return;
  }

  if (localStorage.getItem(taskName) === 'true') {
    showNotification('⚠️ You have already claimed this reward');
    return;
  }

  const required = TASK_CONFIG.thresholds[taskName];
  const reward = TASK_CONFIG.rewards[taskName];
  invitedFriends = parseInt(localStorage.getItem('invitedFriends')) || 0;

  if (invitedFriends < required) {
    const remaining = required - invitedFriends;
    showNotification(`⚠️ Invite ${remaining} more friend${remaining === 1 ? '' : 's'} to claim this reward`);
    return;
  }

  try {
    const res = await fetch('/verify-invites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: taskName, userId }),
    });

    if (!res.ok) {
      showNotification('⚠️ Server verification failed');
      return;
    }
    const { valid } = await res.json();
    if (!valid) {
      showNotification('⚠️ Server verification failed');
      return;
    }
  } catch {
    showNotification('❌ Error connecting to the server');
    return;
  }

  // Grant reward
  let coins = parseInt(localStorage.getItem('coins')) || 0;
  coins += reward;
  localStorage.setItem('coins', coins);
  localStorage.setItem(taskName, 'true');

  invitedFriends = parseInt(localStorage.getItem('invitedFriends')) || 0;
  updateCoinDisplay();
  updateInviteTaskStatus();
  showNotification(`🎉 Congratulations! You received ${reward.toLocaleString()} coins`);

  if (typeof syncWithServer === 'function') syncWithServer();
}

// ==== Disable Buttons Only If Reward Claimed ====
function updateInviteTaskStatus() {
  ['invite3', 'invite5', 'invite10', 'invite20'].forEach(key => {
    const btnId = `claim${key.charAt(0).toUpperCase() + key.slice(1)}`;
    const btn = document.getElementById(btnId);
    if (btn) {
      const completed = localStorage.getItem(key) === 'true';
      btn.disabled = completed;
    }
  });

  const status = document.getElementById('inviteTaskStatus');
  if (status) {
    const remaining = Math.max(0, 3 - invitedFriends);
    status.textContent = invitedFriends >= 3
      ? '✅ You have invited at least 3 friends'
      : `⚠️ Invite ${remaining} more to unlock your reward`;
  }
}

// ==== Initial Setup ====
document.addEventListener('DOMContentLoaded', () => {
  updateCoinDisplay();
  updateInviteTaskStatus();
});
