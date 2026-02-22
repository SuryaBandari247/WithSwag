# EasyPortrait Development Guide

## Architecture Overview

EasyPortrait is a client-side web application that processes images locally in the browser. This architecture ensures:
- 🔒 Complete privacy (no server uploads)
- ⚡ Fast processing (no network latency)
- 📱 Works offline (optional PWA)
- 🆓 Minimal infrastructure costs

### Data Flow

```
User Upload → Validation → File-to-DataURL → Image Display → 
Cropping (Zoom/Pan) → Crop Calculation → High-Quality Resize → 
Canvas Rendering → Download/Export
```

## Component Structure

### Pages

- **LandingPage** - Hero section, features showcase, CTAs
- **EditorPage** - Main editing interface with workflow steps

### Components

- **ImageUpload** - Drag-drop and file selection UI
- **ImageCropper** - react-easy-crop wrapper with controls
- **PhotoPreview** - Canvas preview and download interface
- **PassportSizeSelect** - Country/standard selector
- **EditorControls** - DPI and navigation controls

### Utilities

- **imageProcessing.ts** - Core image manipulation functions:
  - `compressImage()` - Pre-process large files
  - `resizeImageHighQuality()` - Pica-based resizing
  - `cropAndResizeImage()` - Combined crop + resize
  - `calculateOptimalCrop()` - Smart aspect ratio crop
  - `downloadCanvas()` - Export with quality settings

### Constants

- **PASSPORT_SIZES** - International standard dimensions
- **DPI_OPTIONS** - Available quality levels
- **MM_TO_PX** - Unit conversion utilities

## Development Workflow

### Adding a New Passport Size

1. Edit `src/constants/index.ts`:

```typescript
export const PASSPORT_SIZES: PassportSize[] = [
  // ... existing sizes
  {
    id: 'newcountry',
    name: 'New Country',
    country: 'New Country',
    widthMm: 35,
    heightMm: 45,
  },
];
```

2. The size will automatically appear in the selector UI

### Implementing Collage Feature

Collage mode requires:

1. **Layout Calculation** - See `calculateCollageLayout()` utility
2. **Canvas Composition** - Multiple cropped images on one canvas
3. **Paper Size Support** - A4, 4×6", 5×7"

Example implementation in `EditorPage.tsx`:

```typescript
// Step 1: Get collage configuration
const collageConfig = {
  photoCount: 4,
  paperSize: 'a4',
  marginMm: 2.5,
};

// Step 2: Calculate layout
const layout = calculateCollageLayout(
  collageConfig.photoCount,
  paperSizes.a4.widthMm,
  paperSizes.a4.heightMm,
  passportSize.widthMm,
  passportSize.heightMm,
  collageConfig.marginMm
);

// Step 3: Composite images on canvas
// For each photo in collection, draw at calculated position
```

## Performance Optimization

### Current Optimizations

1. **Code Splitting** - Vite splits vendor and app code
2. **Lazy Loading** - Components loaded on demand
3. **Canvas Rendering** - Direct pixel manipulation
4. **Pica Resizing** - High-quality downsampling
5. **Image Compression** - Pre-processing large files

### Bundle Analysis

```bash
npm run build
# Check dist/ folder size
```

Target: < 500KB main JS (current ~250KB)

### Image Processing Performance

```
10MB image upload → Compress to ~2MB
2MB cropped area → Resize to final 200KB
Total process time: < 2 seconds
```

## Testing Strategy

### Unit Tests (To Implement)

```typescript
// Test dimension calculations
test('calculates optimal crop correctly', () => {
  const crop = calculateOptimalCrop(3000, 2000, 35, 45);
  expect(crop.width / crop.height).toBeCloseTo(35 / 45);
});

// Test collage layout
test('calculates collage grid correctly', () => {
  const layout = calculateCollageLayout(
    4, // photos
    210, // A4 width
    297, // A4 height
    35,  // photo width
    45,  // photo height
    2.5  // margin
  );
  expect(layout.actualCount).toBeGreaterThanOrEqual(4);
});
```

### Integration Tests

- File upload and validation
- Complete editor workflow (upload → crop → download)
- Different passport sizes
- Various image formats and sizes

### Browser Testing

- Desktop: Chrome, Firefox, Safari, Edge
- Mobile: iOS Safari, Android Chrome
- Tablet: iPad, Android tablets

## Deployment Checklist

Before production deployment:

- [ ] All TypeScript types check (`npm run type-check`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] No console errors in preview (`npm run preview`)
- [ ] Test on all target browsers
- [ ] Verify < 3s initial load time
- [ ] Check Lighthouse score > 90
- [ ] Set up SSL/HTTPS
- [ ] Configure CSP headers
- [ ] Test on mobile devices

## Environment Setup

### Required

- Node.js 18+
- npm 9+ or yarn

### Optional

- VS Code with:
  - ESLint extension
  - Tailwind CSS IntelliSense
  - TypeScript Vue Plugin

## Debugging

### Browser DevTools

1. **Elements Tab** - Inspect canvas and DOM
2. **Console Tab** - View logs and errors
3. **Network Tab** - Monitor image loads
4. **Lighthouse** - Performance audit

### React DevTools

Install React DevTools browser extension to inspect component props and state.

### Common Issues

**Canvas rendering fails:**
- Check browser console for CORS issues
- Verify image is loaded before drawing
- Ensure canvas context is obtained

**Crop area doesn't match aspect ratio:**
- Verify aspectRatio is calculated correctly
- Check that passportSize dimensions are accurate
- React-easy-crop should enforce ratio automatically

**Image looks pixelated:**
- Increase DPI setting
- Check source image resolution
- Warn user if upscaling needed

## Future Development

### Phase 2 Features

- [ ] Collage generation
- [ ] Custom dimensions
- [ ] Batch processing

### Phase 3 Features

- [ ] Webcam capture
- [ ] Face detection
- [ ] Background removal
- [ ] PWA offline support

### Phase 4 Features

- [ ] Print service integration
- [ ] Subscription model
- [ ] API for developers
- [ ] Mobile app (React Native)

## API Integration Points

When adding backend services:

1. **Analytics** - Use Plausible or Simple Analytics (privacy-friendly)
2. **Payment** - Stripe for monetization
3. **Face Detection** - TensorFlow.js (client-side) or AWS Rekognition
4. **Storage** - Only if implementing user accounts

Keep client-side processing as much as possible for privacy and performance.

## Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Easy Crop](https://github.com/ricardo-ch/react-easy-crop)
- [Pica Image Resizing](https://github.com/nodeca/pica)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

## Contributing

1. Create feature branch from `main`
2. Make changes and test thoroughly
3. Run `npm run type-check && npm run lint`
4. Submit PR with description

## License

MIT
