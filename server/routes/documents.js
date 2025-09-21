import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractTextFromFile } from '../utils/textExtraction.js';
import { generateLegalDocumentAnalysis } from '../utils/aiProcessor.js';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Create upload directory
const uploadDir = path.join(__dirname, '../uploads');
// Create directory synchronously to avoid top-level await
import fsSync from 'fs';
if (!fsSync.existsSync(uploadDir)) {
  fsSync.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.docx', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, and TXT files are allowed.'));
    }
  }
});

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `Multer error: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};

router.post('/compare', upload.fields([
  { name: 'oldDocument', maxCount: 1 },
  { name: 'newDocument', maxCount: 1 }
]), handleMulterError, async (req, res) => {
  try {
    console.log('Received files:', req.files);
    const oldFile = req.files?.oldDocument?.[0];
    const newFile = req.files?.newDocument?.[0];

    if (!oldFile || !newFile) {
      console.log('Missing files');
      return res.status(400).json({ error: 'Both old and new documents are required' });
    }

    console.log('Old file path:', oldFile.path);
    console.log('New file path:', newFile.path);

    await Promise.all([
      fs.access(oldFile.path),
      fs.access(newFile.path)
    ]).catch(err => {
      throw new Error(`File access error: ${err.message}`);
    });

    console.log('Extracting text...');
    const oldText = await extractTextFromFile(oldFile.path, oldFile.mimetype);
    console.log('Old text:', oldText.slice(0, 100));
    const newText = await extractTextFromFile(newFile.path, newFile.mimetype);
    console.log('New text:', newText.slice(0, 100));

    console.log('Analyzing legal documents...');
    const analysis = await generateLegalDocumentAnalysis(oldText, newText);
    console.log('Analysis results:', JSON.stringify(analysis, null, 2));

    const response = {
      comparison: {
        oldDocument: {
          name: oldFile.originalname,
          text: oldText
        },
        newDocument: {
          name: newFile.originalname,
          text: newText
        },
        oldDocumentSummary: analysis.oldDocumentSummary,
        newDocumentSummary: analysis.newDocumentSummary,
        changes: analysis.changes,
        summary: {
          totalChanges: analysis.totalChanges,
          additions: analysis.additions,
          deletions: analysis.deletions,
          modifications: analysis.modifications
        },
        executiveSummary: analysis.executiveSummary,
        riskAssessment: analysis.riskAssessment
      }
    };

    console.log('Sending response:', JSON.stringify(response, null, 2));

    await Promise.all([
      fs.unlink(oldFile.path).catch(err => console.error('Failed to delete old file:', err)),
      fs.unlink(newFile.path).catch(err => console.error('Failed to delete new file:', err))
    ]);

    res.json(response);
  } catch (error) {
    console.error('Document comparison error:', error);
    res.status(500).json({ error: 'Failed to process documents. Please ensure files are valid and try again.' });
  }
});

export default router;