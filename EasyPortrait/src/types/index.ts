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
