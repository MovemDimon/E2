import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.post('/complete', async (req, res) => {
  const { taskName, userId = 'guest' } = req.body;
  const reward = 10;
  let user = await User.findOneAndUpdate(
    { userId },
    { $inc: { balance: reward } },
    { new: true, upsert: true }
  );
  res.json({ newBalance: user.balance, invitedFriends: user.invitedFriends });
});

router.post('/complete-url', async (req, res) => {
  const { taskUrl, userId = 'guest' } = req.body;
  const reward = 5;
  let user = await User.findOneAndUpdate(
    { userId },
    { $inc: { balance: reward } },
    { new: true, upsert: true }
  );
  res.json({ newBalance: user.balance });
});

export default router;
