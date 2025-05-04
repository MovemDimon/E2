// payment.js
async function handlePayment(coins, usdPrice) {
  try {
    var res = await fetch(window.CONFIG.API_BASE_URL + '/user/id');
    var data = await res.json();
    var userId = data.userId;
    var packageData = { coins: coins, usdPrice: usdPrice, userId: userId };
    var deeplink = 'https://t.me/Daimonium_bot?start=pay_' + btoa(JSON.stringify(packageData));
    window.open(deeplink, '_blank');

    var hosts = window.CONFIG.WS_HOSTS;
    var host = hosts[Math.floor(Math.random() * hosts.length)];
    var ws = new WebSocket(host + '?userId=' + userId);

    ws.onopen = function() {
      ws.send(JSON.stringify({ type: 'payment_request', data: packageData }));
    };
    ws.onmessage = function(evt) {
      var msg = JSON.parse(evt.data);
      if (msg.event === 'payment_response') {
        document.getElementById('balance').innerText = msg.data.newBalance;
      } else if (msg.event === 'payment_error') {
        alert('خطا در پرداخت: ' + msg.data.error);
      }
    };
    ws.onerror = function() { alert('WebSocket Error'); };
  } catch (err) {
    console.error(err);
  }
}
