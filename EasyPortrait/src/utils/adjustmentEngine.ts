import { AdjustmentValues } from '../types';

/**
 * Apply all photo adjustments to raw pixel data.
 * Returns a new ImageData with transformations applied.
 *
 * Pipeline order:
 *   1. Brightness (additive RGB shift)
 *   2. Contrast (scale from midpoint 128)
 *   3. Exposure (multiplicative RGB scale)
 *   4. Saturation (blend toward luminance)
 *   5. Warmth (red/blue channel shift)
 *   6. Face Lighting (radial center brightening)
 *   7. Sharpness (3×3 unsharp mask convolution)
 *   8. Clamp all values to [0, 255]
 *
 * Identity property: when all values are at their defaults (all zeros),
 * the output is pixel-identical to the input.
 */
export function applyAdjustments(
  imageData: ImageData,
  values: AdjustmentValues
): ImageData {
  const { width, height } = imageData;
  const src = imageData.data;
  const len = src.length;

  // Create a working copy of the pixel data
  const data = new Uint8ClampedArray(len);
  data.set(src);

  const {
    brightness,
    contrast,
    exposure,
    saturation,
    warmth,
    faceLighting,
    sharpness,
  } = values;

  // Quick exit: if all adjustments are at default, return a copy immediately
  const isIdentity =
    brightness === 0 &&
    contrast === 0 &&
    exposure === 0 &&
    saturation === 0 &&
    warmth === 0 &&
    faceLighting === 0 &&
    sharpness === 0;

  if (isIdentity) {
    return new ImageData(data, width, height);
  }

  // --- Per-pixel adjustments (steps 1–5) ---
  const needsBrightness = brightness !== 0;
  const needsContrast = contrast !== 0;
  const needsExposure = exposure !== 0;
  const needsSaturation = saturation !== 0;
  const needsWarmth = warmth !== 0;
  const needsFaceLighting = faceLighting !== 0;

  // Pre-compute constants
  const brightnessShift = (brightness / 100) * 255;

  const contrastMapped = (contrast * 255) / 100;
  const contrastFactor =
    (259 * (contrastMapped + 255)) / (255 * (259 - contrastMapped));

  const exposureMultiplier = Math.pow(2, exposure / 100);

  const saturationFactor = 1 + saturation / 100;

  // Face lighting geometry
  const centerX = width / 2;
  const centerY = height * 0.4;
  const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);
  const faceBrightnessFactor = (faceLighting / 100) * 80; // scale to reasonable pixel range

  for (let i = 0; i < len; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];
    // Skip alpha channel (data[i + 3])

    // Step 1: Brightness — additive RGB shift
    if (needsBrightness) {
      r += brightnessShift;
      g += brightnessShift;
      b += brightnessShift;
    }

    // Step 2: Contrast — scale from midpoint 128
    if (needsContrast) {
      r = contrastFactor * (r - 128) + 128;
      g = contrastFactor * (g - 128) + 128;
      b = contrastFactor * (b - 128) + 128;
    }

    // Step 3: Exposure — multiplicative scale
    if (needsExposure) {
      r *= exposureMultiplier;
      g *= exposureMultiplier;
      b *= exposureMultiplier;
    }

    // Step 4: Saturation — blend toward luminance
    if (needsSaturation) {
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      r = lum + (r - lum) * saturationFactor;
      g = lum + (g - lum) * saturationFactor;
      b = lum + (b - lum) * saturationFactor;
    }

    // Step 5: Warmth — red/blue channel shift
    if (needsWarmth) {
      r += warmth * 0.5;
      b -= warmth * 0.5;
    }

    // Step 6: Face Lighting — radial gradient mask
    if (needsFaceLighting) {
      const pixelIndex = i / 4;
      const px = pixelIndex % width;
      const py = Math.floor(pixelIndex / width);
      const dx = px - centerX;
      const dy = py - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy) / maxDist;
      const mask = Math.max(0, 1 - distance);
      const lightAdd = mask * faceBrightnessFactor;
      r += lightAdd;
      g += lightAdd;
      b += lightAdd;
    }

    // Clamp and handle NaN/Infinity before sharpness pass
    data[i] = clamp(r);
    data[i + 1] = clamp(g);
    data[i + 2] = clamp(b);
  }

  // Step 7: Sharpness — 3×3 unsharp mask convolution (separate pass)
  if (sharpness > 0) {
    applySharpness(data, width, height, sharpness);
  }

  return new ImageData(data, width, height);
}

/**
 * Clamp a value to [0, 255], handling NaN and Infinity.
 */
function clamp(value: number): number {
  if (!Number.isFinite(value)) return value !== value ? 0 : value > 0 ? 255 : 0;
  return Math.max(0, Math.min(255, Math.round(value)));
}

/**
 * Apply sharpness using a 3×3 unsharp mask kernel, blended with the original.
 *
 * Kernel:
 *   [  0, -1,  0 ]
 *   [ -1,  5, -1 ]
 *   [  0, -1,  0 ]
 *
 * The result is blended: output = original + (sharpened - original) * (sharpness / 100)
 */
function applySharpness(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  sharpness: number
): void {
  const amount = sharpness / 100;
  // Work on a snapshot of the pre-sharpness data so neighbor reads are consistent
  const original = new Uint8ClampedArray(data);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;

      for (let c = 0; c < 3; c++) {
        // Apply kernel
        const center = original[idx + c] * 5;
        const top = original[((y - 1) * width + x) * 4 + c];
        const bottom = original[((y + 1) * width + x) * 4 + c];
        const left = original[(y * width + (x - 1)) * 4 + c];
        const right = original[(y * width + (x + 1)) * 4 + c];

        const sharpened = center - top - bottom - left - right;

        // Blend: original + (sharpened - original) * amount
        const orig = original[idx + c];
        const blended = orig + (sharpened - orig) * amount;

        data[idx + c] = clamp(blended);
      }
      // Alpha channel untouched
    }
  }
}

/**
 * Apply adjustments to a canvas element.
 * Creates a new canvas with adjusted pixels. Returns source canvas on error.
 */
export function applyAdjustmentsToCanvas(
  sourceCanvas: HTMLCanvasElement,
  values: AdjustmentValues
): HTMLCanvasElement {
  // Get 2D context from source
  const ctx = sourceCanvas.getContext('2d');
  if (!ctx) {
    console.error('applyAdjustmentsToCanvas: Failed to get 2D context from source canvas');
    return sourceCanvas;
  }

  // Extract image data
  const imageData = ctx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);

  // Apply adjustments
  const adjusted = applyAdjustments(imageData, values);

  // Create new canvas with adjusted data
  const outputCanvas = document.createElement('canvas');
  outputCanvas.width = sourceCanvas.width;
  outputCanvas.height = sourceCanvas.height;
  const outCtx = outputCanvas.getContext('2d');
  if (!outCtx) {
    console.error('applyAdjustmentsToCanvas: Failed to get 2D context for output canvas');
    return sourceCanvas;
  }
  outCtx.putImageData(adjusted, 0, 0);

  return outputCanvas;
}

