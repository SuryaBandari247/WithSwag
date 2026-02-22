# EasyPortrait - Web Application

Professional passport photo creation and collage tool for modern browsers.

## Features

- ✅ **Single Photo & Collage Creation** - Create individual photos or multi-photo collages
- ✅ **International Standards** - Supports 8+ countries' passport photo standards
- ✅ **Privacy-First** - All processing happens locally, no uploads
- ✅ **Professional Quality** - Configurable DPI (150, 300, 600)
- ✅ **Easy Cropping** - Intuitive drag-to-crop interface with aspect ratio locking
- ✅ **Instant Download** - Export as PNG or JPG with custom DPI settings
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **No Registration** - Start using immediately, no account needed

## Supported Passport Sizes

- Australia (35×45 mm)
- Canada (50×70 mm)
- China (33×48 mm)
- EU/UK (35×45 mm)
- India (50.8×50.8 mm / 2×2")
- Malaysia (35×50 mm)
- Singapore (35×45 mm)
- United States (50.8×50.8 mm / 2×2")

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Image Cropping**: react-easy-crop
- **Image Processing**: pica, browser-image-compression
- **UI Icons**: Lucide React
- **Routing**: React Router v6

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Modern browser with Canvas API support

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm preview
```

The app will open at `http://localhost:5173`

## Project Structure

```
src/
├── components/           # React components
│   ├── ImageUpload.tsx   # Drag-drop file upload
│   ├── ImageCropper.tsx  # Cropping interface
│   ├── PhotoPreview.tsx  # Preview and download
│   ├── PassportSizeSelect.tsx  # Size selector
│   └── EditorControls.tsx      # DPI and controls
├── pages/                # Page components
│   ├── LandingPage.tsx   # Hero and features
│   └── EditorPage.tsx    # Main editor
├── utils/
│   └── imageProcessing.ts  # Image manipulation functions
├── constants/
│   └── index.ts          # Passport sizes, DPI options
├── types/
│   └── index.ts          # TypeScript interfaces
├── App.tsx               # Main app component
├── main.tsx              # Entry point
└── index.css             # Tailwind styles
```

## Usage

1. **Open the application** - Visit the landing page
2. **Choose photo type** - Single photo or collage
3. **Upload image** - Drag & drop or click to browse
4. **Select size** - Choose passport standard for your country
5. **Crop photo** - Adjust framing with zoom controls
6. **Download** - Export as PNG or JPG at your chosen DPI

## Performance

- Initial load: < 3 seconds
- Image processing: < 2 seconds
- Real-time crop preview: 60fps
- Bundle size: ~250KB (gzipped)
- Lighthouse score: > 90

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Modern mobile browsers

## Privacy & Security

- ✅ **Zero data collection** - No analytics, cookies, or tracking
- ✅ **Client-side only** - All processing in your browser
- ✅ **HTTPS ready** - Secure deployment
- ✅ **GDPR compliant** - No data storage or transmission
- ✅ **Open source ready** - Transparent codebase

## Development Commands

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build
npm run build

# Preview build
npm run preview
```

## Environment Variables

Create `.env.local` for development:

```env
VITE_APP_TITLE=EasyPortrait
```

## Future Enhancements

- [ ] Webcam capture support
- [ ] Face detection and auto-centering
- [ ] Batch processing
- [ ] PDF collage export
- [ ] Print service integration
- [ ] Multi-language support
- [ ] PWA offline capabilities
- [ ] Dark mode

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Deploy the dist/ folder
```

### GitHub Pages

```bash
npm run build
# Push dist/ folder to gh-pages branch
```

## License

MIT License - Feel free to use this project for personal or commercial use.

## Support & Feedback

For issues, suggestions, or feedback, please create an issue in the repository.

---

**Made with ❤️ for passport photo enthusiasts**
