import { CropArea, PassportSize } from '../types';
import { MM_TO_PX, DEFAULT_DPI, INCH_TO_MM } from '../constants';

export const compressImage = async (file: File, maxSizeMB: number = 10): Promise<File> => {
  const { default: imageCompression } = await import('browser-image-compression');
  
  const options = {
    maxSizeMB,
    maxWidthOrHeight: 4096,
    useWebWorker: true,
  };

  return await imageCompression(file, options);
};

export const resizeImageHighQuality = async (
  canvas: HTMLCanvasElement,
  targetWidth: number,
  targetHeight: number,
  dpi: number = DEFAULT_DPI
): Promise<HTMLCanvasElement> => {
  // Use browser's native canvas resizing with high-quality settings
  const resizeCanvas = document.createElement('canvas');
  resizeCanvas.width = targetWidth;
  resizeCanvas.height = targetHeight;

  const ctx = resizeCanvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');

  // Use imageSmoothingEnabled for high-quality downsampling
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  
  ctx.drawImage(canvas, 0, 0, targetWidth, targetHeight);
  return resizeCanvas;
};

export const calculateOptimalCrop = (
  imageWidth: number,
  imageHeight: number,
  photoWidth: number,
  photoHeight: number
): CropArea => {
  const imageAspect = imageWidth / imageHeight;
  const photoAspect = photoWidth / photoHeight;

  let cropWidth = imageWidth;
  let cropHeight = imageHeight;

  if (imageAspect > photoAspect) {
    // Image is wider than photo
    cropWidth = imageHeight * photoAspect;
  } else {
    // Image is taller than photo
    cropHeight = imageWidth / photoAspect;
  }

  return {
    x: (imageWidth - cropWidth) / 2,
    y: (imageHeight - cropHeight) / 2,
    width: cropWidth,
    height: cropHeight,
  };
};

export const cropAndResizeImage = async (
  sourceCanvas: HTMLCanvasElement,
  cropArea: CropArea,
  targetSizeMm: { width: number; height: number },
  dpi: number = DEFAULT_DPI
): Promise<HTMLCanvasElement> => {
  const targetWidthPx = MM_TO_PX(targetSizeMm.width, dpi);
  const targetHeightPx = MM_TO_PX(targetSizeMm.height, dpi);

  // Create intermediate canvas for cropping
  const cropCanvas = document.createElement('canvas');
  const ctx = cropCanvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');

  cropCanvas.width = cropArea.width;
  cropCanvas.height = cropArea.height;

  ctx.drawImage(
    sourceCanvas,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    cropArea.width,
    cropArea.height
  );

  // Resize using high-quality method
  return await resizeImageHighQuality(cropCanvas, targetWidthPx, targetHeightPx, dpi);
};

export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const downloadCanvas = (
  canvas: HTMLCanvasElement,
  filename: string = 'passport-photo.png',
  format: 'png' | 'jpg' = 'png'
): void => {
  const link = document.createElement('a');
  const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
  const quality = format === 'jpg' ? 0.95 : undefined;

  canvas.toBlob(
    (blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    },
    mimeType,
    quality
  );
};

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 10MB limit' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Please upload JPG, PNG, or WEBP image' };
  }

  return { valid: true };
};

export const calculateCollageLayout = (
  photoCount: number,
  paperWidth: number,
  paperHeight: number,
  photoWidth: number,
  photoHeight: number,
  marginMm: number
) => {
  // Calculate how many photos can fit
  const photoWidthWithMargin = photoWidth + marginMm;
  const photoHeightWithMargin = photoHeight + marginMm;

  let cols = Math.floor(paperWidth / photoWidthWithMargin);
  let rows = Math.floor(paperHeight / photoHeightWithMargin);

  // If we can't fit even one photo, adjust
  if (cols === 0) cols = 1;
  if (rows === 0) rows = 1;

  const actualCount = cols * rows;

  return {
    cols,
    rows,
    actualCount,
    canFit: actualCount >= photoCount,
  };
};
