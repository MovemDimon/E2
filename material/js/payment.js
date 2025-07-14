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

  function resetBtn() {
    btn.disabled = false;
    btn.textContent = originalText;
  }

  try {
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = 'test-user';
      showNotification('⚠️ [Test mode] No user ID found. Using test-user ID.');
    }

    // ساخت payload برای فرستادن به bot
    const payloadForLink = { coins, usdPrice, userId };
    const encoded = toBase64Unicode(JSON.stringify(payloadForLink));
    const deeplink = `https://t.me/Daimonium_bot?start=pay_${encoded}`;

    // قبل از باز کردن ربات، به worker اطلاع بده که بات آماده ارسال پیام بشه
    try {
      await fetch('https://your-worker-domain.com/telegram-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            chat: { id: userId },
            text: '/start pay_' + encoded
          }
        })
      });
    } catch (botErr) {
      console.warn('Bot init error:', botErr);
    }

    // باز کردن دیپ لینک به چت بات
    window.open(deeplink, '_blank');

    // دریافت تنظیمات WebSocket از سرور
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

    // اتصال WebSocket
    const ws = new WebSocket(`${wsUrl}?userId=${encodeURIComponent(userId)}&api_key=${encodeURIComponent(wsApiKey)}`);
    const timeoutId = setTimeout(() => {
      showNotification('❌ Payment timeout. Please try again.');
      ws.close();
    }, 30000);

    ws.addEventListener('open', () => {
      ws.send(JSON.stringify({ action: 'confirm_payment', data: payloadForLink }));
    });

    ws.addEventListener('message', async ({ data: msgData }) => {
      clearTimeout(timeoutId);
      let msg;
      try {
        msg = JSON.parse(msgData);
      } catch {
        console.error('Invalid message:', msgData);
        ws.close();
        return;
      }

      if (msg.event === 'payment_result') {
        const { newBalance, error } = msg.data;

        if (newBalance != null) {
          // به‌روز رسانی لوکال
          localStorage.setItem('coins', newBalance);
          const coinDisplay = document.getElementById('coinCount');
          if (coinDisplay) coinDisplay.textContent = newBalance.toLocaleString('en-US');
          showNotification('✅ Payment successful!');

          // ارسال به سرور
          const paymentPayload = {
            type: 'payment',
            userId,
            coins: newBalance,
            usdPrice,
            status: 'success',
            errorMsg: '',
            timestamp: new Date().toISOString()
          };

          try {
            await fetch('https://vercel-app-108-6bhs.vercel.app/data', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
              },
              body: JSON.stringify(paymentPayload)
            });
          } catch (syncErr) {
            console.error('Error syncing payment:', syncErr);
          }
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
