import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js'; // <-- IMPORT a

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize the Express app
const app = express();

// Define the port
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/users', userRoutes); // <-- USE THE ROUTES

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});