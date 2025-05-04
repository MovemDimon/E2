// main.js (coin clicker)
document.addEventListener('DOMContentLoaded', function() {
  var image = document.getElementById('coin');
  var label = document.querySelector('h1');
  var totalEl = document.getElementById('total');
  var powerEl = document.getElementById('power');
  var progress = document.querySelector('.progress');

  var state = { coins: 0, total: 500, power: 500, count: 1 };

  async function loadState() {
    try {
      var res = await fetch(window.CONFIG.API_BASE_URL + '/clicker/state');
      state = await res.json();
      updateUI();
    } catch (e) {
      console.error(e);
    }
  }

  function updateUI() {
    label.textContent = state.coins.toLocaleString();
    totalEl.textContent = '/' + state.total;
    powerEl.textContent = state.power;
    progress.style.width = (100 * state.power / state.total) + '%';
  }

  image.addEventListener('click', async function(e) {
    try {
      await fetch(window.CONFIG.API_BASE_URL + '/clicker/click', { method: 'POST' });
      await loadState();
      animateCoin(e.offsetX, e.offsetY, image);
    } catch (err) {
      console.error(err);
    }
  });

  setInterval(async function() {
    try {
      await fetch(window.CONFIG.API_BASE_URL + '/clicker/regenerate', { method: 'POST' });
      await loadState();
    } catch (e) { console.error(e); }
  }, 1000);

  function animateCoin(x, y, img) {
    navigator.vibrate(5);
    var transform;
    if (x < 150 && y < 150) transform = 'translate(-0.25rem,-0.25rem) skewY(-10deg) skewX(5deg)';
    else if (x < 150) transform = 'translate(-0.25rem,0.25rem) skewY(-10deg) skewX(5deg)';
    else if (y > 150) transform = 'translate(0.25rem,0.25rem) skewY(10deg) skewX(-5deg)';
    else transform = 'translate(0.25rem,-0.25rem) skewY(10deg) skewX(-5deg)';
    img.style.transform = transform;
    setTimeout(function() { img.style.transform = ''; }, 100);
  }

  loadState();
});
