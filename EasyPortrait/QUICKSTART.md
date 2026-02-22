# EasyPortrait - Quick Start Guide

## 🚀 Get Started in 2 Minutes

### 1. Install Dependencies
```bash
cd /Users/taabasu5/parasmile/EasyPortrait
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Opens automatically at `http://localhost:5173`

### 3. Build for Production
```bash
npm run build
```
Output: `dist/` folder ready to deploy

---

## 📋 Available Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Create optimized production build |
| `npm run preview` | Preview production build locally |
| `npm run type-check` | Check TypeScript types |
| `npm run lint` | Check code quality with ESLint |

---

## 📁 Project Structure at a Glance

```
src/
├── pages/              # Landing page & Editor
├── components/         # Reusable UI components
├── utils/              # Image processing functions
├── constants/          # Passport sizes, DPI options
└── types/              # TypeScript interfaces
```

---

## 🎯 Key Features Implemented

✅ Landing page with features showcase
✅ Single photo passport creation
✅ Image upload (drag-drop)
✅ Smart cropping interface
✅ 8 country presets
✅ Quality settings (DPI)
✅ PNG/JPG download
✅ Mobile-responsive design
✅ Type-safe with TypeScript

---

## 🌐 Deploy to Production

### Option 1: Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Option 2: Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

### Option 3: GitHub Pages
```bash
npm run build
# Push dist/ to gh-pages branch
```

---

## 📚 Documentation

- **User Guide**: See [README.md](./README.md)
- **Developer Guide**: See [DEVELOPMENT.md](./DEVELOPMENT.md)
- **Project Details**: See [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)

---

## 🔧 Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **react-easy-crop** - Image cropping

---

## ✨ What's Included

### ✅ Complete
- Landing page
- Editor with upload, crop, preview
- Image processing utilities
- Responsive design
- Type definitions

### 📋 Next Phase
- Collage functionality
- More custom options
- Webcam capture
- Face detection

---

## 🐛 Troubleshooting

### Port 5173 already in use?
```bash
npm run dev -- --port 3000
```

### Build fails?
```bash
npm cache clean --force
rm -rf node_modules
npm install
npm run build
```

### TypeScript errors?
```bash
npm run type-check
```

---

## 📞 Need Help?

1. Check [DEVELOPMENT.md](./DEVELOPMENT.md) for technical details
2. Review component documentation
3. Check browser console for errors
4. Verify Node.js version: `node --version` (needs 18+)

---

**Ready to start? Run `npm run dev` and open http://localhost:5173!**
