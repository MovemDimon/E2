import { Router } from 'express';
import fetch from 'node-fetch';
const router = Router();

router.post('/verify-instagram-follow', async (req, res) => {
  const { userId: accessToken } = req.body;
  const userId            = process.env.INSTAGRAM_USER_ID;
  try {
    const resp = await fetch(
      `https://graph.instagram.com/me/follows?access_token=${accessToken}`
    );
    const data = await resp.json();
    const ok = data.data.some(f => f.id === userId);
    res.json({ ok });
  } catch {
    res.json({ ok: false });
  }
});

export default router;
