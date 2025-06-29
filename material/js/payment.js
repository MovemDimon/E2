// payment.js (Vercel)

// تبدیل امن یونیکد به Base64
function toBase64Unicode(str) {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  );
}

async function handlePayment(coins, usdPrice, btn) {
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = '⏳ Processing...';

  // تابع کمکی برای بازگرداندن دکمه به حالت اولیه
  function resetBtn() {
    btn.disabled = false;
    btn.textContent = originalText;
  }

  try {
    // گرفتن userId یا مقدار تستی در حالت محلی
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = 'test-user';
      showNotification('⚠️ [Test mode] No user ID found. Using test-user ID.');
    }

    // ساخت deeplink پرداخت
    const payload = { coins, usdPrice, userId };
    const encoded = toBase64Unicode(JSON.stringify(payload));
    const deeplink = `https://t.me/Daimonium_bot?start=pay_${encoded}`;
    window.open(deeplink, '_blank');

    // فراخوانی API برای دریافت تنظیمات وب‌سوکت
    let data;
    try {
      const res = await fetch(`/api/ws-params?userId=${encodeURIComponent(userId)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      data = await res.json();
    } catch (fetchError) {
      showNotification('❌ Could not connect to payment server.');
      resetBtn();
      return;
    }

    const { wsUrl, wsApiKey } = data;
    if (!wsUrl || !wsApiKey) {
      showNotification('❌ Missing WebSocket configuration.');
      resetBtn();
      return;
    }

    // اتصال به WebSocket
    const ws = new WebSocket(`${wsUrl}?userId=${encodeURIComponent(userId)}&api_key=${encodeURIComponent(wsApiKey)}`);

    const timeoutId = setTimeout(() => {
      showNotification('❌ Payment timeout. Please try again.');
      ws.close();
    }, 30000);

    ws.addEventListener('open', () => {
      ws.send(JSON.stringify({ action: 'confirm_payment', data: payload }));
    });

    ws.addEventListener('message', ({ data }) => {
      clearTimeout(timeoutId);
      let msg;
      try {
        msg = JSON.parse(data);
      } catch {
        console.error('Invalid message:', data);
        return;
      }

      if (msg.event === 'payment_result') {
        const { newBalance, error } = msg.data;
        if (newBalance != null) {
          localStorage.setItem('coins', newBalance);
          const coinDisplay = document.getElementById('coinCount');
          if (coinDisplay) coinDisplay.textContent = newBalance.toLocaleString('en-US');
          if (typeof syncWithServer === 'function') syncWithServer();
          showNotification('✅ Payment successful!');
        } else {
          showNotification('❌ Payment failed: ' + (error || 'Unknown error.'));
        }
      }

      ws.close();
    });

    ws.addEventListener('error', (e) => {
      clearTimeout(timeoutId);
      console.error('WebSocket error:', e);
      showNotification('❌ WebSocket connection error.');
      ws.close();
    });

    ws.addEventListener('close', () => {
      resetBtn();
    });

  } catch (err) {
    console.error('Unexpected error:', err);
    showNotification('❌ Unexpected error during payment process.');
    resetBtn();
  }
}
