import { PassportSize, AdjustmentValues, AdjustmentSliderConfig } from '../types';
import { Sun, Contrast, Palette, Aperture, Thermometer, Focus, Lightbulb } from 'lucide-react';

export const PASSPORT_SIZES: PassportSize[] = [
  {
    id: 'australia',
    name: 'Australia',
    country: 'Australia',
    widthMm: 35,
    heightMm: 45,
  },
  {
    id: 'canada',
    name: 'Canada',
    country: 'Canada',
    widthMm: 50,
    heightMm: 70,
  },
  {
    id: 'china',
    name: 'China',
    country: 'China',
    widthMm: 33,
    heightMm: 48,
  },
  {
    id: 'eu',
    name: 'EU/UK',
    country: 'European Union & UK',
    widthMm: 35,
    heightMm: 45,
  },
  {
    id: 'india',
    name: 'India',
    country: 'India',
    widthMm: 50.8,
    heightMm: 50.8,
    widthInch: 2,
    heightInch: 2,
  },
  {
    id: 'malaysia',
    name: 'Malaysia',
    country: 'Malaysia',
    widthMm: 35,
    heightMm: 50,
  },
  {
    id: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    widthMm: 35,
    heightMm: 45,
  },
  {
    id: 'us',
    name: 'United States',
    country: 'United States',
    widthMm: 50.8,
    heightMm: 50.8,
    widthInch: 2,
    heightInch: 2,
  },
];

export const PAPER_SIZES = {
  a4: { widthMm: 210, heightMm: 297, name: 'A4' },
  '4x6': { widthInch: 4, heightInch: 6, widthMm: 101.6, heightMm: 152.4, name: '4×6"' },
  '5x7': { widthInch: 5, heightInch: 7, widthMm: 127, heightMm: 177.8, name: '5×7"' },
};

export const DPI_OPTIONS = [150, 300, 600];
export const DEFAULT_DPI = 300;
export const DEFAULT_MARGIN_MM = 2.5;

export const MM_TO_INCH = 0.0393701;
export const INCH_TO_MM = 25.4;
export const MM_TO_PX = (mm: number, dpi: number = DEFAULT_DPI) => {
  return (mm / MM_TO_INCH) * (dpi / 72);
};

export const PX_TO_MM = (px: number, dpi: number = DEFAULT_DPI) => {
  return px * MM_TO_INCH * (72 / dpi);
};

export const DEFAULT_ADJUSTMENT_VALUES: AdjustmentValues = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  exposure: 0,
  warmth: 0,
  sharpness: 0,
  faceLighting: 0,
};

export const ADJUSTMENT_SLIDERS: AdjustmentSliderConfig[] = [
  { key: 'brightness',   label: 'Brightness',    min: -100, max: 100, step: 1, defaultValue: 0, icon: Sun },
  { key: 'contrast',     label: 'Contrast',      min: -100, max: 100, step: 1, defaultValue: 0, icon: Contrast },
  { key: 'saturation',   label: 'Saturation',    min: -100, max: 100, step: 1, defaultValue: 0, icon: Palette },
  { key: 'exposure',     label: 'Exposure',      min: -100, max: 100, step: 1, defaultValue: 0, icon: Aperture },
  { key: 'warmth',       label: 'Warmth',        min: -100, max: 100, step: 1, defaultValue: 0, icon: Thermometer },
  { key: 'sharpness',    label: 'Sharpness',     min: 0,    max: 100, step: 1, defaultValue: 0, icon: Focus },
  { key: 'faceLighting', label: 'Face Lighting',  min: 0,    max: 100, step: 1, defaultValue: 0, icon: Lightbulb },
];

export const ADJUSTMENT_DEBOUNCE_MS = 150;
