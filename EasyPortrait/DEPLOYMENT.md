# Deployment Guide - EasyPortrait

## Pre-Deployment Checklist

- [x] TypeScript compilation passes (`npm run type-check`)
- [x] Build completes successfully (`npm run build`)
- [x] No console errors
- [x] Responsive design tested
- [x] All links functional
- [x] Download functionality works
- [x] Privacy claims verified

## Deployment Options

### Option 1: Vercel (Recommended)

**Why Vercel?**
- Automatic deployments from GitHub
- Edge network for fast content delivery
- Generous free tier
- Great DX for React/Next.js projects
- Automatic SSL/HTTPS

**Steps:**

1. Push code to GitHub (if not already)
```bash
git init
git add .
git commit -m "Initial commit: EasyPortrait MVP"
git remote add origin https://github.com/YOUR_USERNAME/easyportrait.git
git push -u origin main
```

2. Install and deploy with Vercel
```bash
npm install -g vercel
vercel
```

3. Follow the interactive prompts
```
? Set up and deploy? Yes
? Which scope? (your account)
? Link to existing project? No
? Project name? easyportrait
? Directory? ./
```

4. Configure domain
```
vercel env add API_URL
vercel domains add easyportrait.app
```

**Automatic Deployments:**
- Every push to main → staging deployment
- Create PR → preview URL generated automatically

---

### Option 2: Netlify

**Why Netlify?**
- Generous free tier
- Simple deployment from GitHub
- Built-in analytics
- Fast CDN
- Form handling (future use)

**Steps:**

1. Build locally
```bash
npm run build
```

