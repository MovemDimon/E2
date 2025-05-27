function completeTask(taskName) {
  alert("✅ دکمه invite3 کلیک شد و completeTask اجرا شد با مقدار: " + taskName);

  const userId = localStorage.getItem('userId');
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
}
