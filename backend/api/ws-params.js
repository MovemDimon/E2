export default function handler(req, res) {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }

  const WS_BASE_URL = 'wss://cloudflarewebworker.movem9013.workers.dev/ws';
  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: 'Server missing API_KEY' });
  }

  // دو مقدار جداگانه برمی‌گردانیم
  res.status(200).json({
    wsUrl: WS_BASE_URL,
    wsApiKey: API_KEY
  });
}
