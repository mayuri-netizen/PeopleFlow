import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';

// Load environment variables
dotenv.config();

// Initialize the Express app
const app = express();

// Connect to MongoDB
connectDB();

// Define the port
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? true : 'http://localhost:5173',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Root route for health check
app.get('/', (req, res) => {
    res.json({
        message: 'PeopleFlow API is running!',
        timestamp: new Date().toISOString()
    });
});

// API health check
app.get('/api', (req, res) => {
    res.json({
        message: 'PeopleFlow API endpoints are working!',
        available_routes: ['/api/users']
    });
});

// API Routes - Make sure this is EXACTLY '/api/users'
app.use('/api/users', userRoutes);

// Catch all API routes that don't exist
app.use('/api/*', (req, res) => {
    res.status(404).json({
        error: 'API route not found',
        path: req.originalUrl,
        method: req.method
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// For local development only
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

// Export for Vercel
export default app;
