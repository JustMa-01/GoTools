import React, { useState, useRef } from 'react';
import FileUploader from '../components/FileUploader';
import PageThumbnail from '../components/PageThumbnail';
import BackToHomeButton from '../components/BackToHomeButton';
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import { FiSave, FiLoader, FiTrash2, FiFile, FiAlertTriangle, FiPlusCircle, FiDownload } from 'react-icons/fi';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const OrganizePDFPage = () => {
    const [pages, setPages] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [sourceFiles, setSourceFiles] = useState([]);
    const pageIdCounter = useRef(1);
    const fileInputRef = useRef(null);

    const handleDrop = async (acceptedFiles) => {
        setIsProcessing(true);
        setError('');
        const formData = new FormData();
        acceptedFiles.forEach(file => formData.append('files', file));
        try {
            const res = await fetch(`${API_BASE_URL}/api/pdf/analyze-for-organize`, { method: 'POST', body: formData });
            if (!res.ok) throw new Error((await res.json()).message || 'Failed to analyze files.');
            const { files: analysisResults } = await res.json();
            const newSourceFiles = analysisResults.map((file, index) => ({ ...file, color: 'bg-blue-500' }));
            const newPages = newSourceFiles.flatMap(sf =>
                sf.previews.map((preview, i) => ({ id: pageIdCounter.current++, pageNumber: i + 1, sourceFile: sf.fileName, previewUrl: `${API_BASE_URL}/outputs/${preview}`, rotation: 0, color: sf.color }))
            );
            setSourceFiles(prev => [...prev, ...newSourceFiles]);
            setPages(prev => [...prev, ...newPages]);
        } catch (err) { setError(err.message); }
        finally { setIsProcessing(false); }
    };
    const handleSave = async () => {
        setIsSaving(true);
        setError('');
        const payload = { files: sourceFiles.map(sf => ({ fileName: sf.fileName })), pageOrder: pages.map(p => ({ sourceFile: p.sourceFile, pageNumber: p.pageNumber, rotation: p.rotation })) };
        try {
            const res = await fetch(`${API_BASE_URL}/api/pdf/organize-pdf`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!res.ok) throw new Error((await res.json()).message || 'Failed to assemble the final PDF.');
            const data = await res.json();
            await handleDownload(data.fileName);
            resetState();
            alert("Success! Your organized PDF has been downloaded.");
        } catch (err) { setError(err.message); }
        finally { setIsSaving(false); }
    };
    const handleDownload = async (fileName) => { try { const res = await fetch(`${API_BASE_URL}/api/pdf/download/${fileName}`); if (!res.ok) throw new Error('Download failed'); const blob = await res.blob(); const url = window.URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${new Date().toISOString().split('T')[0]}_organized.pdf`; document.body.appendChild(a); a.click(); document.body.removeChild(a); window.URL.revokeObjectURL(url); } catch (err) { setError(err.message); } };
    function handleDragStart(event) { setActiveId(event.active.id); }
    function handleDragEnd(event) {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setPages(items => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
        setActiveId(null);
    }
    const handleRotatePage = (pageId) => { setPages(prevPages => prevPages.map(p => p.id === pageId ? { ...p, rotation: (p.rotation + 90) % 360 } : p)); };
    const handleDeletePage = (pageId) => setPages(prev => prev.filter(p => p.id !== pageId));
    const triggerFileInput = () => fileInputRef.current?.click();
    const handleFileChange = (event) => { const files = Array.from(event.target.files); if (files.length > 0) handleDrop(files); };
    const resetState = () => { setSourceFiles([]); setPages([]); setError(''); setIsProcessing(false); setIsSaving(false); pageIdCounter.current = 1; };
    const activePage = pages.find(p => p.id === activeId);
    return (
        <div className="max-w-7xl mx-auto">
            <BackToHomeButton />
            {pages.length === 0 ? (<div className="text-center py-16"><h2 className="text-4xl font-bold text-primary mb-2">Organize PDF</h2><p className="text-lg text-muted-foreground mb-8">Combine, reorder, rotate, and delete pages from multiple PDFs.</p><div className="max-w-xl mx-auto"><FileUploader onDrop={handleDrop} accept={{ 'application/pdf': ['.pdf'] }} multiple={true} />{isProcessing && <div className="mt-4"><FiLoader className="animate-spin text-2xl text-primary mx-auto" /></div>}</div></div>) : (
                <div className="md:flex md:gap-8">
                    <div className="md:w-1/3 lg:w-1/4 mb-8 md:mb-0 flex flex-col gap-6"><div><h2 className="text-3xl font-bold text-primary">Organize</h2><p className="text-md text-muted-foreground">Add more files, or drag pages to reorder.</p></div><button onClick={triggerFileInput} className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg text-muted-foreground hover:border-primary hover:text-primary transition-colors"><FiPlusCircle /> Add More Files</button><input type="file" ref={fileInputRef} onChange={handleFileChange} multiple accept=".pdf" className="hidden" /><div className="flex-grow"></div><div className="flex gap-2 pt-4"><button onClick={handleSave} className="btn btn-primary w-full" disabled={isSaving || pages.length === 0}>{isSaving ? <FiLoader className="animate-spin" /> : 'Save & Download'}</button><button onClick={resetState} className="btn btn-secondary">Clear All</button></div></div>
                    <div className="md:w-2/3 lg:w-3/4 bg-card p-4 rounded-lg border border-border min-h-[70vh]">
                        <DndContext collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                            <SortableContext items={pages} strategy={rectSortingStrategy}>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                    {pages.map(page => <PageThumbnail key={page.id} {...page} onDelete={handleDeletePage} onRotate={handleRotatePage}/>)}
                                </div>
                            </SortableContext>
                            <DragOverlay>{activeId && activePage ? <PageThumbnail id={activePage.id} pageNumber={activePage.pageNumber} previewUrl={activePage.previewUrl} rotation={activePage.rotation} onDelete={() => {}} onRotate={() => {}} /> : null}</DragOverlay>
                        </DndContext>
                    </div>
                </div>
            )}
             {error && (<div className="fixed bottom-10 right-10 p-4 bg-red-500/90 text-white rounded-lg shadow-lg flex items-center gap-2"><FiAlertTriangle />{error}</div>)}
        </div>
    );
};
export default OrganizePDFPage;