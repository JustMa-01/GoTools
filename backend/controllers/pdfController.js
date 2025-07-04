const os = require('os');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { PDFDocument, degrees } = require('pdf-lib');
const archiver = require('archiver');
const sharp = require('sharp');

// Utility: Safely delete a file if it exists, supressing errors.
function safeUnlink(filePath) {
  if (fs.existsSync(filePath)) {
    try { fs.unlinkSync(filePath) } 
    catch (e) { console.error(`Failed to delete temp file: ${filePath}`, e); }
  }
}

// === ALL TOOL LOGIC FUNCTIONS ARE DEFINED BELOW ===

// --- Replace the entire compressPdf function with this final version ---

const compressPdf = async (req, res) => {
  const tempPath = req.file.path;
  try {
    if (!req.file) throw new Error('No file uploaded.');
    const { compressionMode = 'quality', quality = 75, targetSize = 500 } = req.body;
    const originalSize = req.file.size;

    const runGhostscript = (dpi, pdfSetting = '/default') => new Promise(resolve => {
      const tempOutputName = `${uuidv4()}_iter.pdf`;
      const tempOutputPath = path.join(__dirname, '..', 'outputs', tempOutputName);
      
      // --- NEW, MORE POWERFUL GHOSTSCRIPT COMMAND ---
      // We've added several new flags to force more aggressive optimization.
      const command = [
        os.platform() === 'win32' ? 'gswin64c' : 'gs',
        '-sDEVICE=pdfwrite',
        '-dCompatibilityLevel=1.5',
        '-dPDFSETTINGS=' + pdfSetting,
        '-dNOPAUSE', '-dQUIET', '-dBATCH',
        '-dDetectDuplicateImages=true',    // Merges duplicate images
        '-dCompressFonts=true',            // Compresses fonts
        '-dDownsampleColorImages=true',
        '-dColorImageResolution=' + dpi,
        '-dDownsampleGrayImages=true',
        '-dGrayImageResolution=' + dpi,
        '-dDownsampleMonoImages=true',
        '-dMonoImageResolution=' + dpi,
        '-sOutputFile="' + tempOutputPath + '"',
        '"' + tempPath + '"'
      ].join(' '); // Join all parts with a space

      exec(command, (error) => {
        if (error || !fs.existsSync(tempOutputPath)) return resolve(null);
        resolve({ path: tempOutputPath, size: fs.statSync(tempOutputPath).size, name: tempOutputName });
      });
    });

    let bestResult = null;
    if (compressionMode === 'targetSize') {
      const targetBytes = parseInt(targetSize, 10) * 1024;
      const levels = [{ dpi: 300, setting: '/prepress' }, { dpi: 150, setting: '/ebook' }, { dpi: 72, setting: '/screen' }];
      const results = (await Promise.all(levels.map(l => runGhostscript(l.dpi, l.setting)))).filter(Boolean);
      if (results.length === 0) throw new Error('All compression attempts failed.');
      const plausible = results.filter(r => r.size <= targetBytes * 1.25);
      bestResult = plausible.length > 0 ? plausible.reduce((b, c) => (Math.abs(c.size - targetBytes) < Math.abs(b.size - targetBytes) ? c : b)) : results.reduce((s, c) => (c.size < s.size ? c : s));
      results.forEach(r => { if (bestResult && r.name !== bestResult.name) safeUnlink(r.path); });
    } else {
      const q = parseInt(quality, 10);
      let dpi, setting;
      if (q >= 90) { dpi = 300; setting = '/prepress'; }
      else if (q >= 75) { dpi = 200; setting = '/printer'; }
      else if (q >= 50) { dpi = 150; setting = '/ebook';  }
      else              { dpi = 72;  setting = '/screen'; }
      bestResult = await runGhostscript(dpi, setting);
    }

    if (!bestResult) throw new Error('Could not determine a best result for compression.');
    const finalName = `${uuidv4()}_compressed.pdf`;
    fs.renameSync(bestResult.path, path.join(__dirname, '..', 'outputs', finalName));
    res.json({ fileName: finalName, originalSize, compressedSize: bestResult.size });
  } catch (e) {
    res.status(500).json({ message: e.message || 'An unknown error occurred.' });
  } finally {
    safeUnlink(tempPath);
  }
};


