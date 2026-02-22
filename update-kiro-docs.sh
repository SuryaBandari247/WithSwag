#!/bin/bash

cd /Users/taabasu5/parasmile/withswag/.kiro/steering

# Update ADDING_NEW_TOOL.md with UI guidelines
cat >> ADDING_NEW_TOOL.md << 'EOF'

## UI/UX Guidelines

### Home Button (Required)

Every tool MUST include a home button that links back to the landing page (`/`).

#### For Static Tools (HTML/CSS):

Add this HTML in the header:
```html
<a href="/" class="home-btn" title="Back to WithSwag Home">🏠</a>
```

Add this CSS:
```css
/* Home Button */
.home-btn {
    position: absolute;
    top: 20px;
    left: 20px;
    font-size: 24px;
    text-decoration: none;
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    transition: all 0.2s;
    z-index: 100;
}

.home-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
}

@media (max-width: 768px) {
    .home-btn {
        top: 10px;
        left: 10px;
        font-size: 20px;
        padding: 6px 10px;
    }
}
```

#### For React Apps:

Add this component at the top of your main page/layout:
```tsx
<a 
  href="/" 
  className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 text-gray-700 hover:text-indigo-600 font-medium"
>
  <span className="text-xl">🏠</span>
  <span className="hidden sm:inline">Home</span>
</a>
```

### Color Palette & Design System

All tools should follow the WithSwag design system for consistency:

#### Primary Colors
- **Primary**: `#6366f1` (Indigo) - Main brand color
- **Primary Hover**: `#4f46e5` (Darker indigo)
- **Secondary**: `#8b5cf6` (Purple)
- **Accent**: `#d946ef` (Pink)

#### Background Colors
- **Light Background**: `#f8f9fa` or `#f3f4f6`
- **White**: `#ffffff`
- **Gradient**: `linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)`

#### Text Colors
- **Primary Text**: `#1a1a1a` or `#111827`
- **Secondary Text**: `#666666` or `#6b7280`
- **Light Text**: `#9ca3af`

#### UI Elements
- **Border Radius**: `8px` for buttons, `16px` for cards
- **Shadows**: 
  - Small: `0 2px 8px rgba(0,0,0,0.1)`
  - Medium: `0 4px 16px rgba(0,0,0,0.15)`
  - Large: `0 12px 40px rgba(0,0,0,0.25)`
- **Transitions**: `all 0.2s` or `all 0.3s ease`

#### Typography
- **Font Family**: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Headings**: Bold (700), sizes: 48px (h1), 32px (h2), 24px (h3)
- **Body**: Regular (400), 16px
- **Small**: 14px

#### Buttons
```css
/* Primary Button */
.action-btn {
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.2s;
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
}

.action-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(99, 102, 241, 0.6);
}

/* Secondary Button */
.secondary-btn {
    background: white;
    color: #6366f1;
    border: 2px solid #6366f1;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.2s;
}

.secondary-btn:hover {
    background: #6366f1;
    color: white;
}
```

#### Cards
```css
.tool-card {
    background: white;
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    transition: transform 0.2s, box-shadow 0.2s;
}

.tool-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.25);
}
```

### Responsive Design

All tools must be mobile-responsive:
- Use `max-width: 768px` for mobile breakpoint
- Stack elements vertically on mobile
- Adjust font sizes and padding for smaller screens
- Ensure touch targets are at least 44x44px

### Accessibility

- Use semantic HTML elements
- Include proper ARIA labels
- Ensure sufficient color contrast (WCAG AA minimum)
- Support keyboard navigation
- Include focus states for interactive elements

### Example Implementation

See existing tools for reference:
- **SRT Editor**: Static HTML/CSS with gradient background
- **EasyPortrait**: React app with Tailwind CSS

Both follow the design system and include home buttons.
EOF

echo "✅ Updated ADDING_NEW_TOOL.md with UI/UX guidelines"

# Commit the changes
cd /Users/taabasu5/parasmile/withswag
git add .kiro/steering/ADDING_NEW_TOOL.md
git commit -m "Add UI/UX guidelines and home button requirements to documentation"
git push origin main

echo "✅ Changes committed and pushed!"
