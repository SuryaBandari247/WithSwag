import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Area } from 'react-easy-crop';
import { PassportSize } from '../types';
import { MM_TO_PX, DEFAULT_DPI } from '../constants';
import { cropAndResizeImage, fileToDataUrl } from '../utils/imageProcessing';
import { Download, AlertTriangle } from 'lucide-react';
import { saveAs } from 'file-saver';

interface PreviewProps {
  imageSrc: string;
  cropArea: Area;
  passportSize: PassportSize;
  dpi: number;
  imageFile: File;
  processedSrc?: string;
  onDownload: (canvas: HTMLCanvasElement, format: 'png' | 'jpg') => void;
}

export const PhotoPreview: React.FC<PreviewProps> = ({
  imageSrc,
  cropArea,
  passportSize,
  dpi,
  imageFile,
  processedSrc,
  onDownload,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [qualityWarning, setQualityWarning] = useState<string | null>(null);

  useEffect(() => {
    const renderPreview = async () => {
      setIsProcessing(true);
      try {
        const img = new Image();
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          const targetWidth = MM_TO_PX(passportSize.widthMm, dpi);
          const targetHeight = MM_TO_PX(passportSize.heightMm, dpi);

          canvas.width = targetWidth;
          canvas.height = targetHeight;

          if (processedSrc) {
            // Draw processed image (already cropped + bg replaced)
            ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, targetWidth, targetHeight);
          } else {
            // Draw cropped image from original
            ctx.drawImage(
              img,
              cropArea.x,
              cropArea.y,
              cropArea.width,
              cropArea.height,
              0,
              0,
              targetWidth,
              targetHeight
            );
          }

          if (canvasRef.current) {
            const previewCtx = canvasRef.current.getContext('2d');
            if (previewCtx) {
              // Scale for preview (max 400px)
              const maxDim = 400;
              const scale = Math.min(maxDim / targetWidth, maxDim / targetHeight);
              canvasRef.current.width = targetWidth * scale;
              canvasRef.current.height = targetHeight * scale;
              previewCtx.drawImage(canvas, 0, 0, targetWidth * scale, targetHeight * scale);
            }
          }

          // Check quality
          const sourcePixels = cropArea.width * cropArea.height;
          const targetPixels = targetWidth * targetHeight;
          const pixelRatio = sourcePixels / targetPixels;

          if (pixelRatio < 0.5) {
            setQualityWarning(
              `Low quality: Original image resolution may result in pixelated output. Consider using a higher resolution image.`
            );
          } else {
            setQualityWarning(null);
          }
        };
        img.src = processedSrc || imageSrc;
      } catch (error) {
        console.error('Error rendering preview:', error);
      } finally {
        setIsProcessing(false);
      }
    };

    renderPreview();
  }, [imageSrc, cropArea, passportSize, dpi, processedSrc]);

  const handleDownload = async (format: 'png' | 'jpg') => {
    setIsProcessing(true);
    try {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const targetWidth = MM_TO_PX(passportSize.widthMm, dpi);
        const targetHeight = MM_TO_PX(passportSize.heightMm, dpi);

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        if (processedSrc) {
          ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, targetWidth, targetHeight);
        } else {
          ctx.drawImage(
            img,
            cropArea.x,
            cropArea.y,
            cropArea.width,
            cropArea.height,
            0,
            0,
            targetWidth,
            targetHeight
          );
        }

        onDownload(canvas, format);
      };
      img.src = processedSrc || imageSrc;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Preview Canvas */}
      <div className="bg-white rounded-lg p-4 flex items-center justify-center border border-gray-200 min-h-80">
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-96 border border-gray-300 rounded"
        />
      </div>

      {/* Quality Warning */}
      {qualityWarning && (
        <div className="flex gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">{qualityWarning}</p>
        </div>
      )}

      {/* Output Info */}
      <div className="bg-gray-50 p-3 rounded-lg text-sm">
        <p className="text-gray-700">
          <span className="font-medium">Output size:</span> {MM_TO_PX(passportSize.widthMm, dpi).toFixed(0)}×
          {MM_TO_PX(passportSize.heightMm, dpi).toFixed(0)} pixels @ {dpi} DPI
        </p>
        <p className="text-gray-600 text-xs mt-1">
          File size will be approximately{' '}
          {((MM_TO_PX(passportSize.widthMm, dpi) * MM_TO_PX(passportSize.heightMm, dpi) * 3) / 1024 / 1024).toFixed(
            1
          )}
          MB
        </p>
      </div>

      {/* Download Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => handleDownload('png')}
          disabled={isProcessing}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          <span>Download PNG</span>
        </button>
        <button
          onClick={() => handleDownload('jpg')}
          disabled={isProcessing}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-secondary hover:bg-purple-600 text-white rounded-lg font-medium disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          <span>Download JPG</span>
        </button>
      </div>
      
      {/* Payment Info */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-3 text-center">
        <p className="text-sm text-gray-700">
          <span className="font-semibold text-indigo-700">€5.00</span> for high-quality download
        </p>
        <p className="text-xs text-gray-600 mt-1">One-time payment • Valid for 24 hours</p>
      </div>
    </div>
  );
};
