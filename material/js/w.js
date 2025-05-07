const openModalBtn = document.getElementById('openModalBtn');
const walletModal = document.getElementById('walletModal');
const closeBtn = document.querySelector('.close-btn');
const connectWalletBtn = document.getElementById('connectWallet');
const cancelWalletBtn = document.getElementById('cancelWallet');
const statusMessage = document.getElementById('statusMessage');

function closeModal() {
    walletModal.style.display = 'none';
    statusMessage.textContent = '';
}

openModalBtn.addEventListener('click', () => {
    walletModal.style.display = 'flex';
});

closeBtn.addEventListener('click', closeModal);

window.addEventListener('click', (event) => {
    if (event.target === walletModal) {
        closeModal();
    }
});

connectWalletBtn.addEventListener('click', () => {
    statusMessage.textContent = 'Connecting to your TON wallet...';
    setTimeout(() => {
        statusMessage.textContent = 'Connection failed. Please try again.';
    }, 2000);
});

cancelWalletBtn.addEventListener('click', closeModal);
