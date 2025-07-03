// frontend/src/pages/HomePage.jsx
import React from 'react';
import ToolCard from '../components/ToolCard';
import {
  FiFileText, FiScissors, FiLayers, FiMaximize, FiFilePlus, FiImage, FiType, FiAperture,
} from 'react-icons/fi';

// frontend/src/pages/HomePage.jsx
const tools = [
  { icon: <FiMaximize />, title: "Compress PDF", description: "Reduce PDF size by level or target size.", to: "/compress-pdf" },
  { icon: <FiAperture />, title: "Compress Image", description: "Reduce image file size with quality control.", to: "/compress-image" },
  { icon: <FiLayers />, title: "Merge PDF", description: "Combine multiple PDF files into one document.", to: "/merge-pdf" },
  { icon: <FiFilePlus />, title: "Organize PDF", description: "Combine, reorder, and delete pages from PDFs.", to: "/organize-pdf" },
  { icon: <FiImage />, title: "Image to PDF", description: "Convert JPG, PNG, and other images to PDF.", to: "/image-to-pdf" },
  { icon: <FiFileText />, title: "PDF to PNG", description: "Convert each page of a PDF to a PNG image.", to: "/pdf-to-png" },
  { icon: <FiType />, title: "PDF to Text (OCR)", description: "Extract text from scanned PDFs.", to: "/pdf-ocr" },
  { icon: <FiType />, title: "Image to Text (OCR)", description: "Extract text from any image file.", to: "/image-ocr" },
  { icon: <FiScissors />, title: "Word to PDF", description: "Convert DOC and DOCX files to PDF.", to: "/word-to-pdf" },
];

const HomePage = () => {
  return (
    <div>
      <section className="text-center py-10">
        <h1 className="text-5xl md:text-6xl font-extrabold text-primary mb-4">GoTools</h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
        Your complete web-based toolkit to compress, convert, merge, organize, and process PDF & Image files. Sleek, mobile-friendly, and secure.
        </p>
      </section>
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tools.map((tool, index) => <ToolCard key={index} {...tool} />)}
      </section>
    </div>
  );
};

export default HomePage;