import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { seedDatabase } from './seed.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import sectionRoutes from './routes/sectionRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';

// Load env variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    brand: 'Saudagar Properties',
    timestamp: new Date().toISOString()
  });
});

// Connect to DB Middleware for Serverless
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/inquiries', inquiryRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[API Error]', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

// Initialize DB and Seed once globally
connectDB().then(async (conn) => {
  if (conn) {
    await seedDatabase();
  }
});

// Only start the server if not running in Vercel's serverless environment
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(` Saudagar Properties Backend Server Running   `);
    console.log(` Port: http://localhost:${PORT}               `);
    console.log(` Environment: ${process.env.NODE_ENV || 'development'} `);
    console.log(`===============================================`);
  });
}

// Export for serverless (Vercel)
export default app;
