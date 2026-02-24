import React, { useRef, useEffect, useState, useCallback } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import { ADJUSTMENT_SLIDERS, DEFAULT_ADJUSTMENT_VALUES, ADJUSTMENT_DEBOUNCE_MS } from '../constants';
import { AdjustmentValues } from '../types';
import { applyAdjustments } from '../utils/adjustmentEngine';

interface AdjustmentPanelProps {
  imageSrc: string;
  cropArea: { x: number; y: number; width: number; height: number };
  processedImageUrl: string;
  transparentBlobUrl?: string;
  bgColor?: string;
  adjustmentValues: AdjustmentValues;
  onAdjustmentChange: (values: AdjustmentValues) => void;
}

const AdjustmentPanel: React.FC<AdjustmentPanelProps> = ({
  imageSrc,
  cropArea,
  processedImageUrl,
  transparentBlobUrl,
  bgColor,
  adjustmentValues,
  onAdjustmentChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load the source image once
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageRef.current = img;
      drawPreview(adjustmentValues);
    };
    img.onerror = () => {
      setError('Failed to load image');
    };
    // Prefer transparent image for foreground-only adjustments
    img.src = transparentBlobUrl || processedImageUrl || imageSrc;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transparentBlobUrl, processedImageUrl, imageSrc]);

  const drawPreview = useCallback(
    (values: AdjustmentValues) => {
      const canvas = canvasRef.current;
      const img = imageRef.current;
      if (!canvas || !img) return;

      try {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setError('Canvas not supported');
          return;
        }

        // Determine source dimensions
        let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
        if (!processedImageUrl && !transparentBlobUrl && cropArea) {
          sx = cropArea.x;
          sy = cropArea.y;
          sw = cropArea.width;
          sh = cropArea.height;
        }

        // Set canvas size to match aspect ratio, capped for preview performance
        const maxDim = 600;
        const aspect = sw / sh;
        let cw: number, ch: number;
        if (aspect >= 1) {
          cw = Math.min(sw, maxDim);
          ch = Math.round(cw / aspect);
        } else {
          ch = Math.min(sh, maxDim);
          cw = Math.round(ch * aspect);
        }

        canvas.width = cw;
        canvas.height = ch;

        if (transparentBlobUrl && bgColor && bgColor !== 'none') {
          // Background was replaced — apply adjustments only to foreground pixels
          ctx.clearRect(0, 0, cw, ch);
          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
          const imageData = ctx.getImageData(0, 0, cw, ch);

          // Save original alpha values before adjustment
          const origAlpha = new Uint8ClampedArray(cw * ch);
          for (let i = 0; i < origAlpha.length; i++) {
            origAlpha[i] = imageData.data[i * 4 + 3];
          }

          // Apply adjustments (engine works on all pixels)
          const adjusted = applyAdjustments(imageData, values);

          // Restore original alpha so transparency is preserved
          for (let i = 0; i < origAlpha.length; i++) {
            adjusted.data[i * 4 + 3] = origAlpha[i];
          }

          // Composite: background color first, then adjusted foreground on top
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = cw;
          tempCanvas.height = ch;
          const tempCtx = tempCanvas.getContext('2d');
          if (tempCtx) {
            tempCtx.putImageData(adjusted, 0, 0);

            ctx.clearRect(0, 0, cw, ch);
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, cw, ch);
            ctx.drawImage(tempCanvas, 0, 0);
          }
        } else {
          // No background replacement — apply adjustments to entire image
          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
          const imageData = ctx.getImageData(0, 0, cw, ch);
          const adjusted = applyAdjustments(imageData, values);
          ctx.putImageData(adjusted, 0, 0);
        }

        setError(null);
      } catch (err) {
        console.error('AdjustmentPanel: preview error', err);
        setError('Adjustments could not be applied');
        const canvas2 = canvasRef.current;
        const ctx2 = canvas2?.getContext('2d');
        if (ctx2 && img) {
          let sx2 = 0, sy2 = 0, sw2 = img.naturalWidth, sh2 = img.naturalHeight;
          if (!processedImageUrl && !transparentBlobUrl && cropArea) {
            sx2 = cropArea.x;
            sy2 = cropArea.y;
            sw2 = cropArea.width;
            sh2 = cropArea.height;
          }
          ctx2.drawImage(img, sx2, sy2, sw2, sh2, 0, 0, canvas2!.width, canvas2!.height);
        }
      }
    },
    [processedImageUrl, transparentBlobUrl, bgColor, cropArea]
  );

  // Debounced redraw when adjustment values change
  useEffect(() => {
    if (!imageRef.current) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      drawPreview(adjustmentValues);
    }, ADJUSTMENT_DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [adjustmentValues, drawPreview]);

  const handleSliderChange = (key: keyof AdjustmentValues, value: number) => {
    onAdjustmentChange({ ...adjustmentValues, [key]: value });
  };

  const handleReset = () => {
    onAdjustmentChange({ ...DEFAULT_ADJUSTMENT_VALUES });
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full">
      {/* Canvas preview — on top for mobile, right side for desktop */}
      <div className="flex-1 order-1 md:order-2 flex items-center justify-center">
        <div className="relative bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4 w-full flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-[500px] rounded-lg"
            style={{ aspectRatio: `${cropArea.width} / ${cropArea.height}` }}
          />
          {error && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg text-amber-700 dark:text-amber-300 text-sm">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar sliders — below canvas on mobile, left side on desktop */}
      <div className="w-full md:w-72 flex-shrink-0 order-2 md:order-1">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100">Photo Adjustments</h3>

          <div className="space-y-3">
            {ADJUSTMENT_SLIDERS.map((slider) => {
              const Icon = slider.icon;
              const value = adjustmentValues[slider.key];
              const sliderId = `adjust-${slider.key}`;

              return (
                <div key={slider.key} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor={sliderId}
                      className="flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-slate-300"
                    >
                      <Icon className="h-3.5 w-3.5 text-indigo-500" />
                      {slider.label}
                    </label>
                    <span className="text-xs font-mono text-gray-500 dark:text-slate-500 w-8 text-right">
                      {value}
                    </span>
                  </div>
                  <input
                    id={sliderId}
                    type="range"
                    min={slider.min}
                    max={slider.max}
                    step={slider.step}
                    value={value}
                    onChange={(e) =>
                      handleSliderChange(slider.key, Number(e.target.value))
                    }
                    className="w-full h-1.5 bg-gray-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>
              );
            })}
          </div>

          {/* Reset All button */}
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white text-indigo-500 border-2 border-indigo-500 rounded-lg font-semibold text-sm transition-all hover:bg-indigo-500 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
            Reset All
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdjustmentPanel;
