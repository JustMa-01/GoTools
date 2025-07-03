const express = require('express');
const multer = require('multer');
const path = require('path');
const pdfController = require('../controllers/pdfController');

const router = express.Router();

// --- Multer Configuration for File Uploads ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// === ALL TOOL ROUTES ARE DEFINED HERE ===

// --- PDF Tool Routes ---
router.post('/compress', upload.single('file'), pdfController.compressPdf);
router.post('/merge', upload.array('files'), pdfController.mergePdfs);
router.post('/pdf-to-png', upload.single('file'), pdfController.pdfToPng);
router.post('/word-to-pdf', upload.array('files'), pdfController.wordToPdf);
router.post('/image-to-pdf', upload.array('files'), pdfController.imageToPdf);
router.post('/pdf-for-ocr', upload.single('file'), pdfController.convertPdfToImagesForOcr);

// --- Image Tool Routes ---
router.post('/compress-image', upload.single('file'), pdfController.compressImage);
router.post('/extract-images', upload.single('file'), pdfController.extractImages);

// --- Organization Tool Routes ---
router.post('/analyze-for-organize', upload.array('files'), pdfController.analyzePdfsForOrganize);
router.post('/organize-pdf', express.json({ limit: '10mb' }), pdfController.organizePdf); // Increase JSON limit for large page orders

// --- Utility Routes ---
router.post('/zip', pdfController.zipFiles);
router.get('/download/:filename', pdfController.downloadFile);

module.exports = router;