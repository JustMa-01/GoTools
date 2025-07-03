import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import BackToHomeButton from '../components/BackToHomeButton';
import { FiFile, FiTrash2, FiDownload, FiLoader, FiCheckCircle, FiZap, FiAlertTriangle } from 'react-icons/fi';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const PDFtoPNGPage = () => {
    const [file, setFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [resultFiles, setResultFiles] = useState([]);
    const [error, setError] = useState(null);
    const [isZipping, setIsZipping] = useState(false);

    const resetState = () => { setFile(null); setResultFiles([]); setError(null); setIsProcessing(false); setIsZipping(false); };
    const handleDrop = (acceptedFiles) => { if (acceptedFiles.length > 0) { resetState(); setFile(acceptedFiles[0]); }};
    const handleConvert = async () => {
        if (!file) return;
        setIsProcessing(true);
        setError(null);
        setResultFiles([]);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch(`${API_BASE_URL}/api/pdf/pdf-to-png`, { method: 'POST', body: formData });
            if (!response.ok) throw new Error((await response.json()).message || 'Conversion failed');
            const data = await response.json();
            setResultFiles(data.files || []);
        } catch (err) { setError(err.message); }
        finally { setIsProcessing(false); }
    };
    const handleDownload = async (fileName) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/pdf/download/${fileName}`);
            if (!response.ok) throw new Error('Download failed.');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) { setError('Download failed for ' + fileName); }
    };
    const handleDownloadAllAsZip = async () => {
        if (resultFiles.length === 0) return;
        setIsZipping(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/api/pdf/zip`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filenames: resultFiles }) });
            if (!response.ok) throw new Error((await response.json()).message || 'Zipping failed');
            const data = await response.json();
            await handleDownload(data.fileName);
        } catch (err) { setError(err.message); }
        finally { setIsZipping(false); }
    };
    return (
        <div className="max-w-4xl mx-auto">
            <BackToHomeButton />
            <div className="text-center mb-10"><h2 className="text-4xl font-bold text-primary">PDF to PNG</h2><p className="text-lg text-muted-foreground mt-2">Convert each page of your PDF into a high-quality PNG image.</p></div>
            <div className="bg-card p-8 rounded-lg border border-border shadow-lg">
                {!file ? <FileUploader onDrop={handleDrop} accept={{ 'application/pdf': ['.pdf'] }} /> : (
                    <div>
                        <div className="flex items-center justify-between p-4 bg-secondary rounded-md"><div className="flex items-center space-x-3"><FiFile className="text-2xl text-primary" /><span>{file.name}</span></div><button onClick={() => setFile(null)} className="text-destructive hover:text-destructive/80"><FiTrash2 className="w-6 h-6" /></button></div>
                        <div className="text-center mt-8"><button onClick={handleConvert} className="btn btn-primary w-full md:w-auto px-8 py-3 text-lg" disabled={isProcessing}>{isProcessing ? <><FiLoader className="animate-spin mr-2 inline" /> Converting...</> : <><FiZap className="mr-2 inline" /> Convert to PNG</>}</button></div>
                    </div>
                )}
                {resultFiles.length > 0 && (
                    <div className="mt-8">
                        <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-semibold">Results ({resultFiles.length} images)</h3><button onClick={handleDownloadAllAsZip} className="btn btn-primary" disabled={isZipping}>{isZipping ? <FiLoader className="animate-spin mr-2 inline" /> : <FiDownload className="mr-2 inline" />} Download All (.zip)</button></div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {resultFiles.map((fileName, index) => (
                                <div key={index} className="relative group border border-border rounded-lg overflow-hidden"><img src={`${API_BASE_URL}/outputs/${fileName}`} alt={`Page ${index + 1}`} className="w-full h-full object-contain aspect-[3/4]"/><div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => handleDownload(fileName)} className="btn bg-white/80 text-black hover:bg-white text-sm"><FiDownload className="mr-2"/> Download</button></div></div>
                            ))}
                        </div>
                    </div>
                )}
                {error && (<div className="mt-8 p-4 bg-red-500/10 border border-red-500/30 text-red-700 rounded-lg flex items-center justify-center"><FiAlertTriangle className="mr-3" /><span>Error: {error}</span></div>)}
            </div>
        </div>
    );
};
export default PDFtoPNGPage;