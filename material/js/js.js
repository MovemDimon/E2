// js.js (generic tasks)
import { CONFIG } from './config.js';

let balanceLocal = 0;

async function initTasks() {
  const res = await fetch(`${CONFIG.API_BASE_URL}/user/balance`);
  const data = await res.json();
  balanceLocal = data.balance;
  updateBalance();
}

async function completeTaskUrl(taskUrl) {
  try {
    const res = await fetch(`${CONFIG.API_BASE_URL}/task/complete-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskUrl })
    });
    const result = await res.json();
    if (result.newBalance !== undefined) {
      balanceLocal = result.newBalance;
      updateBalance();
      window.open(taskUrl, '_blank');
    }
  } catch (err) {
    console.error(err);
  }
}

function updateBalance() {
  document.getElementById('balance').textContent = balanceLocal;
}

initTasks();