const mergePdfs = async (req, res) => {
  const files = req.files;
  try {
    if (!files || files.length < 2) throw new Error('At least two files are required.');
    const order = req.body.order ? JSON.parse(req.body.order) : files.map(f => f.originalname);
    const map = new Map(files.map(f => [f.originalname, f.path]));
    const sortedPaths = order.map(name => map.get(name)).filter(Boolean);
    const mergedPdf = await PDFDocument.create();
    for (const p of sortedPaths) {
      const donorPdf = await PDFDocument.load(fs.readFileSync(p));
      const pages = await mergedPdf.copyPages(donorPdf, donorPdf.getPageIndices());
      pages.forEach(page => mergedPdf.addPage(page));
    }
    const bytes = await mergedPdf.save();
    const name = `${uuidv4()}_merged.pdf`;
    fs.writeFileSync(path.join(__dirname, '..', 'outputs', name), bytes);
    res.json({ fileName: name });
  } catch(e) { res.status(500).json({ message: 'Failed to merge PDFs. One of the files may be corrupted or protected.' }); }
  finally { files.forEach(f => safeUnlink(f.path)); }
};

const pdfToPng = (req, res) => {
  const tempPath = req.file.path;
  try {
    if (!req.file) throw new Error('No file uploaded.');
    const outputPrefix = uuidv4(), outputDir = path.join(__dirname, '..', 'outputs');
    const command = `pdftoppm -png -r 200 "${tempPath}" "${path.join(outputDir, outputPrefix)}"`;
    exec(command, (error) => {
      safeUnlink(tempPath);
      if (error) throw new Error('Failed to convert PDF to images.');
      const files = fs.readdirSync(outputDir).filter(f => f.startsWith(outputPrefix) && f.endsWith('.png')).sort();
      setTimeout(() => files.forEach(f => safeUnlink(path.join(outputDir, f))), 1800000);
      res.json({ files });
    });
  } catch (e) { safeUnlink(tempPath); res.status(500).json({ message: e.message }); }
};

// --- Replace the entire wordToPdf function with this ---

const wordToPdf = async (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded.' });
    }
  
    // Use Promise.allSettled to handle multiple files, even if some fail
    const conversionPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        const tempPath = path.resolve(file.path);
        // Let LibreOffice output to the SAME temporary directory
        const tempDir = path.dirname(tempPath);
  
        const command = `soffice --headless --convert-to pdf "${tempPath}" --outdir "${tempDir}"`;
  
        exec(command, (error) => {
          // Immediately clean up the original .docx upload
          safeUnlink(tempPath);
  
          if (error) {
            console.error(`LibreOffice execution error for ${file.originalname}:`, error);
            return reject(new Error(`Failed to convert ${file.originalname}`));
          }
  
          // The expected output path is now IN THE TEMP FOLDER
          const tempPdfPath = path.join(tempDir, path.basename(tempPath, path.extname(tempPath)) + '.pdf');
  
          if (fs.existsSync(tempPdfPath)) {
            // Success! Now move the file to its final destination.
            const uniqueOutputName = `${uuidv4()}_${path.basename(file.originalname, path.extname(file.originalname))}.pdf`;
            const finalOutputPath = path.join(__dirname, '..', 'outputs', uniqueOutputName);
            
            fs.renameSync(tempPdfPath, finalOutputPath);
            resolve(uniqueOutputName); // Resolve the promise with the final filename
          } else {
            // The command ran but didn't create the file
            console.error(`Conversion failed for ${file.originalname}: Output PDF not found at ${tempPdfPath}`);
            reject(new Error(`Conversion failed for ${file.originalname}: Output not found.`));
          }
        });
      });
    });
  
    try {
      const results = await Promise.allSettled(conversionPromises);
      const successfulFiles = results.filter(r => r.status === 'fulfilled').map(r => r.value);
  
      if (successfulFiles.length === 0) {
        // This is the error message you are seeing
        return res.status(500).json({ message: 'Could not convert any of the documents.' });
      }
      
      res.json({ files: successfulFiles });
  
    } catch (error) {
      res.status(500).json({ message: 'An unexpected error occurred during batch conversion.' });
    }
  };

