// ========== Initialize Balance ==========
let balance = parseInt(localStorage.getItem('balance')) || 0;

// ========== Add Balance Update Listener ========== //
window.addEventListener('storage', (e) => {
    if (e.key === 'balance') {
        balance = parseInt(e.newValue) || 0;
        updateBalance();
    }
});

// ========== Update UI ==========
function updateBalance() {
    const balanceElement = document.getElementById('balance');
    if (balanceElement) {
        balanceElement.textContent = balance;
    }
}

// ========== Task Completion ==========
function completeTask(reward, taskUrl) {
    if (localStorage.getItem(taskUrl) === 'true') {
        alert('You have already completed this task.');
        return;
    }

    balance += reward;
    localStorage.setItem('balance', balance.toString());
    localStorage.setItem(taskUrl, 'true');
    updateBalance();

    window.open(taskUrl, '_blank');
}

// ========== Initial Render ==========
updateBalance();
