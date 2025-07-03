import React, { useState } from 'react';
// ... (all other imports)
import { FiDownload, FiLoader, FiAlertTriangle, FiCheckCircle, FiImage, FiTrash2 } from 'react-icons/fi';
import FileUploader from '../components/FileUploader';
import BackToHomeButton from '../components/BackToHomeButton';


const CompressImagePage = () => {
    const [file, setFile] = useState(null);
    // ... (rest of the state variables are the same)
    const [previewUrl, setPreviewUrl] = useState(null);
    const [compressionMode, setCompressionMode] = useState('quality');
    const [quality, setQuality] = useState(80);
    const [targetSize, setTargetSize] = useState(200);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const formatBytes = (bytes, decimals = 2) => {
        if (!bytes || bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    const resetState = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setFile(null);
        setPreviewUrl(null);
        setResult(null);
        setError(null);
    };

    const handleDrop = (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            resetState();
            const uploadedFile = acceptedFiles[0];
            setFile(uploadedFile);
            setPreviewUrl(URL.createObjectURL(uploadedFile));
        }
    };
    // handleCompress and handleDownload functions remain the same
    const handleCompress = async () => {
        if (!file) return;
        setIsProcessing(true);
        setError(null);
        setResult(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('compressionMode', compressionMode);
        formData.append('quality', quality); 
        formData.append('targetSize', targetSize);

        try {
            const response = await fetch('http://localhost:3001/api/pdf/compress-image', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) throw new Error((await response.json()).message || 'Compression failed');
            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = async (fileName) => {
        try {
            const res = await fetch(`http://localhost:3001/api/pdf/download/${fileName}`);
            if (!res.ok) throw new Error('Download failed');
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <BackToHomeButton />
            <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-primary">Compress Image</h2>
                <p className="text-lg text-muted-foreground mt-2">Reduce JPG, PNG, or WebP file size with a quality slider or target size.</p>
            </div>
            <div className="bg-card p-8 rounded-lg border border-border shadow-lg">
                {!file ? <FileUploader onDrop={handleDrop} accept={{ 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] }} /> : (
                    <div>
                        <div className="flex items-center justify-between p-4 bg-secondary rounded-md mb-6">
                            <div className="flex items-center space-x-3 overflow-hidden">
                                <FiImage className="text-2xl text-primary flex-shrink-0"/>
                                <span className="font-medium truncate">{file.name}</span>
                                <span className="text-sm text-muted-foreground flex-shrink-0">({formatBytes(file.size)})</span>
                            </div>
                            <button onClick={resetState} className="text-destructive hover:text-destructive/80 flex-shrink-0 ml-4"><FiTrash2 className="w-6 h-6"/></button>
                        </div>
                        <div className="flex justify-center mb-6 bg-secondary p-1 rounded-full">
                            <button onClick={() => setCompressionMode('quality')} className={`w-1/2 p-2 rounded-full font-semibold transition-colors ${compressionMode === 'quality' ? 'bg-primary text-primary-foreground' : 'hover:bg-background/50'}`}>By Quality</button>
                            <button onClick={() => setCompressionMode('targetSize')} className={`w-1/2 p-2 rounded-full font-semibold transition-colors ${compressionMode === 'targetSize' ? 'bg-primary text-primary-foreground' : 'hover:bg-background/50'}`}>By Target Size</button>
                        </div>
                        {compressionMode === 'quality' ? (
                            <div>
                                <label htmlFor="quality" className="block text-md font-medium text-foreground mb-2">Compression Quality ({quality}%)</label>
                                <input id="quality" type="range" min="10" max="100" value={quality} onChange={(e) => setQuality(e.target.value)} className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"/>
                            </div>
                        ) : (
                            <div>
                                <label htmlFor="targetSize" className="block text-md font-medium text-foreground mb-2">Target Size (best effort)</label>
                                <div className="flex items-center gap-2">
                                <input id="targetSize" type="number" value={targetSize} onChange={(e) => setTargetSize(e.target.value)} className="bg-secondary border border-border rounded-md p-2 w-full"/>
                                <span className="font-semibold text-muted-foreground">KB</span>
                                </div>
                            </div>
                        )}
                        <div className="text-center mt-8">
                            <button onClick={handleCompress} className="btn btn-primary w-full text-lg py-3" disabled={isProcessing}>{isProcessing ? <FiLoader className="animate-spin mr-2 inline" /> : null} Compress Image</button>
                        </div>
                    </div>
                )}
                {result && (
                    <div className="mt-8 p-6 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
                        <FiCheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                        <h3 className="text-2xl font-semibold text-foreground mb-2">Compression Successful!</h3>
                        <p className="text-muted-foreground mb-4">Your file was reduced from <span className="font-bold text-foreground">{formatBytes(result.originalSize)}</span> to <span className="font-bold text-foreground">{formatBytes(result.compressedSize)}</span>.</p>
                        <button onClick={() => handleDownload(result.fileName)} className="btn bg-green-600 text-white hover:bg-green-700"><FiDownload className="inline mr-2"/> Download Compressed Image</button>
                    </div>
                )}
                {error && (<div className="mt-8 p-4 bg-red-500/10 border border-red-500/30 text-red-700 rounded-lg text-center"><FiAlertTriangle className="inline mr-2" /> Error: {error}</div>)}
            </div>
        </div>
    );
};
export default CompressImagePage;