let balance = 0;
let invitedFriends = 0;

function initTaskModule() {
  const data = JSON.parse(localStorage.getItem('userData') || '{}');
  balance = data.balance || 0;
  invitedFriends = data.invitedFriends || 0;
  updateDisplay();
}

function completeTask(reward, taskName) {
  addTask(taskName, reward);

  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  userData.balance = (userData.balance || 0) + reward;
  balance = userData.balance;

  localStorage.setItem('userData', JSON.stringify(userData));
  updateDisplay();

  const syncQueue = JSON.parse(localStorage.getItem('syncQueue') || '[]');
  syncQueue.push({ type: 'task', taskName, reward, timestamp: Date.now() });
  localStorage.setItem('syncQueue', JSON.stringify(syncQueue));

  alert('🎉 You have completed the task and received your reward!');
}

function updateDisplay() {
  document.getElementById('balance').textContent = balance;
  document.getElementById('inviteCount').textContent = invitedFriends;
  updateInviteButtons();
}

function updateInviteButtons() {
  [3, 5, 10, 20].forEach(function(n) {
    var btn = document.getElementById('claimInvite' + n);
    btn.disabled = invitedFriends < n;
  });
}

function inviteFriend() {
  invitedFriends++;
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  userData.invitedFriends = invitedFriends;
  localStorage.setItem('userData', JSON.stringify(userData));
  updateDisplay();

  const syncQueue = JSON.parse(localStorage.getItem('syncQueue') || '[]');
  syncQueue.push({ type: 'invite', timestamp: Date.now() });
  localStorage.setItem('syncQueue', JSON.stringify(syncQueue));
}

initTaskModule();
