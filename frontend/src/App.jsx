import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
// ... Import all your page components ...
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CompressPDFPage from './pages/CompressPDFPage';
import CompressImagePage from './pages/CompressImagePage';
import MergePDFPage from './pages/MergePDFPage';
import OrganizePDFPage from './pages/OrganizePDFPage';
import ExtractImagesPage from './pages/ExtractImagesPage';
import ImageToPDFPage from './pages/ImageToPDFPage';
import PDFtoPNGPage from './pages/PDFtoPNGPage';
import PDFtoOCRPage from './pages/PDFtoOCRPage';
import ImageToTextPage from './pages/ImageToTextPage';
import WordToPDFPage from './pages/WordToPDFPage';

function App() {
  useEffect(() => {
    const splashScreen = document.getElementById('splash-screen');
    if (splashScreen) {
      // Set the minimum display time to 6 seconds (6000ms)
      setTimeout(() => {
        splashScreen.classList.add('fade-out');
        
        // Remove from DOM after the 1s fade-out completes
        setTimeout(() => {
          splashScreen.style.display = 'none';
        }, 1000); 
      }, 6000); 
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="compress-pdf" element={<CompressPDFPage />} />
        <Route path="compress-image" element={<CompressImagePage />} />
        <Route path="merge-pdf" element={<MergePDFPage />} />
        <Route path="organize-pdf" element={<OrganizePDFPage />} />
        <Route path="extract-images" element={<ExtractImagesPage />} />
        <Route path="image-to-pdf" element={<ImageToPDFPage />} />
        <Route path="pdf-to-png" element={<PDFtoPNGPage />} />
        <Route path="pdf-ocr" element={<PDFtoOCRPage />} />
        <Route path="image-to-text" element={<ImageToTextPage />} />
        <Route path="image-ocr" element={<ImageToTextPage />} />
        <Route path="word-to-pdf" element={<WordToPDFPage />} />
      </Route>
    </Routes>
  );
}

export default App;