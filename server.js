// server.js
import express from 'express';
import dotenv from 'dotenv';
import telegramRoute from './routes/verifyTelegram.js';
import ytRoute       from './routes/verifyYouTube.js';
import igRoute       from './routes/verifyInstagram.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use('/api', telegramRoute, ytRoute, igRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server listening on ${PORT}`));
 
