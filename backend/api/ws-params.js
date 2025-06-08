export default function handler(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }

  const WS_URL = 'wss://cloudflarewebworker.movem9013.workers.dev/ws';
  const API_KEY = process.env.API_KEY;

  const fullUrl = `${WS_URL}?userId=${encodeURIComponent(userId)}&api_key=${encodeURIComponent(API_KEY)}`;

  res.status(200).json({ wsUrl: fullUrl });
}
