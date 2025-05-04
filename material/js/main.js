// main.js (coin clicker)
console.log("CONFIG:", CONFIG);
alert("JS Loaded!");

import { CONFIG } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  const image = document.querySelector('#coin');
  const label = document.querySelector('h1');
  const totalEl = document.querySelector('#total');
  const powerEl = document.querySelector('#power');
  const progress = document.querySelector('.progress');

  let state = { coins: 0, total: 500, power: 500, count: 1 };

  async function loadState() {
    const res = await fetch(`${CONFIG.API_BASE_URL}/clicker/state`);
    state = await res.json();
    updateUI();
  }

  function updateUI() {
    label.textContent = state.coins.toLocaleString();
    totalEl.textContent = `/${state.total}`;
    powerEl.textContent = state.power;
    progress.style.width = `${(100 * state.power) / state.total}%`;
  }

  image.addEventListener('click', async (e) => {
    await fetch(`${CONFIG.API_BASE_URL}/clicker/click`, { method: 'POST' });
    await loadState();
    animateCoin(e.offsetX, e.offsetY, image);
  });

  setInterval(async () => {
    await fetch(`${CONFIG.API_BASE_URL}/clicker/regenerate`, { method: 'POST' });
    await loadState();
  }, 1000);

  function animateCoin(x, y, img) {
    navigator.vibrate(5);
    let transform;
    if (x < 150 && y < 150) transform = 'translate(-0.25rem,-0.25rem) skewY(-10deg) skewX(5deg)';
    else if (x < 150) transform = 'translate(-0.25rem,0.25rem) skewY(-10deg) skewX(5deg)';
    else if (y > 150) transform = 'translate(0.25rem,0.25rem) skewY(10deg) skewX(-5deg)';
    else transform = 'translate(0.25rem,-0.25rem) skewY(10deg) skewX(-5deg)';
    img.style.transform = transform;
    setTimeout(() => img.style.transform = '', 100);
  }

  loadState();
});
