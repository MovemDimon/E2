import express from 'express';
import Clicker from '../models/Clicker.js';

const router = express.Router();

router.get('/state', async (req, res) => {
  const userId = req.query.userId || 'guest';
  let user = await Clicker.findOne({ userId });
  if (!user) user = await Clicker.create({ userId });
  res.json(user);
});

router.post('/click', async (req, res) => {
  const userId = req.query.userId || 'guest';
  const user = await Clicker.findOneAndUpdate(
    { userId },
    { $inc: { coins: 1, power: -1 } },
    { new: true, upsert: true }
  );
  res.json(user);
});

router.post('/regenerate', async (req, res) => {
  const userId = req.query.userId || 'guest';
  const user = await Clicker.findOneAndUpdate(
    { userId },
    { $inc: { power: 1 } },
    { new: true }
  );
  res.json(user);
});

export default router;
