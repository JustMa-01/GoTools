import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import FileList from '../components/FileList';
import BackToHomeButton from '../components/BackToHomeButton';
import { FiDownload, FiImage, FiLoader, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
// --- Step 1 ---
import { useTribute } from '../contexts/TributeContext';
import ToolLoader from '../components/ToolLoader';
import ResultFooter from '../components/ResultFooter';

const ImageToPDFPage = () => {
    const [files, setFiles] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    // --- Step 2 ---
    const { hasShownToolLoader } = useTribute();
    const [showRealLoader, setShowRealLoader] = useState(hasShownToolLoader);

    const handleDrop = (acceptedFiles) => { setFiles(prev => [...prev, ...acceptedFiles]); setResult(null); setError(null); };
    const handleRemoveFile = (index) => setFiles(prev => prev.filter((_, i) => i !== index));
    const handleReorder = (newFiles) => setFiles(newFiles);
    const handleDownload = async (fileName) => { /* ... download logic ... */ try { const res = await fetch(`http://localhost:3001/api/pdf/download/${fileName}`); if (!res.ok) throw new Error('Download failed'); const blob = await res.blob(); const url = window.URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = fileName; document.body.appendChild(a); a.click(); document.body.removeChild(a); window.URL.revokeObjectURL(url); } catch (err) { setError(err.message); }};

    const handleConvert = async () => {
        if (files.length === 0) return;
        // --- Step 3 ---
        setShowRealLoader(hasShownToolLoader);
        setIsProcessing(true);
        setResult(null);
        setError(null);
        const formData = new FormData();
        formData.append('order', JSON.stringify(files.map(f => f.name)));
        files.forEach(file => formData.append('files', file));
        try {
            const response = await fetch('http://localhost:3001/api/pdf/image-to-pdf', { method: 'POST', body: formData });
            if (!response.ok) throw new Error((await response.json()).message);
            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <BackToHomeButton />
            <div className="text-center mb-10"><h2 className="text-4xl font-bold text-primary">Image to PDF</h2><p className="text-lg text-muted-foreground mt-2">Convert JPG, PNG, and other images to a single PDF.</p></div>
            <div className="bg-card p-8 rounded-lg border border-border shadow-lg">
                <FileUploader onDrop={handleDrop} accept={{ 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] }} multiple={true} />
                {files.length > 0 && (
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold mb-4">Images to Convert ({files.length}):</h3>
                        <FileList files={files} onRemove={handleRemoveFile} onReorder={handleReorder} reorderable={true} />
                        <div className="text-center mt-8">
                             {/* --- Step 4 --- */}
                            {isProcessing ? (
                                <div className="h-[48px] flex items-center justify-center font-semibold">
                                    {!hasShownToolLoader && !showRealLoader ? (<ToolLoader onComplete={() => setShowRealLoader(true)} />) : (<span className="flex items-center justify-center text-primary"><FiLoader className="animate-spin mr-2 inline" /> Converting...</span>)}
                                </div>
                            ) : (
                                <button onClick={handleConvert} className="btn btn-primary w-full md:w-auto px-8 py-3 text-lg" disabled={isProcessing}><FiImage className="mr-2 inline" />Convert to PDF</button>
                            )}
                        </div>
                    </div>
                )}
                {result && (
                    <div className="mt-8 p-6 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
                        <FiCheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                        <h3 className="text-2xl font-semibold text-foreground mb-4">Conversion Successful!</h3>
                        <button onClick={() => handleDownload(result.fileName)} className="btn bg-green-600 text-white hover:bg-green-700"><FiDownload className="inline mr-2" /> Download PDF</button>
                        {/* --- Step 5 --- */}
                        <ResultFooter />
                    </div>
                )}
                {error && (<div className="mt-8 p-4 bg-red-500/10 border border-red-500/30 text-red-700 rounded-lg"><FiAlertTriangle className="inline mr-2" /> Error: {error}</div>)}
            </div>
        </div>
    );
};
export default ImageToPDFPage;