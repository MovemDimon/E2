const openModalBtn = document.getElementById('openModalBtn');
const walletModal   = document.getElementById('walletModal');
const closeBtn      = walletModal.querySelector('.close-btn');
const connectBtn    = document.getElementById('connectWallet');
const cancelBtn     = document.getElementById('cancelWallet');
const statusMsg     = document.getElementById('statusMessage');

function closeModal() {
  walletModal.style.display = 'none';
  statusMsg.textContent = '';
}
openModalBtn.addEventListener('click', () => walletModal.style.display = 'flex');
closeBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);
window.addEventListener('click', e => {
  if (e.target === walletModal) closeModal();
});
connectBtn.addEventListener('click', () => {
  statusMsg.textContent = 'Connecting to your TON wallet...';
  setTimeout(() => {
    statusMsg.textContent = 'Connection failed. Please try again.';
  }, 2000);
});
