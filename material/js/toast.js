(function () {
  let notifTimer;

  window.showNotification = function (message, type = 'success') {
    let box = document.querySelector('.notif-box');

    if (!box) {
      box = document.createElement('div');
      box.className = 'notif-box';
      document.body.appendChild(box);
    }

    box.textContent = message;
    box.className = `notif-box ${type} show`;

    clearTimeout(notifTimer);
    notifTimer = setTimeout(() => {
      box.classList.remove('show');
      box.classList.add('hide');
      setTimeout(() => {
        box.remove(); // حذف کامل
      }, 500);
    }, 3000);
  };
})();
