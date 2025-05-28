if (typeof TASK_CONFIG === 'undefined') {
  var TASK_CONFIG = {
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
}

function completeTask(taskName) {
  try {
    const userId = localStorage.getItem('userId') || "testuser123";

    if (!userId) {
      showNotification('⚠️ Please log in before claiming rewards.');
      return;
    }

    if (localStorage.getItem(taskName) === 'true') {
      showNotification('⚠️ You have already claimed this reward.');
      return;
    }

    const required = TASK_CONFIG.thresholds[taskName];
    const reward = TASK_CONFIG.rewards[taskName];

    if (invitedFriends >= required) {
      balance += reward;
      localStorage.setItem('balance', balance);
      localStorage.setItem(taskName, 'true');
      updateBalance();
      showNotification(`🎉 Congratulations! You received ${reward.toLocaleString()} coins.`);

      if (typeof syncWithServer === 'function') syncWithServer();

    } else {
      const remaining = required - invitedFriends;
      showNotification(`⚠️ You need to invite ${remaining} more friend${remaining === 1 ? '' : 's'} to claim this reward.`);
    }
  } catch (err) {
    alert("❌ JS Error in completeTask: " + err.message);
    console.error(err);
  }
}
