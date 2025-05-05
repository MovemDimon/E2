// payment.js

async function handlePayment(coins, usdPrice) {
  try {
    // دریافت userId از سرور
    const res = await fetch(window.CONFIG.API_BASE_URL + '/user/id');
    const data = await res.json();
    const userId = data.userId;

    // ساخت داده‌های پرداخت
    const packageData = { coins, usdPrice, userId };
    const deeplink = `https://t.me/Daimonium_bot?start=pay_${btoa(JSON.stringify(packageData))}`;
    window.open(deeplink, '_blank');

    // انتخاب تصادفی WebSocket سرور
    const hosts = window.CONFIG.WS_HOSTS;
    const host = hosts[Math.floor(Math.random() * hosts.length)];
    const ws = new WebSocket(`${host}?userId=${encodeURIComponent(userId)}`);

    ws.onopen = () => {
      // ارسال درخواست پرداخت به سرور WebSocket
      ws.send(JSON.stringify({ type: 'payment_request', data: packageData }));
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.event === 'payment_response') {
          // به‌روزرسانی موجودی کاربر
          document.getElementById('balance').innerText = msg.data.newBalance;
        } else if (msg.event === 'payment_error') {
          alert('خطا در پرداخت: ' + (msg.data?.error || 'نامشخص'));
        }
      } catch (parseErr) {
        console.error('خطا در پردازش پیام WebSocket:', parseErr);
      }
    };

    ws.onerror = (e) => {
      console.error('WebSocket Error:', e);
      alert('خطا در ارتباط WebSocket');
    };

    ws.onclose = () => {
      console.warn('ارتباط WebSocket بسته شد.');
    };

  } catch (err) {
    console.error('خطا در فرآیند پرداخت:', err);
    alert('خطا در شروع فرآیند پرداخت');
  }
}
