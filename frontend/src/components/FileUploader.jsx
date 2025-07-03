import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud } from 'react-icons/fi';

const FileUploader = ({ onDrop, accept }) => {
  const onDropCallback = useCallback(
    (acceptedFiles) => {
      onDrop(acceptedFiles);
    },
    [onDrop]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropCallback,
    accept,
  });

  return (
    <div
      {...getRootProps()}
      className={`p-10 border-2 border-dashed rounded-lg cursor-pointer text-center transition-colors duration-300
      ${isDragActive ? 'border-primary bg-accent' : 'border-border hover:border-primary/70'}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center">
        <FiUploadCloud className="text-5xl text-muted-foreground mb-4" />
        <p className="text-lg font-semibold text-foreground">
          {isDragActive ? 'Drop the files here...' : 'Drag & drop files here, or click to select'}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
            Files are processed locally and deleted after 30 mins.
        </p>
      </div>
    </div>
  );
};

export default FileUploader;