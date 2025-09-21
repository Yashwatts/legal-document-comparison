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
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1';

console.log(`🔧 Environment: ${process.env.NODE_ENV}`);
console.log(`🔧 Port: ${PORT}`);
console.log(`🔧 Host: ${HOST}`);

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 
    [process.env.FRONTEND_URL, process.env.RENDER_EXTERNAL_URL].filter(Boolean) : 
    ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://127.0.0.1:3002'],
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
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// Ensure uploads directory exists
import fs from 'fs';
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log('📁 Created uploads directory');
}

// Serve frontend static files in both production and development (after API routes)
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
  app.use(express.static(path.join(__dirname, '..', 'dist')));
  // SPA fallback: catch all non-API routes and serve index.html
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api/') && !req.path.startsWith('/uploads')) {
      const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
      res.sendFile(indexPath, (err) => {
        if (err) {
          console.error('Error serving index.html:', err);
          res.status(500).send('Server Error');
        }
      });
    } else {
      res.status(404).send('Not Found');
    }
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message 
  });
});

app.listen(PORT, HOST, (err) => {
  if (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
  console.log(`✅ Server running on http://${HOST}:${PORT}`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`🌐 Production server ready for external connections`);
  }
});