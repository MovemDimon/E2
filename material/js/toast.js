function showNotification(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return alert(message);

  toast.textContent = message;
  toast.className = `toast ${type} show`;

  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('hide');
    setTimeout(() => {
      toast.className = 'toast'; // Reset
    }, 500);
  }, 3000);
}
