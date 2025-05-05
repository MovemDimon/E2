import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './lib/db.js';
import userRoutes from './api/user.js';
import taskRoutes from './api/task.js';
import inviteRoutes from './api/invite.js';
import clickerRoutes from './api/clicker.js';

dotenv.config();
await connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/user', userRoutes);
app.use('/task', taskRoutes);
app.use('/invite', inviteRoutes);
app.use('/clicker', clickerRoutes);

export default app;
