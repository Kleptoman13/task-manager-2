import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectPostgres } from './lib/db.postgres.js';
import authRouter from './routes/auth.route.js';
import taskRouter from './routes/task.route.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/tasks', taskRouter);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
  connectPostgres();
});
