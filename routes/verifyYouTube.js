import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
const router = Router();
const client = new OAuth2Client(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET
);

router.post('/verify-youtube-subscribe', async (req, res) => {
  const { userId: accessToken } = req.body;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  try {
    // اعتبارسنجی توکن
    client.setCredentials({ access_token: accessToken });
    const url = `https://www.googleapis.com/youtube/v3/subscriptions?part=id&forChannelId=${channelId}`;
    const r = await client.request({ url });
    res.json({ ok: r.data.items && r.data.items.length > 0 });
  } catch {
    res.json({ ok: false });
  }
});

export default router;