const imageToPdf = async (req, res) => {
  const files = req.files;
  try {
    if (!files || files.length === 0) throw new Error('No image files uploaded.');
    const pdfDoc = await PDFDocument.create();
    const order = req.body.order ? JSON.parse(req.body.order) : files.map(f => f.originalname);
    const map = new Map(files.map(f => [f.originalname, f.path]));
    const sortedPaths = order.map(name => map.get(name)).filter(Boolean);
    for (const p of sortedPaths) {
      const buffer = await sharp(p).jpeg({ quality: 90 }).toBuffer();
      const image = await pdfDoc.embedJpg(buffer);
      const { width, height } = image.scale(1);
      const page = pdfDoc.addPage([width, height]);
      page.drawImage(image, { x: 0, y: 0, width, height });
    }
    const bytes = await pdfDoc.save(), name = `${uuidv4()}_images.pdf`;
    fs.writeFileSync(path.join(__dirname, '..', 'outputs', name), bytes);
    res.json({ fileName: name });
  } catch (e) { res.status(500).json({ message: 'Failed to convert images to PDF.' }); }
  finally { files.forEach(f => safeUnlink(f.path)); }
};

const compressImage = async (req, res) => {
  const tempPath = req.file.path;
  try {
    if (!req.file) throw new Error('No image file uploaded.');
    const { compressionMode = 'quality', quality = 80, targetSize = 200 } = req.body;
    const originalSize = req.file.size;
    const runSharp = (qualityLevel) => new Promise(async (resolve) => {
      try {
        const name = `${uuidv4()}_iter.jpg`, outPath = path.join(__dirname, '..', 'outputs', name);
        await sharp(tempPath).jpeg({ quality: qualityLevel, mozjpeg: true }).toFile(outPath);
        if (!fs.existsSync(outPath)) return resolve(null);
        resolve({ path: outPath, size: fs.statSync(outPath).size, name });
      } catch (e) { resolve(null) }
    });
    let bestResult = null;
    if (compressionMode === 'targetSize') {
      const targetBytes = parseInt(targetSize, 10) * 1024;
      const levels = [95, 80, 65, 50, 35, 20];
      const results = (await Promise.all(levels.map(q => runSharp(q)))).filter(Boolean);
      if (results.length === 0) throw new Error('All image compression attempts failed.');
      const plausible = results.filter(r => r.size <= targetBytes * 1.25);
      bestResult = plausible.length > 0 ? plausible.reduce((b, c) => (Math.abs(c.size - targetBytes) < Math.abs(b.size - targetBytes) ? c : b)) : results.reduce((s, c) => (c.size < s.size ? c : s));
      results.forEach(r => { if (bestResult && r.name !== bestResult.name) safeUnlink(r.path); });
    } else {
      bestResult = await runSharp(parseInt(quality, 10));
    }
    if (!bestResult) throw new Error('Could not determine a best result for image compression.');
    const finalName = `${uuidv4()}_compressed.jpg`;
    fs.renameSync(bestResult.path, path.join(__dirname, '..', 'outputs', finalName));
    res.json({ fileName: finalName, originalSize, compressedSize: bestResult.size });
  } catch (e) { res.status(500).json({ message: e.message }); }
  finally { safeUnlink(tempPath); }
};

const convertPdfToImagesForOcr = (req, res) => {
  const tempPath = req.file.path;
  try {
    if (!req.file) throw new Error('No PDF file uploaded.');
    const outputPrefix = uuidv4(), outputDir = path.join(__dirname, '..', 'outputs');
    const command = `pdftoppm -png -r 300 "${tempPath}" "${path.join(outputDir, outputPrefix)}"`;
    exec(command, (error) => {
      safeUnlink(tempPath);
      if (error) throw new Error('Failed to convert PDF to images for OCR.');
      const files = fs.readdirSync(outputDir).filter(f => f.startsWith(outputPrefix) && f.endsWith('.png')).sort();
      setTimeout(() => files.forEach(f => safeUnlink(path.join(outputDir, f))), 1800000);
      res.json({ files });
    });
  } catch (e) { safeUnlink(tempPath); res.status(500).json({ message: e.message }); }
};

