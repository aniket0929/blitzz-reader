'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, File as FileIcon, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

interface FileUploaderProps {
  onFileLoaded: (file: File) => void;
  onBack: () => void;
  onViewLibrary?: () => void;
}

export default function FileUploader({ onFileLoaded, onBack, onViewLibrary }: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) validateAndLoad(file);
    },
    [onFileLoaded]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      validateAndLoad(e.target.files[0]);
    }
  };

  const validateAndLoad = (file: File) => {
    if (file.type === 'application/pdf' || file.type === 'text/plain' || file.name.endsWith('.pdf') || file.name.endsWith('.txt')) {
      onFileLoaded(file);
    } else {
      alert('Please upload a valid PDF or TXT file.');
    }
  };

  return (
    <div className="page-center relative">
      <button onClick={onBack} className="back-button btn">
        ← Back
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="upload-wrapper"
      >
        <h2 className="upload-title">Upload Your Book</h2>

        <div
          className={`glass-panel upload-zone ${isDragOver ? 'active' : ''}`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <div className="upload-icon">
            <Upload size={40} className="text-primary" />
          </div>
          
          <div>
            <h3 className="upload-main-text">Drop your file here</h3>
            <p className="text-muted">or click to browse</p>
          </div>

          <div className="badge-group">
            <span className="badge">
              <FileText size={14} /> TXT
            </span>
            <span className="badge">
              <FileIcon size={14} /> PDF
            </span>
          </div>
          
          <input
            type="file"
            id="file-input"
            className="hidden"
            accept=".pdf,.txt"
            onChange={handleFileChange}
          />
        </div>

        {/* View Library Button */}
        {onViewLibrary && (
          <button 
            onClick={onViewLibrary}
            className="btn library-btn"
          >
            <BookOpen size={18} />
            View Your Library
          </button>
        )}
      </motion.div>
    </div>
  );
}
