"use client";
import React, { useRef, useState } from 'react';
import { UploadIcon, FileTextIcon, XIcon } from '@/assets/icon-svg';

export type FileUploadCustomProps = {
  onFilesSelected?: (files: FileList) => void;
  buttonLabel?: string;
  title?: string;
  subtitle?: string;
  className?: string;
  multiple?: boolean;
  acceptedTypes?: string[];
};

export function FileUploadCustom({ 
  onFilesSelected, 
  buttonLabel = 'Select Files', 
  title = 'Upload files', 
  subtitle = 'Drag and drop files here or click to browse', 
  className = '', 
  multiple = true,
  acceptedTypes = ['pdf', 'doc', 'docx', 'ppt', 'pptx']
}: FileUploadCustomProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const isValidFileType = (file: File) => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    return fileExtension && acceptedTypes.includes(fileExtension);
  };

  const handleFiles = (files: FileList) => {
    const newFiles = Array.from(files).filter(isValidFileType);
    
    if (newFiles.length === 0) {
      return;
    }

    if (multiple) {
      setUploadedFiles(prev => [...prev, ...newFiles]);
    } else {
      setUploadedFiles(newFiles.slice(0, 1));
    }
    
    const dataTransfer = new DataTransfer();
    newFiles.forEach(file => dataTransfer.items.add(file));
    onFilesSelected?.(dataTransfer.files);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={className}>
      <div
        className={`rounded-lg ${
          isDragging
            ? 'border-2 border-dashed border-red-500'
            : 'border-2 border-dashed border-[--color-neutral-300] hover:border-[--color-neutral-400] transition-colors'
        } p-6`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
      >
        <div className={`grid place-items-center bg-transparent`}>
          <div className={`h-10 w-10 rounded-full bg-[--color-neutral-100] text-[--color-neutral-600] grid place-items-center mb-2`}>
            <UploadIcon className="w-6 h-6 p-0.5" />
          </div>
          <div className={`text-sm text-[--color-neutral-900] mb-1`}>{title}</div>
          <div className={`text-sm text-[--color-neutral-600] mb-3`}>{subtitle}</div>
          <button
            type="button"
            className={`inline-flex items-center gap-2 rounded-md border border-[--color-neutral-300] bg-[--color-surface] h-7 px-3 text-xs font-medium text-[--color-neutral-700] hover:bg-[--color-neutral-100]`}
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
          >
            {buttonLabel}
          </button>
          <input
            ref={inputRef}
            type="file"
            multiple={multiple}
            accept={acceptedTypes.map(type => `.${type}`).join(',')}
            className="hidden"
            onChange={(e) => {
              if (e.target.files) handleFiles(e.target.files);
            }}
          />
        </div>
      </div>
      
      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <div className={`text-sm font-medium text-[--color-neutral-700] mb-2`}>
            Uploaded Files ({uploadedFiles.length})
          </div>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div key={index} className={`flex items-center justify-between bg-[--color-neutral-100] rounded-lg p-3 border border-[--color-neutral-200]`}>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <FileTextIcon className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <div className={`text-sm font-medium text-[--color-neutral-900]`}>{file.name}</div>
                    <div className={`text-xs text-[--color-neutral-600]`}>{formatFileSize(file.size)}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700 p-1"
                  aria-label={`Remove ${file.name}`}
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