const extractImages = (req, res) => {
  const tempPath = req.file.path;
  try {
    if (!req.file) throw new Error('No PDF file uploaded.');
    const outputPrefix = uuidv4(), outputDir = path.join(__dirname, '..', 'outputs');
    const command = `pdfimages -all "${tempPath}" "${path.join(outputDir, outputPrefix)}"`;
    exec(command, (error) => {
      safeUnlink(tempPath);
      if (error) throw new Error('Failed to extract images from the PDF.');
      const files = fs.readdirSync(outputDir).filter(f => f.startsWith(outputPrefix));
      setTimeout(() => files.forEach(f => safeUnlink(path.join(outputDir, f))), 1800000);
      res.json({ files });
    });
  } catch(e) { safeUnlink(tempPath); res.status(500).json({ message: e.message }); }
};

const analyzePdfsForOrganize = async (req, res) => {
  const files = req.files;
  try {
    if (!files || files.length === 0) throw new Error('No files uploaded.');
    let analysisResults = [];
    for (const file of files) {
      const tempPath = file.path, outputPrefix = `${file.filename}_thumb`, outputDir = path.join(__dirname, '..', 'outputs');
      const command = `pdftoppm -jpeg -r 150 "${tempPath}" "${path.join(outputDir, outputPrefix)}"`;
      await new Promise((resolve, reject) => exec(command, (error) => error ? reject(error) : resolve()));
      const thumbs = fs.readdirSync(outputDir).filter(f => f.startsWith(outputPrefix)).sort();
      analysisResults.push({ fileName: file.filename, originalName: file.originalname, previews: thumbs });
    }
    res.json({ files: analysisResults });
  } catch (e) { files.forEach(f => safeUnlink(f.path)); res.status(500).json({ message: 'Failed to process PDF for organization.' }); }
};

const organizePdf = async (req, res) => {
  const { files, pageOrder } = req.body;
  const uploadedFilePaths = files.map(f => path.join(__dirname, '..', 'uploads', f.fileName));
  try {
    if (!files || !pageOrder) throw new Error('Missing file data or page order.');
    const newPdfDoc = await PDFDocument.create();
    const docCache = new Map();
    for (const file of files) {
      const p = path.join(__dirname, '..', 'uploads', file.fileName);
      if(fs.existsSync(p)) docCache.set(file.fileName, await PDFDocument.load(fs.readFileSync(p)));
    }
    for (const pageInfo of pageOrder) {
      const sourceDoc = docCache.get(pageInfo.sourceFile);
      if (sourceDoc) {
        const [copiedPage] = await newPdfDoc.copyPages(sourceDoc, [pageInfo.pageNumber - 1]);
        if (pageInfo.rotation) copiedPage.setRotation(degrees(pageInfo.rotation));
        newPdfDoc.addPage(copiedPage);
      }
    }
    const name = `${uuidv4()}_organized.pdf`;
    fs.writeFileSync(path.join(__dirname, '..', 'outputs', name), await newPdfDoc.save());
    res.json({ fileName: name });
  } catch (e) { res.status(500).json({ message: 'Failed to create the organized PDF.' }); }
  finally { uploadedFilePaths.forEach(safeUnlink); }
};

const zipFiles = (req, res) => {
  const { filenames } = req.body;
  try {
    if (!filenames || !Array.isArray(filenames) || filenames.length === 0) throw new Error('No filenames provided.');
    const name = `${uuidv4()}_archive.zip`, pathOut = path.join(__dirname, '..', 'outputs', name);
    const out = fs.createWriteStream(pathOut), archive = archiver('zip');
    out.on('close', () => res.json({ fileName: name }));
    archive.on('error', (e) => { throw e });
    archive.pipe(out);
    filenames.forEach(f => { const p = path.join(__dirname, '..', 'outputs', f); if (fs.existsSync(p)) archive.file(p, { name: f }) });
    archive.finalize();
  } catch(e) { res.status(500).json({ message: 'Failed to create zip.' }); }
};

const downloadFile = (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '..', 'outputs', filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath, filename, (err) => { if (!err) setTimeout(() => safeUnlink(filePath), 5000) });
  } else {
    res.status(404).json({ message: 'File not found. It may have expired.' });
  }
};

// --- FINAL EXPORTS ---
module.exports = {
  compressPdf,
  mergePdfs,
  pdfToPng,
  wordToPdf,
  imageToPdf,
  compressImage,
  convertPdfToImagesForOcr,
  analyzePdfsForOrganize,
  organizePdf,
  extractImages,
  zipFiles,
  downloadFile,
};