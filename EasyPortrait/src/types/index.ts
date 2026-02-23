export interface PassportSize {
  id: string;
  name: string;
  country: string;
  widthMm: number;
  heightMm: number;
  widthInch?: number;
  heightInch?: number;
}

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface EditorState {
  photoType: 'single' | 'collage' | null;
  uploadedImage: string | null;
  cropArea: CropArea | null;
  selectedPassportSize: PassportSize | null;
  dpi: number;
}

export interface CollageConfig {
  photoCount: number;
  paperSize: string;
  marginMm: number;
  layout: {
    cols: number;
    rows: number;
  };
}

import type { LucideIcon } from 'lucide-react';

export interface AdjustmentValues {
  brightness: number;   // Range: -100 to +100, default: 0
  contrast: number;     // Range: -100 to +100, default: 0
  saturation: number;   // Range: -100 to +100, default: 0
  exposure: number;     // Range: -100 to +100, default: 0
  warmth: number;       // Range: -100 to +100, default: 0
  sharpness: number;    // Range: 0 to +100, default: 0
  faceLighting: number; // Range: 0 to +100, default: 0
}

export interface AdjustmentSliderConfig {
  key: keyof AdjustmentValues;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  icon: LucideIcon;
}
