import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import FileList from '../components/FileList';
import BackToHomeButton from '../components/BackToHomeButton';
import { FiDownload, FiLayers, FiLoader, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const MergePDFPage = () => {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleDrop = (acceptedFiles) => { setFiles(prev => [...prev, ...acceptedFiles]); setResult(null); setError(null); };
  const handleRemoveFile = (index) => { setFiles(prev => prev.filter((_, i) => i !== index)); };
  const handleReorder = (newFiles) => { setFiles(newFiles); };

  const handleMerge = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);
    setResult(null);
    setError(null);
    const formData = new FormData();
    const fileOrder = files.map(f => f.name);
    formData.append('order', JSON.stringify(fileOrder));
    files.forEach(file => formData.append('files', file));
    try {
        const response = await fetch(`${API_BASE_URL}/api/pdf/merge`, { method: 'POST', body: formData });
        if (!response.ok) throw new Error((await response.json()).message || 'Something went wrong');
        setResult(await response.json());
    } catch (err) { setError(err.message); }
    finally { setIsProcessing(false); }
  };
  const handleDownload = async (fileName) => {
    try {
        const res = await fetch(`${API_BASE_URL}/api/pdf/download/${fileName}`);
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
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <BackToHomeButton />
      <div className="text-center mb-10"><h2 className="text-4xl font-bold text-primary">Merge PDF</h2><p className="text-lg text-muted-foreground mt-2">Combine multiple PDFs into one single file. Reorder files before merging.</p></div>
      <div className="bg-card p-8 rounded-lg border border-border shadow-lg">
        <FileUploader onDrop={handleDrop} accept={{ 'application/pdf': ['.pdf'] }} multiple={true} />
        {files.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Files to Merge ({files.length}):</h3>
            <FileList files={files} onRemove={handleRemoveFile} onReorder={handleReorder} reorderable={true} />
            <div className="text-center mt-8"><button onClick={handleMerge} className="btn btn-primary w-full md:w-auto px-8 py-3 text-lg" disabled={isProcessing || files.length < 2}>{isProcessing ? <FiLoader className="animate-spin mr-2 inline" /> : <FiLayers className="mr-2 inline" />} Merge PDFs</button></div>
          </div>
        )}
        {result && (<div className="mt-8 p-6 bg-green-500/10 border border-green-500/30 rounded-lg text-center"><FiCheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" /><h3 className="text-2xl font-semibold text-foreground mb-4">Merge Successful!</h3><button onClick={() => handleDownload(result.fileName)} className="btn bg-green-600 text-white hover:bg-green-700"><FiDownload className="inline mr-2" /> Download Merged PDF</button></div>)}
        {error && (<div className="mt-8 p-4 bg-red-500/10 border border-red-500/30 text-red-700 rounded-lg text-center flex items-center justify-center"><FiAlertTriangle className="mr-3" /><span>Error: {error}</span></div>)}
      </div>
      <div className="mt-6 text-center text-sm text-muted-foreground"><p>{files.length < 2 ? 'Upload at least 2 PDFs to begin merging.' : 'Use the arrows to reorder files before merging.'}</p></div>
    </div>
  );
};
export default MergePDFPage;