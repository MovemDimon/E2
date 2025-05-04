// w.js (wallet modal)
document.getElementById('openModalBtn').addEventListener('click', function() {
  document.getElementById('walletModal').style.display = 'flex';
});

document.querySelector('.close-btn').addEventListener('click', function() {
  document.getElementById('walletModal').style.display = 'none';
});

window.addEventListener('click', function(event) {
  if (event.target === document.getElementById('walletModal')) {
    document.getElementById('walletModal').style.display = 'none';
  }
});

document.getElementById('connectWallet').addEventListener('click', function() {
  var statusMessage = document.getElementById('statusMessage');
  statusMessage.textContent = 'Connecting to your TON wallet...';
  setTimeout(function() {
    statusMessage.textContent = 'oops try again something went wrong!';
  }, 2000);
});

document.getElementById('cancelWallet').addEventListener('click', function() {
  document.getElementById('walletModal').style.display = 'none';
  document.getElementById('statusMessage').textContent = '';
});
