import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';

// Import all the pages that exist in your 'pages' folder
import CompressPDFPage from './pages/CompressPDFPage';
import MergePDFPage from './pages/MergePDFPage';
import OrganizePDFPage from './pages/OrganizePDFPage';
import ExtractImagesPage from './pages/ExtractImagesPage';
import ImageToPDFPage from './pages/ImageToPDFPage';
import PDFtoPNGPage from './pages/PDFtoPNGPage';
import PDFtoOCRPage from './pages/PDFtoOCRPage';
import WordToPDFPage from './pages/WordToPDFPage';
import ImageToTextPage from './pages/ImageToTextPage'; // Import for Image to Text

// Assuming you have a CompressImagePage component based on your screenshot
// If this file does not exist, you can comment out these two lines
import CompressImagePage from './pages/CompressImagePage'; 

function App() {
  useEffect(() => {
    const splashScreen = document.getElementById('splash-screen');
    if (splashScreen) {
      setTimeout(() => {
        splashScreen.classList.add('fade-out');
        setTimeout(() => {
          splashScreen.style.display = 'none';
        }, 500);
      }, 1500);
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        
        {/* PDF Tools */}
        <Route path="compress-pdf" element={<CompressPDFPage />} />
        <Route path="merge-pdf" element={<MergePDFPage />} />
        <Route path="organize-pdf" element={<OrganizePDFPage />} />
        <Route path="extract-images" element={<ExtractImagesPage />} />
        <Route path="image-to-pdf" element={<ImageToPDFPage />} />
        <Route path="pdf-to-png" element={<PDFtoPNGPage />} />
        <Route path="pdf-ocr" element={<PDFtoOCRPage />} />
        <Route path="word-to-pdf" element={<WordToPDFPage />} />
        
        {/* Image Tools - Adding the missing routes */}
        <Route path="image-to-text" element={<ImageToTextPage />} />
        <Route path="compress-image" element={<CompressImagePage />} />
        {/* The route for "/image-ocr" from your error log seems to be the same as "/image-to-text" */}
        <Route path="image-ocr" element={<ImageToTextPage />} />

      </Route>
    </Routes>
  );
}

export default App;