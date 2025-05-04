// js.js (generic tasks)
var balanceLocal = 0;

async function initGenericTasks() {
  try {
    const res = await fetch(window.CONFIG.API_BASE_URL + '/user/balance');
    const data = await res.json();
    balanceLocal = data.balance;
    updateBalance();
  } catch (err) {
    console.error(err);
  }
}

async function completeTaskUrl(reward, taskUrl) {
  try {
    const res = await fetch(window.CONFIG.API_BASE_URL + '/task/complete-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskUrl: taskUrl })
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

// initialize
initGenericTasks();
