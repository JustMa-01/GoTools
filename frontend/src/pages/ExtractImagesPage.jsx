import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import { FiFile, FiTrash2, FiDownload, FiLoader, FiImage, FiCheckCircle } from 'react-icons/fi';
import BackToHomeButton from '../components/BackToHomeButton';

const ExtractImagesPage = () => {
    const [file, setFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [extractedImages, setExtractedImages] = useState(null);

    const handleDrop = (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setExtractedImages(null);
        }
    };
    
    const handleRemoveFile = () => setFile(null);

    const handleExtract = () => {
        setIsProcessing(true);
        setTimeout(() => {
            // MOCK: Generate some placeholder image URLs
            setExtractedImages(Array.from({length: 6}, (_, i) => `https://picsum.photos/seed/${file.name}${i}/200/300`));
            setIsProcessing(false);
        }, 2500);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <BackToHomeButton />
            <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-primary">Extract Images from PDF</h2>
                <p className="text-lg text-muted-foreground mt-2">Extract all embedded images from a PDF file.</p>
            </div>
            <div className="bg-card p-8 rounded-lg border border-border shadow-lg">
                {!file && <FileUploader onDrop={handleDrop} accept={{ 'application/pdf': ['.pdf'] }} />}
                
                {file && !extractedImages && (
                    <div>
                        <div className="flex items-center justify-between p-4 bg-secondary rounded-md">
                            <div className="flex items-center space-x-3"><FiFile className="text-2xl text-primary" /><span>{file.name}</span></div>
                            <button onClick={handleRemoveFile} className="text-destructive hover:text-destructive/80"><FiTrash2 className="w-6 h-6" /></button>
                        </div>
                        <div className="text-center mt-8">
                            <button onClick={handleExtract} className="btn btn-primary w-full md:w-auto px-8 py-3 text-lg" disabled={isProcessing}>
                                {isProcessing ? <FiLoader className="animate-spin mr-2 inline" /> : <FiImage className="mr-2 inline" />}
                                Extract Images
                            </button>
                        </div>
                    </div>
                )}

                {extractedImages && (
                    <div className="text-center">
                        <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold mb-4">{extractedImages.length} Images Extracted!</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-6">
                            {extractedImages.map((src, i) => (
                                <img key={i} src={src} alt={`Extracted ${i+1}`} className="rounded-md object-cover w-full h-full aspect-[2/3]" />
                            ))}
                        </div>
                        <button className="btn btn-primary w-full md:w-auto px-8 py-3 text-lg">
                            <FiDownload className="inline mr-2" /> Download All as ZIP
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExtractImagesPage;