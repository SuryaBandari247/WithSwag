import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Area } from 'react-easy-crop';
import { PassportSize, AdjustmentValues } from '../types';
import { MM_TO_PX, DEFAULT_DPI, DEFAULT_ADJUSTMENT_VALUES } from '../constants';
import { cropAndResizeImage, fileToDataUrl } from '../utils/imageProcessing';
import { applyAdjustmentsToCanvas, applyAdjustments } from '../utils/adjustmentEngine';
import { Download, AlertTriangle } from 'lucide-react';
import { saveAs } from 'file-saver';

interface PreviewProps {
  imageSrc: string;
  cropArea: Area;
  passportSize: PassportSize;
  dpi: number;
  imageFile: File;
  processedSrc?: string;
  transparentSrc?: string;
  bgColor?: string;
  adjustmentValues?: AdjustmentValues;
  onDownload: (canvas: HTMLCanvasElement, format: 'png' | 'jpg') => void;
}

/**
 * Check whether adjustment values differ from defaults (i.e. user made changes).
 */
function hasNonDefaultAdjustments(values: AdjustmentValues): boolean {
  return (
    values.brightness !== 0 ||
    values.contrast !== 0 ||
    values.saturation !== 0 ||
    values.exposure !== 0 ||
    values.warmth !== 0 ||
    values.sharpness !== 0 ||
    values.faceLighting !== 0
  );
}

/**
 * Apply adjustments to foreground only (non-transparent pixels) and composite onto bgColor.
 * Returns a new canvas with the result.
 */
function applyForegroundOnlyAdjustments(
  transparentImg: HTMLImageElement,
  targetWidth: number,
  targetHeight: number,
  adjustmentValues: AdjustmentValues,
  bgColor: string
): HTMLCanvasElement {
  // Draw transparent image onto a canvas
  const fgCanvas = document.createElement('canvas');
  fgCanvas.width = targetWidth;
  fgCanvas.height = targetHeight;
  const fgCtx = fgCanvas.getContext('2d')!;
  fgCtx.clearRect(0, 0, targetWidth, targetHeight);
  fgCtx.drawImage(transparentImg, 0, 0, transparentImg.naturalWidth, transparentImg.naturalHeight, 0, 0, targetWidth, targetHeight);

  const imageData = fgCtx.getImageData(0, 0, targetWidth, targetHeight);

  // Save original alpha
  const pixelCount = targetWidth * targetHeight;
  const origAlpha = new Uint8ClampedArray(pixelCount);
  for (let i = 0; i < pixelCount; i++) {
    origAlpha[i] = imageData.data[i * 4 + 3];
  }

  // Apply adjustments
  const adjusted = applyAdjustments(imageData, adjustmentValues);

  // Restore alpha
  for (let i = 0; i < pixelCount; i++) {
    adjusted.data[i * 4 + 3] = origAlpha[i];
  }

  // Composite: bg color + adjusted foreground
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = targetWidth;
  tempCanvas.height = targetHeight;
  const tempCtx = tempCanvas.getContext('2d')!;
  tempCtx.putImageData(adjusted, 0, 0);

  const resultCanvas = document.createElement('canvas');
  resultCanvas.width = targetWidth;
  resultCanvas.height = targetHeight;
  const resultCtx = resultCanvas.getContext('2d')!;
  resultCtx.fillStyle = bgColor;
  resultCtx.fillRect(0, 0, targetWidth, targetHeight);
  resultCtx.drawImage(tempCanvas, 0, 0);

  return resultCanvas;
}

export const PhotoPreview: React.FC<PreviewProps> = ({
  imageSrc,
  cropArea,
  passportSize,
  dpi,
  imageFile,
  processedSrc,
  transparentSrc,
  bgColor,
  adjustmentValues,
  onDownload,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [qualityWarning, setQualityWarning] = useState<string | null>(null);

  useEffect(() => {
    const renderPreview = async () => {
      setIsProcessing(true);
      try {
        const useTransparent = transparentSrc && bgColor;

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

          // Apply photo adjustments at full resolution if provided
          let finalCanvas: HTMLCanvasElement = canvas;
          if (adjustmentValues && hasNonDefaultAdjustments(adjustmentValues)) {
            try {
              if (useTransparent) {
                // Load transparent image and apply foreground-only adjustments
                const transparentImg = new Image();
                transparentImg.onload = () => {
                  try {
                    finalCanvas = applyForegroundOnlyAdjustments(
                      transparentImg, targetWidth, targetHeight, adjustmentValues, bgColor!
                    );
                  } catch (error) {
                    console.error('PhotoPreview: Failed to apply foreground adjustments, falling back', error);
                    finalCanvas = applyAdjustmentsToCanvas(canvas, adjustmentValues);
                  }
                  drawToPreviewCanvas(finalCanvas, targetWidth, targetHeight);
                  checkQuality(targetWidth, targetHeight);
                };
                transparentImg.onerror = () => {
                  finalCanvas = applyAdjustmentsToCanvas(canvas, adjustmentValues);
                  drawToPreviewCanvas(finalCanvas, targetWidth, targetHeight);
                  checkQuality(targetWidth, targetHeight);
                };
                transparentImg.src = transparentSrc!;
                return; // async path — will complete in onload
              } else {
                finalCanvas = applyAdjustmentsToCanvas(canvas, adjustmentValues);
              }
            } catch (error) {
              console.error('PhotoPreview: Failed to apply adjustments during preview, using unadjusted image', error);
              finalCanvas = canvas;
            }
          }

          drawToPreviewCanvas(finalCanvas, targetWidth, targetHeight);
          checkQuality(targetWidth, targetHeight);
        };
        img.src = processedSrc || imageSrc;
      } catch (error) {
        console.error('Error rendering preview:', error);
      } finally {
        setIsProcessing(false);
      }
    };

    const drawToPreviewCanvas = (sourceCanvas: HTMLCanvasElement, targetWidth: number, targetHeight: number) => {
      if (canvasRef.current) {
        const previewCtx = canvasRef.current.getContext('2d');
        if (previewCtx) {
          const maxDim = 400;
          const scale = Math.min(maxDim / targetWidth, maxDim / targetHeight);
          canvasRef.current.width = targetWidth * scale;
          canvasRef.current.height = targetHeight * scale;
          previewCtx.drawImage(sourceCanvas, 0, 0, targetWidth * scale, targetHeight * scale);
        }
      }
    };

    const checkQuality = (targetWidth: number, targetHeight: number) => {
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

    renderPreview();
  }, [imageSrc, cropArea, passportSize, dpi, processedSrc, transparentSrc, bgColor, adjustmentValues]);

  const handleDownload = async (format: 'png' | 'jpg') => {
    setIsProcessing(true);
    try {
      const useTransparent = transparentSrc && bgColor;

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

        // Apply photo adjustments at full output resolution before download
        let finalCanvas: HTMLCanvasElement = canvas;
        if (adjustmentValues && hasNonDefaultAdjustments(adjustmentValues)) {
          try {
            if (useTransparent) {
              // Load transparent image for foreground-only adjustments
              const transparentImg = new Image();
              transparentImg.onload = () => {
                try {
                  finalCanvas = applyForegroundOnlyAdjustments(
                    transparentImg, targetWidth, targetHeight, adjustmentValues, bgColor!
                  );
                } catch (error) {
                  console.error('PhotoPreview: Failed to apply foreground adjustments during download, falling back', error);
                  finalCanvas = applyAdjustmentsToCanvas(canvas, adjustmentValues);
                }
                onDownload(finalCanvas, format);
              };
              transparentImg.onerror = () => {
                finalCanvas = applyAdjustmentsToCanvas(canvas, adjustmentValues);
                onDownload(finalCanvas, format);
              };
              transparentImg.src = transparentSrc!;
              return; // async path
            } else {
              finalCanvas = applyAdjustmentsToCanvas(canvas, adjustmentValues);
            }
          } catch (error) {
            console.error('PhotoPreview: Failed to apply adjustments during download, using unadjusted canvas', error);
            finalCanvas = canvas;
          }
        }

        onDownload(finalCanvas, format);
      };
      img.src = processedSrc || imageSrc;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Preview Canvas */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 flex items-center justify-center border border-gray-200 dark:border-slate-700 min-h-80">
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-96 border border-gray-300 dark:border-slate-600 rounded"
        />
      </div>

      {/* Quality Warning */}
      {qualityWarning && (
        <div className="flex gap-3 p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-200">{qualityWarning}</p>
        </div>
      )}

      {/* Output Info */}
      <div className="bg-gray-50 dark:bg-slate-800 p-3 rounded-lg text-sm">
        <p className="text-gray-700 dark:text-slate-300">
          <span className="font-medium">Output size:</span> {MM_TO_PX(passportSize.widthMm, dpi).toFixed(0)}×
          {MM_TO_PX(passportSize.heightMm, dpi).toFixed(0)} pixels @ {dpi} DPI
        </p>
        <p className="text-gray-600 dark:text-slate-400 text-xs mt-1">
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
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 border border-indigo-200 dark:border-indigo-700 rounded-lg p-3 text-center">
        <p className="text-sm text-gray-700 dark:text-slate-300">
          <span className="font-semibold text-indigo-700 dark:text-indigo-400">€3.00</span> for high-quality download
        </p>
        <p className="text-xs text-gray-600 dark:text-slate-400 mt-1">One-time payment • Valid for 24 hours</p>
      </div>
    </div>
  );
};
