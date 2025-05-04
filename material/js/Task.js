// Task.js
let balance = 0;
let invitedFriends = 0;

async function initTaskModule() {
  try {
    const res = await fetch(window.CONFIG.API_BASE_URL + '/user/state');
    const data = await res.json();
    balance = data.balance;
    invitedFriends = data.invitedFriends;
    updateDisplay();
  } catch (e) {
    console.error('Error loading state:', e);
  }
}

async function completeTask(reward, taskName) {
  try {
    const res = await fetch(window.CONFIG.API_BASE_URL + '/task/complete', {
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
    alert('🎉 You have completed the task and received your reward!');
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
  [3,5,10,20].forEach(function(n) {
    var btn = document.getElementById('claimInvite' + n);
    btn.disabled = invitedFriends < n;
  });
}

async function inviteFriend() {
  try {
    const res = await fetch(window.CONFIG.API_BASE_URL + '/invite', { method: 'POST' });
    const data = await res.json();
    if (!data.error) {
      invitedFriends = data.invitedFriends;
      updateDisplay();
    }
  } catch (err) {
    console.error(err);
  }
}

// initialize
initTaskModule();
