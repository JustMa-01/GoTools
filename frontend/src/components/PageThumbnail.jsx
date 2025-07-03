import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FiMoreVertical, FiTrash2, FiRotateCw } from 'react-icons/fi';

const PageThumbnail = ({ id, pageNumber, previewUrl, rotation = 0, onDelete, onRotate }) => {
  // We destructure isDragging here
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // When an item is being dragged, we make the original spot more transparent
    opacity: isDragging ? 0.3 : 1, 
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="relative group bg-secondary border border-border rounded-lg shadow-sm p-1 flex flex-col items-center justify-between aspect-[3/4] touch-none">
      <div className="absolute top-1 left-1 z-10 flex gap-1">
        <button {...listeners} className="p-1 cursor-grab bg-black/30 text-white rounded-full backdrop-blur-sm hover:bg-black/50"><FiMoreVertical size={14} /></button>
        <button onClick={() => onRotate(id)} className="p-1 cursor-pointer bg-black/30 text-white rounded-full backdrop-blur-sm hover:bg-black/50"><FiRotateCw size={14} /></button>
      </div>
      <button onClick={() => onDelete(id)} className="absolute top-1 right-1 z-10 p-1 cursor-pointer bg-black/30 text-destructive rounded-full backdrop-blur-sm hover:bg-black/50"><FiTrash2 size={14} /></button>
      
      <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-md">
        <img 
            src={previewUrl} 
            alt={`Page ${pageNumber}`} 
            className="w-full h-full object-contain transition-transform duration-300"
            style={{ transform: `rotate(${rotation}deg)` }}
        />
      </div>
      
      <span className="absolute bottom-1 bg-black/40 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{pageNumber}</span>
    </div>
  );
};

export default PageThumbnail;