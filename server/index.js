import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
connectDB();

const app = express();

// This allows your live frontend to make requests to your live backend
app.use(cors());

app.use(express.json());

// Main API Routes
app.use('/api/users', userRoutes);

// Export the 'app' object for Vercel's serverless environment
export default app;