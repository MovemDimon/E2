import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import dataRoutes from './api/data.js';
import wsParams from './api/ws-params.js';
import verifyTelegram from './api/verify-telegram-subscribe.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// اتصال به MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser:    true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// مسیرهای API
app.use('/data', dataRoutes);
app.use('/api/ws-params', wsParams);
app.use('/api/verify-telegram-subscribe', verifyTelegram);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
