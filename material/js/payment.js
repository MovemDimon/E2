// payment.js
import { CONFIG } from './config.js';

export async function handlePayment(coins, usdPrice) {
  // Fetch userId from server
  const res = await fetch(`${CONFIG.API_BASE_URL}/user/id`);
  const { userId } = await res.json();

  const packageData = { coins, usdPrice, userId };
  const deeplink = `https://t.me/Daimonium_bot?start=pay_${btoa(JSON.stringify(packageData))}`;
  window.open(deeplink, '_blank');

  // Connect to WebSocket
  const host = CONFIG.WS_HOSTS[Math.floor(Math.random() * CONFIG.WS_HOSTS.length)];
  const ws = new WebSocket(`${host}?userId=${userId}`);
  ws.onopen = () => ws.send(JSON.stringify({ type: 'payment_request', data: packageData }));
  ws.onmessage = ({ data }) => {
    const msg = JSON.parse(data);
    if (msg.event === 'payment_response') {
      document.getElementById('balance').innerText = msg.data.newBalance;
    } else if (msg.event === 'payment_error') {
      alert('خطا در پرداخت: ' + msg.data.error);
    }
  };
  ws.onerror = () => alert('WebSocket Error');
}
