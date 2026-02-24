import React, { useState } from 'react';
import { Plus, Trash2, Grid, AlertCircle, ChevronLeft } from 'lucide-react';
import { Area } from 'react-easy-crop';
import { PassportSize } from '../types';
import { PAPER_SIZES, PASSPORT_SIZES } from '../constants';
import { ImageUpload } from './ImageUpload';
import { ImageCropper } from './ImageCropper';
import { PassportSizeSelect } from './PassportSizeSelect';
import { fileToDataUrl } from '../utils/imageProcessing';

type CollageStep = 'size' | 'upload' | 'crop' | 'layout';

interface CollageEditorProps {
  onComplete: (canvas: HTMLCanvasElement, numPhotos: number, passportSize: PassportSize, paperSize: string) => void;
  onBack: () => void;
}

export const CollageEditor: React.FC<CollageEditorProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState<CollageStep>('size');
  const [passportSize, setPassportSize] = useState<PassportSize>(PASSPORT_SIZES[3]); // EU default
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [cropArea, setCropArea] = useState<Area | null>(null);
  const [numPhotos, setNumPhotos] = useState<number>(4);
  const [selectedPaperSize, setSelectedPaperSize] = useState<'a4' | '4x6' | '5x7'>('a4');
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string>('');

  const handleImageSelected = async (file: File) => {
    setIsLoading(true);
    try {
      const src = await fileToDataUrl(file);
      setUploadedImage(src);
      setUploadedFile(file);
      setStep('crop');
    } catch (error) {
      alert('Error loading image');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCropComplete = (area: Area) => {
    setCropArea(area);
    setStep('layout');
  };

  const validatePhotoCount = (count: number): boolean => {
    const paperSize = PAPER_SIZES[selectedPaperSize];
    // Calculate how many photos can fit
    // Passport photo width: passportSize.widthMm
    // Passport photo height: passportSize.heightMm
    // Paper width: paperSize.widthMm
    // Paper height: paperSize.heightMm
    
    const photosPerRow = Math.floor(paperSize.widthMm / passportSize.widthMm);
    const photosPerCol = Math.floor(paperSize.heightMm / passportSize.heightMm);
    const maxPhotos = photosPerRow * photosPerCol;
    
    if (count > maxPhotos) {
      setValidationError(
        `Too many photos! Selected paper (${selectedPaperSize.toUpperCase()}: ${paperSize.widthMm}×${paperSize.heightMm}mm) can fit maximum ${maxPhotos} photos of size ${passportSize.widthMm}×${passportSize.heightMm}mm. You selected ${count}.`
      );
      return false;
    }
    
    setValidationError('');
    return true;
  };

  const handleNumPhotosChange = (count: number) => {
    setNumPhotos(count);
    validatePhotoCount(count);
  };

  const handlePaperSizeChange = (size: 'a4' | '4x6' | '5x7') => {
    setSelectedPaperSize(size);
    setTimeout(() => validatePhotoCount(numPhotos), 0);
  };

  const handleGenerateCollage = () => {
    if (!validatePhotoCount(numPhotos)) return;
    if (!uploadedImage || !cropArea || !uploadedFile) return;

    const paperSize = PAPER_SIZES[selectedPaperSize];
    const dpi = 300;
    const mmToPx = dpi / 25.4;
    const paperWidth = Math.round(paperSize.widthMm * mmToPx);
    const paperHeight = Math.round(paperSize.heightMm * mmToPx);

    const canvas = document.createElement('canvas');
    canvas.width = paperWidth;
    canvas.height = paperHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // White background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, paperWidth, paperHeight);

    // Calculate grid layout
    const photoWidth = Math.round(passportSize.widthMm * mmToPx);
    const photoHeight = Math.round(passportSize.heightMm * mmToPx);
    const photosPerRow = Math.floor(paperWidth / photoWidth);

    // Load and draw image tiles
    const imgElement = new Image();
    imgElement.onload = () => {
      for (let i = 0; i < numPhotos; i++) {
        const row = Math.floor(i / photosPerRow);
        const col = i % photosPerRow;
        const x = col * photoWidth;
        const y = row * photoHeight;

        // Draw cropped section
        ctx.drawImage(
          imgElement,
          cropArea.x,
          cropArea.y,
          cropArea.width,
          cropArea.height,
          x,
          y,
          photoWidth,
          photoHeight
        );

        // Draw border
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, photoWidth, photoHeight);
      }

      onComplete(canvas, numPhotos, passportSize, selectedPaperSize);
    };
    imgElement.src = uploadedImage;
  };

  const handleBackStep = () => {
    if (step === 'crop') {
      setStep('upload');
    } else if (step === 'layout') {
      setStep('crop');
    } else if (step === 'upload') {
      setStep('size');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Create Photo Collage</h2>
        {step !== 'size' && (
          <button
            onClick={handleBackStep}
            className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
        )}
      </div>

      {/* Step 1: Select Size */}
      {step === 'size' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">Step 1: Select Passport Size</h3>
            <PassportSizeSelect selected={passportSize} onSelect={setPassportSize} />
          </div>
          <button
            onClick={() => setStep('upload')}
            className="w-full px-4 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition"
          >
            Next: Upload Photo
          </button>
        </div>
      )}

      {/* Step 2: Upload */}
      {step === 'upload' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">Step 2: Upload Photo</h3>
            <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">Selected size: <strong>{passportSize.name}</strong> ({passportSize.widthMm}×{passportSize.heightMm}mm)</p>
            <ImageUpload onImageSelected={handleImageSelected} isLoading={isLoading} />
          </div>
        </div>
      )}

      {/* Step 3: Crop */}
      {step === 'crop' && uploadedImage && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">Step 3: Crop Photo</h3>
            <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">Adjust and crop your photo for the collage</p>
          </div>
          <div className="bg-white rounded-lg shadow overflow-hidden" style={{ height: '600px' }}>
            <ImageCropper
              imageSrc={uploadedImage}
              passportSize={passportSize}
              dpi={300}
              onCropComplete={handleCropComplete}
            />
          </div>
        </div>
      )}

      {/* Step 4: Layout Configuration */}
      {step === 'layout' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-6">Step 4: Configure Collage Layout</h3>
          </div>

          {/* Number of Photos */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
            <label className="block text-sm font-semibold text-gray-900 dark:text-slate-100 mb-3">
              Number of Photos
            </label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                min="1"
                max="100"
                value={numPhotos}
                onChange={(e) => handleNumPhotosChange(parseInt(e.target.value) || 1)}
                className="w-24 px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-lg"
              />
              <span className="text-sm text-gray-600 dark:text-slate-400">photos in collage</span>
            </div>
          </div>

          {/* Paper Size Selection */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
            <label className="block text-sm font-semibold text-gray-900 dark:text-slate-100 mb-3">
              Paper Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['a4', '4x6', '5x7'] as const).map((key) => {
                const size = PAPER_SIZES[key];
                return (
                  <button
                    key={key}
                    onClick={() => handlePaperSizeChange(key)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      selectedPaperSize === key
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                    }`}
                  >
                    <div>{key === '4x6' ? '4×6"' : key === '5x7' ? '5×7"' : 'A4'}</div>
                    <div className="text-xs opacity-75">{size.widthMm}×{size.heightMm}mm</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Validation Error */}
          {validationError && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900 dark:text-red-200 mb-1">Layout Issue</h4>
                <p className="text-sm text-red-700 dark:text-red-300">{validationError}</p>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <p className="text-sm text-blue-900 dark:text-blue-200">
              <strong>Paper Size Info:</strong> Paper {selectedPaperSize.toUpperCase()} ({PAPER_SIZES[selectedPaperSize].widthMm}×{PAPER_SIZES[selectedPaperSize].heightMm}mm) will fit{' '}
              <strong>
                {Math.floor(PAPER_SIZES[selectedPaperSize].widthMm / passportSize.widthMm) *
                  Math.floor(PAPER_SIZES[selectedPaperSize].heightMm / passportSize.heightMm)}
              </strong>{' '}
              photos of size {passportSize.widthMm}×{passportSize.heightMm}mm
            </p>
          </div>

          {/* Preview Grid */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
            <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-3">Layout Preview</p>
            <div
              className="bg-gray-100 dark:bg-slate-700 rounded border border-dashed border-gray-300 dark:border-slate-600 p-2"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${Math.floor(
                  PAPER_SIZES[selectedPaperSize].widthMm / passportSize.widthMm
                )}, 1fr)`,
                gap: '2px',
              }}
            >
              {Array.from({ length: numPhotos }).map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-300 dark:bg-slate-600 rounded aspect-square flex items-center justify-center text-xs text-gray-600 dark:text-slate-400"
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateCollage}
            disabled={!uploadedImage || !cropArea || validationError !== ''}
            className="w-full px-4 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            Generate Collage
          </button>
        </div>
      )}
    </div>
  );
};
