import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import carbonRoutes from './routes/carbon.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Wire Up Ecosystem Router Architecture
app.use('/api/auth', authRoutes);
app.use('/api/carbon', carbonRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`CarbonCompass operational engine routing on port: ${PORT}`));