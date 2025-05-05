import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.get('/state', async (req, res) => {
  const userId = req.query.userId || 'guest';
  let user = await User.findOne({ userId });
  if (!user) user = await User.create({ userId });
  res.json({ balance: user.balance, invitedFriends: user.invitedFriends });
});

router.get('/balance', async (req, res) => {
  const userId = req.query.userId || 'guest';
  let user = await User.findOne({ userId });
  if (!user) user = await User.create({ userId });
  res.json({ balance: user.balance });
});

router.get('/id', (req, res) => {
  const userId = req.query.userId || 'guest';
  res.json({ userId });
});

export default router;
