import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

console.log('🚀 Starting server...');

// Add global error handlers
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Debug middleware
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('✅ Health check request received');
  res.json({ message: 'Document comparison API is running' });
});

// Test endpoint
app.get('/test', (req, res) => {
  console.log('✅ Test endpoint hit');
  res.json({ message: 'Server is working!' });
});

console.log('🔧 Middleware configured');

// Start server
app.listen(PORT, '127.0.0.1', (err) => {
  if (err) {
    console.error('❌ Error starting server:', err);
    process.exit(1);
  }
  console.log(`✅ Server successfully started on http://127.0.0.1:${PORT}`);
  console.log(`🌐 Test it with: http://127.0.0.1:${PORT}/test`);
});