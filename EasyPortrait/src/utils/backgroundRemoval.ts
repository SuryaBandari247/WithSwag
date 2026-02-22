import { removeBackground } from '@imgly/background-removal';

// Cache the transparent image blob so we don't re-process for each color change
let cachedTransparentBlob: Blob | null = null;
let cachedSourceKey: string = '';

/**
 * Remove the background from an image and return a transparent PNG blob.
 * Results are cached so changing colors doesn't re-run the AI model.
 */
export async function getTransparentImage(
  imageSrc: string,
  cropArea: { x: number; y: number; width: number; height: number },
  onProgress?: (progress: number) => void
): Promise<Blob> {
  // Create a cache key from crop params
  const key = `${imageSrc.slice(-40)}_${cropArea.x}_${cropArea.y}_${cropArea.width}_${cropArea.height}`;

  if (cachedSourceKey === key && cachedTransparentBlob) {
    return cachedTransparentBlob;
  }

  // First crop the source image to the crop area
  const croppedBlob = await cropImageToBlob(imageSrc, cropArea);

  // Run background removal on the cropped image
  const config = {
    progress: (_key: string, current: number, total: number) => {
      if (onProgress && total > 0) {
        onProgress(current / total);
      }
    },
    output: {
      format: 'image/png' as const,
      quality: 1,
    },
  };

  const result = await removeBackground(croppedBlob, config);

  cachedTransparentBlob = result;
  cachedSourceKey = key;

  return result;
}

/**
 * Crop source image and return as a Blob
 */
function cropImageToBlob(
  imageSrc: string,
  cropArea: { x: number; y: number; width: number; height: number }
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = cropArea.width;
      canvas.height = cropArea.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      ctx.drawImage(
        img,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        0,
        0,
        cropArea.width,
        cropArea.height
      );
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to create blob'));
        },
        'image/png'
      );
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageSrc;
  });
}

/**
 * Composite a transparent image on top of a colored background.
 * Returns a data URL of the final image.
 */
export function compositeWithBackground(
  transparentImageUrl: string,
  bgColor: string,
  width: number,
  height: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      // Fill background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);
      // Draw transparent image on top
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error('Failed to load transparent image'));
    img.src = transparentImageUrl;
  });
}

/**
 * Clear the cached transparent image (call when user uploads a new photo)
 */
export function clearBgRemovalCache() {
  cachedTransparentBlob = null;
  cachedSourceKey = '';
}
