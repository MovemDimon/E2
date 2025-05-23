// Base64 encode Unicode-safe

function toBase64Unicode(str) {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  );
}

async function handlePayment(coins, usdPrice, btn) {
  btn.disabled = true;
  const originalText = btn.textContent;
  btn.textContent = '⏳ Processing...';

  try {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('⚠️ User not found. Please log in first.');
      return;
    }

    // 1) ایجاد Deeplink برای پرداخت
    const payload = { coins, usdPrice, userId };
    const encoded = toBase64Unicode(JSON.stringify(payload));
    const deeplink = `https://t.me/Daimonium_bot?start=pay_${encoded}`;
    window.open(deeplink, '_blank');

    // 2) خواندن آدرس و کلید از ENV
    const wsUrl    = process.env.NEXT_PUBLIC_WS_URL;
    const wsApiKey = process.env.NEXT_PUBLIC_WS_API_KEY;
    if (!wsUrl || !wsApiKey) {
      console.error('WebSocket config is missing!');
      alert('❌ Payment service is not configured.');
      return;
    }

    // 3) اتصال WebSocket
    const ws = new WebSocket(
      `${wsUrl}?userId=${encodeURIComponent(userId)}&api_key=${encodeURIComponent(wsApiKey)}`
    );

    // 4) Timeout برای پاسخ
    const WS_TIMEOUT = 30_000;
    const timeoutId = setTimeout(() => {
      ws.close();
      alert('❌ Payment timeout. Please try again.');
    }, WS_TIMEOUT);

    ws.addEventListener('open', () => {
      ws.send(JSON.stringify({
        action: 'confirm_payment',
        data: payload
      }));
    });

    ws.addEventListener('message', ({ data }) => {
      clearTimeout(timeoutId);
      let msg;
      try {
        msg = JSON.parse(data);
      } catch {
        console.error('Invalid WS message:', data);
        return;
      }
      if (msg.event === 'payment_result') {
        const { newBalance, error } = msg.data;
        if (newBalance != null) {
          // به‌روزرسانی موجودی
          const balanceEl = document.getElementById('balance');
          if (balanceEl) balanceEl.textContent = newBalance.toLocaleString();
          localStorage.setItem('balance', newBalance);
          if (typeof syncWithServer === 'function') syncWithServer();
        } else {
          alert('❌ Payment error: ' + (error || 'Unknown'));
        }
      }
      ws.close();
    });

    ws.addEventListener('error', (e) => {
      clearTimeout(timeoutId);
      console.error('WS error:', e);
      alert('❌ WebSocket error. Payment could not be confirmed.');
      ws.close();
    });

    ws.addEventListener('close', () => {
      btn.disabled = false;
      btn.textContent = originalText;
    });

  } catch (err) {
    console.error('Payment flow error:', err);
    alert('❌ Error in payment process.');
    btn.disabled = false;
    btn.textContent = originalText;
  }
}
