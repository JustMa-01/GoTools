import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import BackToHomeButton from '../components/BackToHomeButton';
import FileList from '../components/FileList';
import { FiDownload, FiLoader, FiCheckCircle, FiZap, FiAlertTriangle, FiFileText } from 'react-icons/fi';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const WordToPDFPage = () => {
    const [files, setFiles] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [resultFiles, setResultFiles] = useState([]);
    const [error, setError] = useState(null);
    const [isZipping, setIsZipping] = useState(false);

    const handleDrop = (acceptedFiles) => { setFiles(prev => [...prev, ...acceptedFiles].filter((file, index, self) => index === self.findIndex((f) => f.name === file.name))); setResultFiles([]); setError(null); };
    const handleRemoveFile = (indexToRemove) => { setFiles(prev => prev.filter((_, index) => index !== indexToRemove)); };
    const handleConvert = async () => {
        if (files.length === 0) return;
        setIsProcessing(true);
        setResultFiles([]);
        setError(null);
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));
        try {
            const response = await fetch(`${API_BASE_URL}/api/pdf/word-to-pdf`, { method: 'POST', body: formData });
            if (!response.ok) throw new Error((await response.json()).message || 'Conversion failed');
            setResultFiles((await response.json()).files || []);
        } catch (err) { setError(err.message); }
        finally { setIsProcessing(false); }
    };
    const handleDownload = async (fileName) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/pdf/download/${fileName}`);
            if (!response.ok) throw new Error('Download failed');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err) { setError(err.message); }
    };
    const handleDownloadAllAsZip = async () => {
        if (resultFiles.length === 0) return;
        setIsZipping(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/pdf/zip`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filenames: resultFiles }) });
            if (!res.ok) throw new Error((await res.json()).message || 'Zipping failed');
            await handleDownload((await res.json()).fileName);
        } catch (err) { setError(err.message); }
        finally { setIsZipping(false); }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <BackToHomeButton />
            <div className="text-center mb-10"><h2 className="text-4xl font-bold text-primary">Word to PDF</h2><p className="text-lg text-muted-foreground mt-2">Convert .doc and .docx files to PDF in batch.</p></div>
            <div className="bg-card p-8 rounded-lg border border-border shadow-lg">
                <FileUploader onDrop={handleDrop} accept={{ 'application/msword': ['.doc'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] }} multiple={true} />
                {files.length > 0 && (
                    <div className="mt-8"><h3 className="text-lg font-semibold mb-4">Files to Convert:</h3><FileList files={files} onRemove={handleRemoveFile} /><div className="text-center mt-8"><button onClick={handleConvert} className="btn btn-primary w-full md:w-auto px-8 py-3 text-lg" disabled={isProcessing || files.length === 0}>{isProcessing ? <FiLoader className="animate-spin mr-2 inline" /> : <FiZap className="mr-2 inline" />} Convert to PDF</button></div></div>
                )}
                {resultFiles.length > 0 && (
                    <div className="mt-8">
                        <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-semibold">Conversion Complete!</h3><button onClick={handleDownloadAllAsZip} className="btn btn-primary" disabled={isZipping}>{isZipping ? <FiLoader className="animate-spin mr-2 inline" /> : <FiDownload className="mr-2 inline" />} Download All (.zip)</button></div>
                        <div className="space-y-2">{resultFiles.map((name, i) => (<div key={i} className="flex justify-between items-center p-2 bg-secondary rounded-md"><span className="flex items-center gap-2"><FiFileText className="text-primary"/>{name}</span><button onClick={() => handleDownload(name)} className="btn btn-sm btn-secondary">Download</button></div>))}</div>
                    </div>
                )}
                {error && (<div className="mt-8 p-4 bg-red-500/10 border border-red-500/30 text-red-700 rounded-lg"><FiAlertTriangle className="inline mr-2" /> Error: {error}</div>)}
            </div>
        </div>
    );
};
export default WordToPDFPage;