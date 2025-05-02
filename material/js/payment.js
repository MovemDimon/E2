function handlePayment(coins, usdPrice) {
    const userId = localStorage.getItem('userId');
    const packageData = {
        coins: coins,
        usdPrice: usdPrice,
        userId: userId
    };

    // باز کردن ربات تلگرام با پارامتر پرداخت
    const deeplink = `https://t.me/Daimonium_bot?start=pay_${btoa(JSON.stringify(packageData))}`;
    window.open(deeplink, '_blank');

    // لیست WebSocket هاست‌های مختلف
    const websocketHosts = [
        'wss://ws-frankfurt.fly.dev/ws',
        'wss://ws-milan.fly.dev/ws',
        'wss://ws-amsterdam.fly.dev/ws'
    ];

    // انتخاب تصادفی یکی از هاست‌ها
    const selectedHost = websocketHosts[Math.floor(Math.random() * websocketHosts.length)];

    // اتصال به WebSocket با پارامتر userId
    const ws = new WebSocket(`${selectedHost}?userId=${userId}`);

    ws.onopen = () => {
        console.log("WebSocket connected");

        // ارسال درخواست پرداخت به WebSocket
        ws.send(JSON.stringify({
            type: "payment_request",
            data: packageData
        }));
    };

    ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);

        if (msg.event === "payment_response") {
            const data = msg.data;
            if (data && data.newBalance !== undefined) {
                document.getElementById('balance').innerText = data.newBalance;
            }
        } else if (msg.event === "payment_error") {
            alert("خطا در پرداخت: " + msg.data.error);
        }
    };

    ws.onerror = (err) => {
        console.error("WebSocket Error:", err);
        alert("اتصال WebSocket با مشکل مواجه شد.");
    };

    ws.onclose = () => {
        console.log("WebSocket disconnected");
    };
}
