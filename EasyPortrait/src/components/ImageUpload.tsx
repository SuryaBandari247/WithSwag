import React, { useCallback } from 'react';
import { Upload, Camera, File } from 'lucide-react';

interface ImageUploadProps {
  onImageSelected: (file: File) => void;
  isLoading?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected, isLoading = false }) => {
  const [isDragActive, setIsDragActive] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(e.type === 'dragenter' || e.type === 'dragover');
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        onImageSelected(files[0]);
      }
    },
    [onImageSelected]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.currentTarget.files;
      if (files?.length) {
        onImageSelected(files[0]);
      }
    },
    [onImageSelected]
  );

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-all ${
        isDragActive
          ? 'border-primary bg-blue-50 dark:bg-indigo-900/30'
          : 'border-gray-300 hover:border-gray-400 bg-gray-50 dark:bg-slate-800 dark:border-slate-600 dark:hover:border-slate-500'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
        disabled={isLoading}
      />

      <div className="space-y-4">
        <div className="flex justify-center gap-3">
          <Upload className="h-8 w-8 text-primary" />
          <File className="h-8 w-8 text-gray-400 dark:text-slate-500" />
        </div>

        <div>
          <p className="text-lg font-semibold text-gray-900 dark:text-slate-100">
            {isDragActive ? 'Drop your image here' : 'Drag and drop your photo'}
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">or click to browse</p>
        </div>

        <p className="text-xs text-gray-500 dark:text-slate-500">JPG, PNG, or WEBP • Max 10MB</p>
      </div>

      <button
        onClick={() => inputRef.current?.click()}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
        disabled={isLoading}
      >
        <Camera className="h-4 w-4" />
        Select Image
      </button>
    </div>
  );
};
