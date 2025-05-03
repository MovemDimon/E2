// payment.js
import { CONFIG } from './config.js';

export async function handlePayment(coins, usdPrice) {
  try {
    // Fetch userId from server
    const res = await fetch(`${CONFIG.API_BASE_URL}/user/id`);
    if (!res.ok) throw new Error('Failed to get userId');
    const { userId } = await res.json();

    const packageData = { coins, usdPrice, userId };
    const deeplink = `https://t.me/Daimonium_bot?start=pay_${btoa(JSON.stringify(packageData))}`;
    window.open(deeplink, '_blank');

    // Connect to WebSocket
    const host = CONFIG.WS_HOSTS[Math.floor(Math.random() * CONFIG.WS_HOSTS.length)];
    const ws = new WebSocket(`${host}/ws?userId=${userId}`);

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'payment_request', data: packageData }));
    };

    ws.onmessage = ({ data }) => {
      try {
        const msg = JSON.parse(data);
        if (msg.event === 'payment_response') {
          document.getElementById('balance').innerText = msg.data.newBalance;
        } else if (msg.event === 'payment_error') {
          alert('خطا در پرداخت: ' + msg.data.error);
        }
      } catch (e) {
        console.error('Invalid message received from WebSocket:', data);
      }
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
      alert('خطا در ارتباط WebSocket');
    };

    ws.onclose = () => {
      console.warn('WebSocket connection closed');
    };
  } catch (err) {
    console.error('Payment Error:', err);
    alert('مشکلی در فرآیند پرداخت رخ داد.');
  }
}
