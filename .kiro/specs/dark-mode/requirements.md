# Requirements Document

## Introduction

This feature adds dark mode support to the WithSwag platform, covering both the EasyPortrait React app and the SRT Editor static app. Dark mode is purely driven by the browser/OS `prefers-color-scheme` media query. There is no manual toggle or persisted theme preference. The app inherits the user's system setting at all times and reacts in real-time when the OS setting changes.

## Glossary

- **Dark_Palette**: The set of background, surface, text, border, and accent colors used when dark mode is active.
- **Light_Palette**: The existing set of colors used when light mode is active (current default).
- **System_Preference**: The operating system-level `prefers-color-scheme` media query value (`light` or `dark`).
- **EasyPortrait_App**: The React/TypeScript application at `/portrait/` using Tailwind CSS.
- **SRT_Editor_App**: The static HTML/CSS/JS application at `/srt-editor/`.
- **Navigation_Components**: The shared AppSwitcher, Home Button, and Breadcrumbs present in both apps.

## Requirements

### Requirement 1: Theme Detection and Real-Time Response

**User Story:** As a user, I want the app to automatically match my operating system's color scheme at all times, so that the interface feels native without any manual configuration.

#### Acceptance Criteria

1. THE EasyPortrait_App SHALL apply the Dark_Palette when the user's System_Preference is `dark` and the Light_Palette when the System_Preference is `light`.
2. THE SRT_Editor_App SHALL apply the Dark_Palette when the user's System_Preference is `dark` and the Light_Palette when the System_Preference is `light`.
3. WHEN the user changes the System_Preference while a WithSwag app is open, THE app SHALL update the active palette in real-time without requiring a page reload.
4. THE EasyPortrait_App SHALL use the Tailwind CSS `dark:` variant with `media` strategy to apply dark styles based on the `prefers-color-scheme` media query.
5. THE SRT_Editor_App SHALL use the CSS `@media (prefers-color-scheme: dark)` media query to apply dark styles.

### Requirement 2: Dark Palette for EasyPortrait App

**User Story:** As a user, I want the EasyPortrait app to have a well-designed dark theme, so that I can comfortably use it in low-light environments.

#### Acceptance Criteria

1. WHILE dark mode is active, THE EasyPortrait_App SHALL use a dark background color (e.g., `#0f172a` or Tailwind `slate-900`) for the page body instead of the light gradient.
2. WHILE dark mode is active, THE EasyPortrait_App SHALL render card surfaces with a dark surface color (e.g., `#1e293b` or Tailwind `slate-800`) instead of white.
3. WHILE dark mode is active, THE EasyPortrait_App SHALL render primary text in a light color (e.g., `#f1f5f9` or Tailwind `slate-100`) instead of dark gray.
4. WHILE dark mode is active, THE EasyPortrait_App SHALL render secondary/muted text in a medium-light color (e.g., `#94a3b8` or Tailwind `slate-400`).
5. WHILE dark mode is active, THE EasyPortrait_App SHALL render borders using a dark border color (e.g., `#334155` or Tailwind `slate-700`) instead of light gray.
6. WHILE dark mode is active, THE EasyPortrait_App SHALL maintain the indigo primary accent color (`#6366f1`) with sufficient contrast against dark surfaces.
7. WHILE dark mode is active, THE EasyPortrait_App navigation bar SHALL use a dark semi-transparent background with backdrop blur instead of the white semi-transparent background.

### Requirement 3: Dark Palette for SRT Editor App

**User Story:** As a user, I want the SRT Editor to have a matching dark theme, so that the experience is consistent across WithSwag tools.

#### Acceptance Criteria

1. WHILE dark mode is active, THE SRT_Editor_App SHALL use a dark background color for the page body instead of the light blue-to-purple gradient.
2. WHILE dark mode is active, THE SRT_Editor_App SHALL render the header with a dark semi-transparent background and dark border instead of the white semi-transparent background.
3. WHILE dark mode is active, THE SRT_Editor_App SHALL render card and panel surfaces (import area, tool cards, subtitle items, editor section, SEO content) with a dark surface color instead of white.
4. WHILE dark mode is active, THE SRT_Editor_App SHALL render text inputs, textareas, and select elements with dark backgrounds, light text, and dark borders.
5. WHILE dark mode is active, THE SRT_Editor_App SHALL render primary text in a light color and secondary text in a medium-light color.
6. WHILE dark mode is active, THE SRT_Editor_App SHALL maintain the indigo/purple gradient accent colors for primary action buttons with sufficient contrast.
7. WHILE dark mode is active, THE SRT_Editor_App SHALL render the modal overlay and modal content with dark surface colors and light text.

### Requirement 4: Dark Mode for Navigation Components

**User Story:** As a user, I want the shared navigation elements (AppSwitcher, Breadcrumbs) to adapt to dark mode, so that they remain readable and visually consistent.

#### Acceptance Criteria

1. WHILE dark mode is active, THE Navigation_Components AppSwitcher button SHALL use a dark surface background with light icon color instead of the white background.
2. WHILE dark mode is active, THE Navigation_Components AppSwitcher dropdown SHALL use a dark surface background, dark borders, and light text.
3. WHILE dark mode is active, THE Navigation_Components AppSwitcher dropdown items SHALL use a dark hover background (e.g., indigo-900/50) instead of indigo-50.
4. WHILE dark mode is active, THE Navigation_Components Breadcrumbs SHALL render link text in a medium-light color and the current page text in a light color.
5. WHILE dark mode is active, THE Navigation_Components mobile bottom sheet SHALL use a dark surface background with light text.

### Requirement 5: Accessibility and Contrast

**User Story:** As a user with visual needs, I want the dark mode to maintain readable contrast ratios, so that all content remains accessible.

#### Acceptance Criteria

1. WHILE dark mode is active, THE EasyPortrait_App and SRT_Editor_App SHALL maintain a minimum contrast ratio of 4.5:1 between body text and its background.
2. WHILE dark mode is active, THE EasyPortrait_App and SRT_Editor_App SHALL maintain a minimum contrast ratio of 3:1 between large text (18px+ or 14px+ bold) and its background.
3. WHILE dark mode is active, THE Navigation_Components SHALL maintain sufficient contrast for all interactive elements against dark surfaces.
