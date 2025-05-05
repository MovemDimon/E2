import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const userId = req.query.userId || 'guest';
  const user = await User.findOneAndUpdate(
    { userId },
    { $inc: { invitedFriends: 1, balance: 5 } },
    { new: true, upsert: true }
  );
  res.json({ invitedFriends: user.invitedFriends });
});

export default router;
