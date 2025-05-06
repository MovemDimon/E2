// sync.js

import { getLocalData, shouldSync, markSynced } from './localManager.js';

function syncWithServer() {
  if (!shouldSync()) return;

  const data = getLocalData();

  navigator.sendBeacon(
    window.CONFIG.API_BASE_URL + '/user/sync',
    JSON.stringify({
      tasks: data.tasks,
      balance: data.balance,
      invitedFriends: data.invitedFriends
    })
  );

  markSynced(); // بعد از ارسال، تاریخ سینک بروزرسانی میشه
}

window.addEventListener('unload', syncWithServer);
