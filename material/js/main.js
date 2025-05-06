document.addEventListener('DOMContentLoaded', function() {
  var image = document.getElementById('coin');
  var label = document.querySelector('h1');
  var totalEl = document.getElementById('total');
  var powerEl = document.getElementById('power');
  var progress = document.querySelector('.progress');

  var state = { coins: 0, total: 500, power: 500, count: 1 };

  function loadState() {
    const saved = JSON.parse(localStorage.getItem('clicker') || '{}');
    state = Object.assign(state, saved);
    updateUI();
  }

  function saveState() {
    localStorage.setItem('clicker', JSON.stringify(state));
  }

  function updateUI() {
    label.textContent = state.coins.toLocaleString();
    totalEl.textContent = '/' + state.total;
    powerEl.textContent = state.power;
    progress.style.width = (100 * state.power / state.total) + '%';
  }

  image.addEventListener('click', function(e) {
    if (state.power > 0) {
      state.coins += state.count;
      state.power -= 1;

      // برای sync بعدی ذخیره کن
      const syncQueue = JSON.parse(localStorage.getItem('syncQueue') || '[]');
      syncQueue.push({ type: 'click', count: state.count, timestamp: Date.now() });
      localStorage.setItem('syncQueue', JSON.stringify(syncQueue));

      saveState();
      updateUI();
      animateCoin(e.offsetX, e.offsetY, image);
    }
  });

  setInterval(function() {
    if (state.power < state.total) {
      state.power += 1;
      saveState();
      updateUI();
    }
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