2. Go to [netlify.com](https://netlify.com)

3. Connect GitHub repository
   - Click "New site from Git"
   - Authorize GitHub
   - Select `easyportrait` repository

4. Configure build settings
   - Build command: `npm run build`
   - Publish directory: `dist`

5. Deploy
   - Click "Deploy site"
   - Wait for build to complete

**Custom Domain:**
- Go to Domain settings
- Add your custom domain
- Follow DNS configuration

---

### Option 3: GitHub Pages

**Why GitHub Pages?**
- Free hosting
- Simple for static sites
- GitHub integration
- Custom domain support

**Setup:**

1. Update vite.config.ts
```typescript
export default defineConfig({
  base: '/easyportrait/',  // if using project repo
  // ... rest of config
});
```

2. Build and push to gh-pages
```bash
npm run build
gh-pages -d dist  # requires: npm install --save-dev gh-pages
```

3. Enable Pages
   - Go to repository Settings
   - GitHub Pages section
   - Select `gh-pages` branch

---

### Option 4: Self-Hosted (Docker)

**Dockerfile example:**
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**
```nginx
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }
}
```

---

## Post-Deployment Configuration

### 1. Security Headers

Add to your hosting provider's configuration:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

**For Vercel:** Add `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/:path*",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

### 2. Content Security Policy (CSP)

Recommended CSP header:
```
default-src 'self';
script-src 'self' 'wasm-unsafe-eval';
style-src 'self' 'unsafe-inline';
img-src 'self' data: blob:;
font-src 'self';
connect-src 'self';
frame-ancestors 'none';
```

### 3. HTTPS/SSL

- ✅ Vercel: Automatic
- ✅ Netlify: Automatic
- ✅ GitHub Pages: Automatic
- For self-hosted: Use Let's Encrypt (certbot)

### 4. Custom Domain Setup

**For easyportrait.app:**

1. Register domain (Namecheap, Route53, etc.)
2. Add DNS records:
   ```
   Type: CNAME
   Name: @
   Value: (provided by hosting provider)
   ```
3. Wait for DNS propagation (5-30 minutes)
4. Enable SSL/HTTPS

---

## Environment Variables (Optional)

**Create `.env.production`:**
```env
VITE_APP_TITLE=EasyPortrait
VITE_API_ENDPOINT=https://api.easyportrait.app  # for future backend
```

**Use in code:**
```typescript
const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
```

---

## Performance Optimization

### Before Deployment

1. **Lighthouse Audit**
   ```bash
   npm run build
   npm run preview
   # Open in Chrome DevTools → Lighthouse
   ```

2. **Bundle Analysis**
   ```bash
   npm install -g webpack-bundle-analyzer
   npm run build
   ```

3. **Check Build Size**
   ```bash
   du -sh dist/
   # Should be < 500KB total
   ```

### Deployment Optimizations

- ✅ Enable gzip compression (automatic on Vercel/Netlify)
- ✅ Set appropriate cache headers
- ✅ Use CDN for assets
- ✅ Enable brotli compression (if supported)

---

## Monitoring & Analytics

### Optional: Privacy-Respecting Analytics

**Plausible Analytics:**
1. Sign up at [plausible.io](https://plausible.io)
2. Add domain
3. Add script to `index.html`:
```html
<script defer data-domain="easyportrait.app" src="https://plausible.io/js/script.js"></script>
```

**Simple Analytics:**
- Similar setup
- No consent required in EU
- Website: [simpleanalytics.com](https://simpleanalytics.com)

### Sentry (Error Tracking)

```bash
npm install @sentry/react @sentry/tracing
```

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production",
  tracesSampleRate: 0.1,
});
```

---

## Rollback Strategy

### If something breaks:

**Vercel:**
```bash
vercel rollback
```

**Netlify:**
- Go to Deploys section
- Click previous successful deploy
- Click "Publish deploy"

**GitHub Pages:**
```bash
git revert HEAD  # or reset to previous commit
git push
```

---

## Monitoring Post-Deployment

### Daily Checks

- [ ] Site loads without errors
- [ ] Image uploads work
- [ ] Download functionality works
- [ ] Responsive on mobile/desktop
- [ ] No console errors

### Weekly Checks

- [ ] Check analytics (if enabled)
- [ ] Review error logs
- [ ] Check performance metrics
- [ ] Verify security headers

### Monthly Checks

- [ ] Update dependencies: `npm update`
- [ ] Run security audit: `npm audit`
- [ ] Review Lighthouse score
- [ ] Backup any user data

---

## Troubleshooting Deployment

### 404 Error on Refresh
**Solution:** Configure server to redirect all routes to index.html

**Vercel:** Automatic
**Netlify:** Add `netlify.toml`:
```toml
[[redirects]]
from = "/*"
to = "/index.html"
status = 200
```

### Images Not Loading
- Check CORS settings
- Verify image paths are relative
- Check browser console for errors

### Slow Performance
- Run Lighthouse audit
- Check bundle size
- Enable gzip compression
- Consider CDN

### Build Fails
```bash
npm ci  # instead of npm install
npm run build
# Check for errors in output
```

---

## Domain & Email Setup (Optional)

### Custom Domain Email

**For professional appearance:**

1. **Gmail with custom domain** (recommended)
   - Go to Google Workspace
   - Set up custom email forwarding

2. **Send email from contact form**
   - Use Formspree, Getform, or similar
   - Add form to contact page (future)

---

## Legal Compliance

Before launch, ensure:

- [ ] Privacy Policy created
- [ ] Terms of Service reviewed
- [ ] Disclaimer about photo acceptance
- [ ] Cookie policy (if using analytics)
- [ ] GDPR compliance verified

---

## Launch Checklist

- [ ] Domain registered and configured
- [ ] SSL/HTTPS working
- [ ] Build passes all checks
- [ ] Site tested on mobile/desktop
- [ ] Performance score > 90
- [ ] Security headers configured
- [ ] Analytics configured (optional)
- [ ] Error tracking set up (optional)
- [ ] Social media links added
- [ ] Email configured
- [ ] Documentation updated

---

## Support & Monitoring

After deployment:
- Monitor error logs daily first week
- Gather user feedback
- Track key metrics (users, conversions)
- Plan next phase features
- Collect usage statistics

---

**Deployment Estimated Time: 5-10 minutes**
**Total Cost: $0-5/month (depending on option)**
**Maintenance Time: 30 minutes/month**
