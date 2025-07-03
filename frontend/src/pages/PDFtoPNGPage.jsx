import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import BackToHomeButton from '../components/BackToHomeButton';
import { FiFile, FiTrash2, FiDownload, FiLoader, FiCheckCircle, FiZap, FiAlertTriangle } from 'react-icons/fi';
// --- Step 1 ---
import { useTribute } from '../contexts/TributeContext';
import ToolLoader from '../components/ToolLoader';
import ResultFooter from '../components/ResultFooter';

const PDFtoPNGPage = () => {
    const [file, setFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [resultFiles, setResultFiles] = useState([]);
    const [error, setError] = useState(null);
    const [isZipping, setIsZipping] = useState(false);

    // --- Step 2 ---
    const { hasShownToolLoader } = useTribute();
    const [showRealLoader, setShowRealLoader] = useState(hasShownToolLoader);

    const handleDrop = (acceptedFiles) => { if (acceptedFiles.length > 0) { setFile(acceptedFiles[0]); setResultFiles([]); setError(null); }};
    const handleRemoveFile = () => { setFile(null); setResultFiles([]); setError(null); };
    const handleDownload = async (fileName) => { /* ... download logic ... */ try { const response = await fetch(`http://localhost:3001/api/pdf/download/${fileName}`); if (!response.ok) throw new Error('Network response was not ok.'); const blob = await response.blob(); const url = window.URL.createObjectURL(blob); const a = document.createElement('a'); a.style.display = 'none'; a.href = url; a.download = fileName; document.body.appendChild(a); a.click(); window.URL.revokeObjectURL(url); document.body.removeChild(a); } catch (err) { setError('Download failed. Please try again.'); }};
    const handleDownloadAllAsZip = async () => { /* ... zip logic ... */ if (resultFiles.length === 0) return; setIsZipping(true); setError(null); try { const response = await fetch('http://localhost:3001/api/pdf/zip', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filenames: resultFiles }), }); if (!response.ok) throw new Error((await response.json()).message || 'Zipping failed'); const data = await response.json(); await handleDownload(data.fileName); } catch (err) { setError(err.message); } finally { setIsZipping(false); }};
    
    const handleConvert = async () => {
        if (!file) return;
        // --- Step 3 ---
        setShowRealLoader(hasShownToolLoader);
        setIsProcessing(true);
        setResultFiles([]);
        setError(null);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch('http://localhost:3001/api/pdf/pdf-to-png', { method: 'POST', body: formData });
            if (!response.ok) throw new Error((await response.json()).message);
            const data = await response.json();
            setResultFiles(data.files || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <BackToHomeButton />
            <div className="text-center mb-10"><h2 className="text-4xl font-bold text-primary">PDF to PNG</h2><p className="text-lg text-muted-foreground mt-2">Convert each page of your PDF into a high-quality PNG image.</p></div>
            <div className="bg-card p-8 rounded-lg border border-border shadow-lg">
                {!file && <FileUploader onDrop={handleDrop} accept={{ 'application/pdf': ['.pdf'] }} />}
                {file && !resultFiles.length && (
                    <div>
                        <div className="flex items-center justify-between p-4 bg-secondary rounded-md"><div className="flex items-center space-x-3"><FiFile className="text-2xl text-primary" /><span>{file.name}</span></div><button onClick={handleRemoveFile} className="text-destructive hover:text-destructive/80"><FiTrash2 className="w-6 h-6" /></button></div>
                        <div className="text-center mt-8">
                            {/* --- Step 4 --- */}
                            {isProcessing ? (
                                <div className="h-[48px] flex items-center justify-center font-semibold">
                                    {!hasShownToolLoader && !showRealLoader ? (<ToolLoader onComplete={() => setShowRealLoader(true)} />) : (<span className="flex items-center justify-center text-primary"><FiLoader className="animate-spin mr-2 inline" /> Converting...</span>)}
                                </div>
                            ) : (
                                <button onClick={handleConvert} className="btn btn-primary w-full md:w-auto px-8 py-3 text-lg"><FiZap className="mr-2 inline" />Convert to PNG</button>
                            )}
                        </div>
                    </div>
                )}
                {resultFiles.length > 0 && (
                    <div className="mt-8">
                        <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-semibold">Conversion Results ({resultFiles.length} images)</h3><button onClick={handleDownloadAllAsZip} className="btn btn-primary" disabled={isZipping}>{isZipping ? <FiLoader className="animate-spin mr-2 inline" /> : <FiDownload className="mr-2 inline" />}Download All (.zip)</button></div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {resultFiles.map((fileName, index) => (<div key={index} className="relative group border border-border rounded-lg overflow-hidden"><img src={`http://localhost:3001/outputs/${fileName}`} alt={`Page ${index + 1}`} className="w-full h-full object-contain aspect-[3/4]"/><div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => handleDownload(fileName)} className="btn bg-white/80 text-black hover:bg-white text-sm"><FiDownload className="mr-2"/> Download</button></div></div>))}
                        </div>
                         {/* --- Step 5 --- */}
                        <ResultFooter />
                    </div>
                )}
                {error && (<div className="mt-8 p-4 bg-red-500/10 border border-red-500/30 text-red-700 rounded-lg text-center"><FiAlertTriangle className="inline mr-2" /> Error: {error}</div>)}
            </div>
        </div>
    );
};

export default PDFtoPNGPage;