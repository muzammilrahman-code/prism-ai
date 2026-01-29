import express from 'express';
import { textToPdf, fileToPdf } from '../controllers/documentController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// POST /api/convert/text-to-pdf
router.post('/text-to-pdf', textToPdf);

// POST /api/convert/file-to-pdf
router.post('/file-to-pdf', upload.single('file'), fileToPdf);

export default router;
