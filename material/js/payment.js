function handlePayment(coins, usdPrice) {
    const packageData = {
        coins: coins,
        usdPrice: usdPrice,
        userId: localStorage.getItem('userId')
    };

    // ایجاد Deeplink به ربات تلگرام
    const deeplink = `http://t.me/Daimonium_bot?start=pay_${btoa(JSON.stringify(packageData))}`;
    window.open(deeplink, '_blank');

    // اتصال به WebSocket برای دریافت آپدیت‌ها
    const ws = new WebSocket('wss://your-domain.com/ws');
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.userId === packageData.userId) {
            document.getElementById('balance').innerText = data.newBalance;
        }
    };
}
