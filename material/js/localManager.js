// localManager.js

const LOCAL_KEY = 'userData';

export function getLocalData() {
  const data = localStorage.getItem(LOCAL_KEY);
  return data ? JSON.parse(data) : {
    balance: 0,
    invitedFriends: 0,
    lastSync: new Date(0).toISOString(),
    tasks: []
  };
}

export function saveLocalData(data) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
}

export function addTask(taskName, reward) {
  const data = getLocalData();
  data.balance += reward;
  data.tasks.push({ taskName, reward, timestamp: new Date().toISOString() });
  saveLocalData(data);
}

export function shouldSync() {
  const data = getLocalData();
  const last = new Date(data.lastSync);
  const now = new Date();
  return (now - last) > 7 * 24 * 60 * 60 * 1000; // 7 روز
}

export function markSynced() {
  const data = getLocalData();
  data.lastSync = new Date().toISOString();
  data.tasks = []; // پس از سینک شدن، لیست تسک‌ها پاک میشه
  saveLocalData(data);
}
