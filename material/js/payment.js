// کمک: Base64 encode Unicode-safe
function toBase64Unicode(str) {
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

    // اضافه کردن api_key به کوئری
    const ws = new WebSocket(`${selectedHost}?userId=${encodeURIComponent(userId)}&api_key=<YOUR_WS_API_KEY>`);

    ws.onopen = () => {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(JSON.stringify({
            action: "confirm_payment",
            data: packageData
          }));
        } catch (sendErr) {
          console.error("خطا در ارسال پیام WebSocket:", sendErr);
          alert("⚠️ خطا در ارسال درخواست پرداخت.");
        }
      }
    };

    ws.onmessage = async (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.event === "payment_result") {
          const data = msg.data;
          if (data?.status === 'success' && data.newBalance !== undefined) {
            // ۱) بروزرسانی UI و localStorage
            const balanceEl = document.getElementById('balance');
            if (balanceEl) {
              balanceEl.innerText = data.newBalance;
              localStorage.setItem('balance', data.newBalance);
              if (typeof syncWithServer === 'function') syncWithServer(); // اختیاری
            }

            // ۲) رکورد پرداخت
            const paymentRecord = {
              userId,
              type: 'payment',
              coins,
              usdPrice,
              status: 'success',
              errorMsg: '',
              timestamp: new Date().toISOString(),
              newBalance: data.newBalance
            };

            // ۳) همگام‌سازی فوری با دیتابیس
            try {
              await fetch('/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentRecord)
              });
            } catch (syncErr) {
              console.error('Payment sync error:', syncErr);
            }

          } else if (data?.status === 'error') {
            alert("❌ خطا در پرداخت: " + (data.message || "نامشخص"));
          } else {
            console.warn("⚠️ پاسخ پرداخت فاقد newBalance است:", data);
          }
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
