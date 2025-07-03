const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// --- Middleware Setup ---
app.use(cors());
app.use(express.json());

// --- Directory Setup ---
const uploadsDir = path.join(__dirname, 'uploads');
const outputsDir = path.join(__dirname, 'outputs');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
if (!fs.existsSync(outputsDir)) fs.mkdirSync(outputsDir);

// --- Static File Serving ---
app.use('/outputs', express.static(outputsDir));

// --- API Routes ---
const apiRoutes = require('./routes/pdfRoutes');
app.use('/api/pdf', apiRoutes);

// --- Server Start ---
app.listen(PORT, () => {
  console.log(`GoTools Backend is running successfully on http://localhost:${PORT}`);
});