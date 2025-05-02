function handlePayment(coins, usdPrice) {
    const packageData = {
        coins: coins,
        usdPrice: usdPrice,
        userId: localStorage.getItem('userId')
    };

    // Deeplink برای ربات تلگرام
    const deeplink = `http://t.me/Daimonium_bot?start=pay_${btoa(JSON.stringify(packageData))}`;
    window.open(deeplink, '_blank');

    // لیست WebSocket هاست‌های مختلف
    const websocketHosts = [
        'wss://ws-frankfurt.fly.dev/ws',
        'wss://ws-milan.fly.dev/ws',
        'wss://ws-amsterdam.fly.dev/ws'
    ];

    // انتخاب تصادفی یکی از هاست‌ها
    const randomIndex = Math.floor(Math.random() * websocketHosts.length);
    const selectedHost = websocketHosts[randomIndex];

    // اتصال به WebSocket انتخاب‌شده
    const ws = new WebSocket(selectedHost);

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.userId === packageData.userId) {
            document.getElementById('balance').innerText = data.newBalance;
        }
    };
}
