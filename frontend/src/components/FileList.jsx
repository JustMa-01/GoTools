import React from 'react';
import { FiFile, FiTrash2, FiArrowUp, FiArrowDown } from 'react-icons/fi';

const FileList = ({ files, onRemove, onReorder, reorderable = false }) => {
  const moveFile = (index, direction) => {
    if (!onReorder) return;
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= files.length) return;

    const newFiles = [...files];
    const temp = newFiles[index];
    newFiles[index] = newFiles[newIndex];
    newFiles[newIndex] = temp;
    onReorder(newFiles);
  };
  
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-3">
      {files.map((file, index) => (
        <div key={file.name + index} className="flex items-center justify-between p-3 bg-secondary rounded-md animate-fade-in">
          <div className="flex items-center space-x-3 overflow-hidden">
            <FiFile className="text-xl text-primary flex-shrink-0" />
            <span className="font-medium text-secondary-foreground truncate" title={file.name}>{file.name}</span>
            <span className="text-sm text-muted-foreground flex-shrink-0">({formatBytes(file.size)})</span>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            {reorderable && (
              <>
                <button onClick={() => moveFile(index, -1)} disabled={index === 0} className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed">
                  <FiArrowUp />
                </button>
                <button onClick={() => moveFile(index, 1)} disabled={index === files.length - 1} className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed">
                  <FiArrowDown />
                </button>
              </>
            )}
            <button onClick={() => onRemove(index)} className="p-1 text-destructive hover:text-destructive/80">
              <FiTrash2 />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileList;