import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactEasyCrop, { Area, Point } from 'react-easy-crop';
import { PassportSize } from '../types';
import { MM_TO_PX, DEFAULT_DPI } from '../constants';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface CropperProps {
  imageSrc: string;
  passportSize: PassportSize;
  dpi: number;
  onCropComplete: (croppedArea: Area) => void;
}

export const ImageCropper: React.FC<CropperProps> = ({
  imageSrc,
  passportSize,
  dpi,
  onCropComplete,
}) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const aspectRatio = passportSize.widthMm / passportSize.heightMm;

  const handleCropChange = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleComplete = () => {
    if (croppedAreaPixels) {
      onCropComplete(croppedAreaPixels);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-900">
      {/* Cropper Container */}
      <div className="flex-1 relative overflow-hidden">
        <ReactEasyCrop
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspectRatio}
          cropShape="rect"
          showGrid={true}
          onCropChange={setCrop}
          onCropComplete={handleCropChange}
          onZoomChange={setZoom}
          classes={{
            containerClassName: '!absolute inset-0',
            mediaClassName: 'max-w-none',
          }}
        />
      </div>

      {/* Controls */}
      <div className="bg-gray-800 border-t border-gray-700 p-4">
        {/* Zoom Control */}
        <div className="mb-4 flex items-center gap-3">
          <ZoomOut className="h-5 w-5 text-gray-300" />
          <input
            type="range"
            min="1"
            max="3"
            step="0.1"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <ZoomIn className="h-5 w-5 text-gray-300" />
          <span className="text-sm text-gray-300 w-12">{Math.round(zoom * 100)}%</span>
        </div>

        {/* Size Info */}
        <div className="mb-4 text-sm text-gray-300">
          <p>
            {passportSize.country} • {passportSize.widthMm}×{passportSize.heightMm}mm
          </p>
          <p className="text-xs text-gray-400">
            Output at {dpi} DPI: {Math.round(MM_TO_PX(passportSize.widthMm, dpi))}×
            {Math.round(MM_TO_PX(passportSize.heightMm, dpi))} pixels
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              setCrop({ x: 0, y: 0 });
              setZoom(1);
            }}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
          <button
            onClick={handleComplete}
            className="flex-1 px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded font-medium"
          >
            Confirm Crop
          </button>
        </div>
      </div>
    </div>
  );
};
