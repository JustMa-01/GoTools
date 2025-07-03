import React, { useState } from 'react';
import { createWorker } from 'tesseract.js';
import FileUploader from '../components/FileUploader';
import BackToHomeButton from '../components/BackToHomeButton';
import { FiImage, FiTrash2, FiLoader, FiType, FiCopy, FiAlertTriangle } from 'react-icons/fi';

const ImageToTextPage = () => {
    const [file, setFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [extractedText, setExtractedText] = useState('');
    const [error, setError] = useState('');

    const resetState = () => {
        setFile(null);
        setIsProcessing(false);
        setExtractedText('');
        setError('');
    };

    const handleDrop = (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            resetState();
            setFile(acceptedFiles[0]);
        }
    };
    
    const doOCR = async () => {
        if (!file) return;
        setIsProcessing(true);
        setError('');
        setExtractedText('');
        try {
            const worker = await createWorker('eng'); // NEW: language can be loaded directly
            const { data: { text } } = await worker.recognize(file);
            setExtractedText(text);
            await worker.terminate();
        } catch (err) {
            console.error(err);
            setError('OCR processing failed. The image may be too complex or unsupported.');
        } finally {
            setIsProcessing(false);
        }
    };
    
    const handleCopy = () => {
        navigator.clipboard.writeText(extractedText);
        alert('Text copied to clipboard!');
    };

    return (
        <div className="max-w-4xl mx-auto">
            <BackToHomeButton />
            <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-primary">Image to Text (OCR)</h2>
                <p className="text-lg text-muted-foreground mt-2">Extract editable text from any image file using in-browser OCR.</p>
            </div>
            <div className="bg-card p-8 rounded-lg border border-border shadow-lg">
                {!file ? <FileUploader onDrop={handleDrop} accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.bmp', '.webp'] }} /> : (
                    <div>
                        <div className="flex items-center justify-between p-4 bg-secondary rounded-md">
                            <div className="flex items-center space-x-3"><FiImage className="text-2xl text-primary" /><span>{file.name}</span></div>
                            <button onClick={resetState} className="text-destructive hover:text-destructive/80"><FiTrash2 className="w-6 h-6" /></button>
                        </div>
                        <div className="text-center mt-8">
                            <button onClick={doOCR} className="btn btn-primary w-full md:w-auto px-8 py-3 text-lg" disabled={isProcessing}>
                                {isProcessing ? <><FiLoader className="animate-spin mr-2 inline" /> Processing...</> : <><FiType className="mr-2 inline" /> Extract Text</>}
                            </button>
                        </div>
                    </div>
                )}
                
                {extractedText && (
                    <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-4">Extracted Text:</h3>
                        <textarea readOnly value={extractedText} rows="10" className="w-full p-4 bg-secondary border border-border rounded-md text-secondary-foreground" />
                        <div className="flex items-center justify-center space-x-4 mt-6">
                            <button onClick={handleCopy} className="btn btn-secondary"><FiCopy className="inline mr-2" /> Copy to Clipboard</button>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mt-8 p-4 bg-red-500/10 border border-red-500/30 text-red-700 rounded-lg text-center flex items-center justify-center">
                        <FiAlertTriangle className="mr-3" />
                        <span>{error}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageToTextPage;