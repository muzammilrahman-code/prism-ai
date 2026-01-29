import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const textToPdf = (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }
  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=text.pdf');
  doc.pipe(res);
  doc.text(text);
  doc.end();
};

export const fileToPdf = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'File is required' });
  }
  const filePath = req.file.path;
  const ext = path.extname(req.file.originalname).toLowerCase();
  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=file.pdf');
  doc.pipe(res);
  if (ext === '.txt') {
    const content = fs.readFileSync(filePath, 'utf8');
    doc.text(content);
  } else if (['.jpg', '.jpeg', '.png'].includes(ext)) {
    doc.image(filePath, { fit: [500, 700], align: 'center', valign: 'center' });
  } else {
    doc.text('Unsupported file type. Only .txt, .jpg, .jpeg, .png are supported.');
  }
  doc.end();
  fs.unlink(filePath, () => {}); // Clean up upload
};
