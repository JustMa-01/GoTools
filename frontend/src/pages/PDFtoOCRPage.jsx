import React, { useState } from 'react';
import { createWorker } from 'tesseract.js';
import FileUploader from '../components/FileUploader';
import BackToHomeButton from '../components/BackToHomeButton';
import { FiFile, FiTrash2, FiLoader, FiType, FiCopy, FiAlertTriangle } from 'react-icons/fi';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const PDFtoOCRPage = () => {
    const [file, setFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processStatus, setProcessStatus] = useState('');
    const [extractedText, setExtractedText] = useState('');
    const [error, setError] = useState('');

    const resetState = () => { setFile(null); setIsProcessing(false); setProcessStatus(''); setExtractedText(''); setError(''); };
    const handleDrop = (acceptedFiles) => { if (acceptedFiles.length > 0) { resetState(); setFile(acceptedFiles[0]); }};
    
    const handleExtract = async () => {
        if (!file) return;
        setIsProcessing(true);
        setError('');
        setExtractedText('');
        try {
            setProcessStatus('Step 1/2: Converting PDF to images...');
            const formData = new FormData();
            formData.append('file', file);
            const convertResponse = await fetch(`${API_BASE_URL}/api/pdf/pdf-for-ocr`, { method: 'POST', body: formData });
            if (!convertResponse.ok) throw new Error('Failed to convert PDF to images on the server.');
            const { files: imageFiles } = await convertResponse.json();
            if (!imageFiles || imageFiles.length === 0) throw new Error('No images were extracted from the PDF.');

            let combinedText = '';
            const worker = await createWorker('eng');
            for (let i = 0; i < imageFiles.length; i++) {
                const imageName = imageFiles[i];
                const imageUrl = `${API_BASE_URL}/outputs/${imageName}`;
                setProcessStatus(`Step 2/2: Reading text from page ${i + 1} of ${imageFiles.length}...`);
                const { data: { text } } = await worker.recognize(imageUrl);
                combinedText += text + '\n\n--- Page Break ---\n\n';
            }
            await worker.terminate();
            setExtractedText(combinedText);
        } catch (err) { setError(err.message || 'An unknown error occurred during processing.'); }
        finally { setIsProcessing(false); setProcessStatus(''); }
    };
    
    const handleCopy = () => { navigator.clipboard.writeText(extractedText); alert('Text copied to clipboard!'); };

    return (
        <div className="max-w-4xl mx-auto">
            <BackToHomeButton />
            <div className="text-center mb-10"><h2 className="text-4xl font-bold text-primary">PDF to Text (OCR)</h2><p className="text-lg text-muted-foreground mt-2">Extract text from scanned (image-based) or regular PDFs.</p></div>
            <div className="bg-card p-8 rounded-lg border border-border shadow-lg">
                {!file ? <FileUploader onDrop={handleDrop} accept={{ 'application/pdf': ['.pdf'] }} /> : (
                    <div>
                        <div className="flex items-center justify-between p-4 bg-secondary rounded-md"><div className="flex items-center space-x-3"><FiFile className="text-2xl text-primary" /><span>{file.name}</span></div><button onClick={resetState} className="text-destructive hover:text-destructive/80"><FiTrash2 className="w-6 h-6" /></button></div>
                        <div className="text-center mt-8"><button onClick={handleExtract} className="btn btn-primary w-full md:w-auto px-8 py-3 text-lg" disabled={isProcessing}>{isProcessing ? <><FiLoader className="animate-spin mr-2 inline" /> Processing...</> : <><FiType className="mr-2 inline" /> Extract Text</>}</button>{isProcessing && <p className="text-sm text-muted-foreground mt-2">{processStatus}</p>}</div>
                    </div>
                )}
                {extractedText && (<div className="mt-8"><h3 className="text-xl font-semibold mb-4">Extracted Text:</h3><textarea readOnly value={extractedText} rows="12" className="w-full p-4 bg-secondary border border-border rounded-md text-secondary-foreground" /><div className="flex items-center justify-center space-x-4 mt-6"><button onClick={handleCopy} className="btn btn-secondary"><FiCopy className="inline mr-2" /> Copy</button></div></div>)}
                {error && (<div className="mt-8 p-4 bg-red-500/10 border border-red-500/30 text-red-700 rounded-lg"><FiAlertTriangle className="inline mr-2" /> Error: {error}</div>)}
            </div>
        </div>
    );
};
export default PDFtoOCRPage;