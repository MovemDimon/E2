// کمک: Base64 encode Unicode-safe
function toBase64Unicode(str) {
  // first we use encodeURIComponent to get percent-encoded UTF-8,
  // then we convert the percent encodings into raw bytes which
  // btoa can handle
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
    (match, p1) => String.fromCharCode('0x' + p1)
  ));
}

async function handlePayment(coins, usdPrice) {
  try {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert("⚠️ کاربر یافت نشد! لطفاً ابتدا وارد شوید.");
      return;
    }

    const packageData = { coins, usdPrice, userId };

    // باز کردن ربات تلگرام با لینک پرداخت
    const payload = JSON.stringify(packageData);
    const encoded = toBase64Unicode(payload);
    const deeplink = `https://t.me/Daimonium_bot?start=pay_${encoded}`;
    window.open(deeplink, '_blank');

    // لیست WebSocket هاست‌ها
    const websocketHosts = [
      'wss://ws-frankfurt.fly.dev/ws',
      'wss://ws-milan.fly.dev/ws',
      'wss://ws-amsterdam.fly.dev/ws'
    ];
    const selectedHost = websocketHosts[
      Math.floor(Math.random() * websocketHosts.length)
    ];

    const ws = new WebSocket(`${selectedHost}?userId=${encodeURIComponent(userId)}`);

    ws.onopen = () => {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(JSON.stringify({
            type: "payment_request",
            data: packageData
          }));
        } catch (sendErr) {
          console.error("خطا در ارسال پیام WebSocket:", sendErr);
          alert("⚠️ خطا در ارسال درخواست پرداخت.");
        }
      }
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.event === "payment_response") {
          const data = msg.data;
          // در صورت موجود بودن newBalance
          if (data?.newBalance !== undefined) {
            const balanceEl = document.getElementById('balance');
            if (balanceEl) {
              balanceEl.innerText = data.newBalance;
              localStorage.setItem('balance', data.newBalance);
              if (typeof syncWithServer === 'function') {
                syncWithServer();
              }
            }
          } else {
            console.warn("⚠️ پاسخ پرداخت فاقد newBalance است:", data);
          }
        } else if (msg.event === "payment_error") {
          alert("❌ خطا در پرداخت: " + (msg.data?.error || "نامشخص"));
        }
      } catch (parseErr) {
        console.error("خطا در پردازش پیام WebSocket:", parseErr);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket Error:", err);
      alert("❌ خطا در اتصال به سرور پرداخت.");
    };

    ws.onclose = (event) => {
      console.log("ارتباط WebSocket بسته شد. کد:", event.code, "دلیل:", event.reason);
    };

  } catch (err) {
    console.error("خطا در فرآیند پرداخت:", err);
    alert("❌ خطا در شروع فرآیند پرداخت.");
  }
}
