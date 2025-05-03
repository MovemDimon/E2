// w.js (wallet modal)
export function setupWalletModal() {
  const openModalBtn = document.getElementById('openModalBtn');
  const walletModal = document.getElementById('walletModal');
  const closeBtn = document.querySelector('.close-btn');
  const connectWalletBtn = document.getElementById('connectWallet');
  const cancelWalletBtn = document.getElementById('cancelWallet');
  const statusMessage = document.getElementById('statusMessage');

  openModalBtn.addEventListener('click', () => walletModal.style.display = 'flex');
  closeBtn.addEventListener('click', () => walletModal.style.display = 'none');
  window.addEventListener('click', e => {
    if (e.target === walletModal) walletModal.style.display = 'none';
  });
  connectWalletBtn.addEventListener('click', () => {
    statusMessage.textContent = 'Connecting to your TON wallet...';
    setTimeout(() => {
      statusMessage.textContent = 'oops try again something went wrong!';
    }, 2000);
  });
  cancelWalletBtn.addEventListener('click', () => {
    walletModal.style.display = 'none';
    statusMessage.textContent = '';
  });
}
