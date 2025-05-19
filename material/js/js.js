
let balance = parseInt(localStorage.getItem('balance')) || 0;
window.addEventListener('storage', ({ key, newValue }) => {
  if (key === 'balance') {
    balance = parseInt(newValue) || 0;
    updateBalance();
  }
});

function updateBalance() {
  const el = document.getElementById('balance');
  el && (el.textContent = balance);
}
function completeTaskUrl(taskUrl, reward) {
  if (localStorage.getItem(taskUrl) === 'true') {
    alert('⚠️ این تسک قبلاً ثبت شده.');
    return;
  }
  balance += reward;
  localStorage.setItem('balance', balance);
  localStorage.setItem(taskUrl, 'true');
  updateBalance();
  window.open(taskUrl, '_blank');

}

updateBalance();
