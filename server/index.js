import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import documentRoutes from './routes/documents.js';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// API Routes (before static serving)
app.use('/api/documents', documentRoutes);
app.get('/api/health', (req, res) => {
  console.log('✅ Health check request received');
  res.json({ message: 'Document comparison API is running' });
});

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`📝 Request: ${req.method} ${req.url}`);
  next();
});

// Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve frontend static files in both production and development (after API routes)
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
  app.use(express.static(path.join(__dirname, '..', 'dist')));
  // SPA fallback: catch all non-API routes and serve index.html
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api/') && !req.path.startsWith('/uploads')) {
      res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
    } else {
      res.status(404).send('Not Found');
    }
  });
}

app.listen(PORT, '127.0.0.1', (err) => {
  if (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
  console.log(`✅ Server running on http://127.0.0.1:${PORT}`);
});