import { Router } from 'express';
import fetch from 'node-fetch';
const router = Router();

router.post('/verify-telegram-subscribe', async (req, res) => {
  const { userId } = req.body;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const channel  = process.env.TELEGRAM_CHANNEL;
  try {
    const resp = await fetch(
      `https://api.telegram.org/bot${botToken}/getChatMember?chat_id=${channel}&user_id=${userId}`
    );
    const data = await resp.json();
    const ok = data.ok && ['member','creator','administrator'].includes(data.result.status);
    res.json({ ok });
  } catch {
    res.json({ ok: false });
  }
});

export default router;
