import express from 'express';
import Payment from '../models/Payment.js';
import User    from '../models/User.js';

const router = express.Router();

// POST /data
// دریافت هم سند پرداخت و هم سند آپدیت کاربر عادی
router.post('/', async (req, res) => {
  try {
    const data = req.body;

    // اگر سند از نوع پرداخت است
    if (data.type === 'payment') {
      // ۱. ذخیره در کالکشن payments
      const payment = new Payment({
        userId:     data.userId,
        type:       'payment',
        coins:      data.coins,
        usdPrice:   data.usdPrice,
        status:     data.status,
        errorMsg:   data.errorMsg || '',
        timestamp:  data.timestamp ? new Date(data.timestamp) : new Date(),
        newBalance: data.newBalance
      });
      await payment.save();

      // ۲. به‌روزرسانی موجودی کاربر
      await User.findOneAndUpdate(
        { userId: data.userId },
        { balance: data.newBalance },
        { upsert: true }
      );

      return res.json({ success: true, type: 'payment', paymentId: payment._id });
    }

    // اگر سند از نوع وضعیت کاربر عادی است
    else {
      const { userId, balance, invitedFriends } = data;
      if (typeof balance !== 'number' || typeof invitedFriends !== 'number') {
        return res.status(400).json({ error: 'balance and invitedFriends must be numbers' });
      }

      const user = await User.findOneAndUpdate(
        { userId },
        { balance, invitedFriends },
        { upsert: true, new: true }
      );

      return res.json({ success: true, type: 'user', user });
    }

  } catch (err) {
    console.error('Error in /data:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
