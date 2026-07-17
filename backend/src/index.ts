import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import reviewRoutes from './routes/reviews.js';
import userRoutes from './routes/users.js';

dotenv.config();

const app = express();

// Check if we should use demo mode (no OpenAI key)
const DEMO_MODE = !process.env.OPENAI_API_KEY;

// In-memory storage for demo mode
const demoStorage = {
  users: new Map(),
  sessions: new Map(),
  reviews: new Map(),
};

// Make demo storage available
app.locals.demoStorage = demoStorage;
app.locals.demoMode = DEMO_MODE;

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    demoMode: DEMO_MODE,
    hasOpenAI: !!process.env.OPENAI_API_KEY,
    timestamp: new Date().toISOString() 
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
  console.log(`🤖 AI Mode: ${DEMO_MODE ? 'Demo (simulated)' : 'OpenAI GPT-4'}`);
});
