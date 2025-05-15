// کمک: Base64 encode Unicode-safe
function toBase64Unicode(str) {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  );
}

async function handlePayment(coins, usdPrice) {
  try {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert("⚠️ کاربر یافت نشد! لطفاً ابتدا وارد شوید.");
      return;
    }

    const packageData = { coins, usdPrice, userId };
    const payload = JSON.stringify(packageData);
    const encoded = toBase64Unicode(payload);
    const deeplink = `https://t.me/Daimonium_bot?start=pay_${encoded}`;
    window.open(deeplink, '_blank');

    const websocketHosts = [
      'wss://ws-frankfurt.fly.dev/ws',
      'wss://ws-milan.fly.dev/ws',
      'wss://ws-amsterdam.fly.dev/ws'
    ];
    const selectedHost = websocketHosts[
      Math.floor(Math.random() * websocketHosts.length)
    ];
    const ws = new WebSocket(`${selectedHost}?userId=${encodeURIComponent(userId)}&api_key=${encodeURIComponent('<YOUR_WS_API_KEY>')}`);

    ws.addEventListener('open', () => {
      ws.send(JSON.stringify({
        action: "confirm_payment",
        data: packageData
      }));
    });

    ws.addEventListener('message', ({ data }) => {
      try {
        const msg = JSON.parse(data);
        if (msg.event === "payment_result") {
          const { newBalance, error } = msg.data;
          if (newBalance != null) {
            const balanceEl = document.getElementById('balance');
            balanceEl && (balanceEl.innerText = newBalance);
            localStorage.setItem('balance', newBalance);
            typeof syncWithServer === 'function' && syncWithServer();
          } else {
            alert("❌ خطا در پرداخت: " + (error || "نامشخص"));
          }
        }
      } catch (e) {
        console.error("خطا در پردازش پیام WebSocket:", e);
      }
    });

    ws.addEventListener('error', (e) => {
      console.error("WebSocket Error:", e);
      alert("❌ خطا در اتصال به سرور پرداخت.");
    });

    ws.addEventListener('close', ({ code, reason }) => {
      console.log(`ارتباط WebSocket بسته شد. کد: ${code}, دلیل: ${reason}`);
    });
  } catch (err) {
    console.error("خطا در فرآیند پرداخت:", err);
    alert("❌ خطا در شروع فرآیند پرداخت.");
  }
}
