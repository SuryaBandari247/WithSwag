# Implementation Plan: Dark Mode

## Overview

Add automatic dark mode support to the WithSwag platform using CSS `prefers-color-scheme` media query. EasyPortrait uses Tailwind's `dark:` variant with `media` strategy. SRT Editor uses a `@media (prefers-color-scheme: dark)` CSS block. No JavaScript toggle, no localStorage — purely CSS-driven.

## Tasks

- [x] 1. Configure Tailwind dark mode and update EasyPortrait pages
  - [x] 1.1 Add `darkMode: 'media'` to `EasyPortrait/tailwind.config.cjs`
    - Add `darkMode: 'media'` property to the module.exports object
    - This enables all `dark:` variant classes to respond to `prefers-color-scheme: dark`
    - _Requirements: 1.1, 1.4_

  - [x] 1.2 Add dark mode classes to `LandingPage.tsx`
    - Replace light gradient background with `dark:bg-slate-900`
    - Update nav bar: `dark:bg-slate-900/80 dark:border-slate-700`
    - Update cards: `dark:bg-slate-800 dark:border-slate-700`
    - Update primary text: `dark:text-slate-100`
    - Update secondary text: `dark:text-slate-400`
    - Update borders: `dark:border-slate-700`
    - Keep indigo accent color unchanged
    - _Requirements: 1.1, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

  - [x] 1.3 Add dark mode classes to `EditorPage.tsx`
    - Update body background: `dark:bg-slate-900`
    - Update header: `dark:bg-slate-800 dark:border-slate-700`
    - Update step pills: `dark:bg-slate-700` (active unchanged)
    - Update sidebar cards: `dark:bg-slate-800 dark:border-slate-700`
    - Update all text colors for dark mode
    - _Requirements: 1.1, 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 2. Update EasyPortrait navigation components for dark mode
  - [x] 2.1 Add dark mode classes to `AppSwitcher.tsx`
    - Button: `dark:bg-slate-800/90 dark:text-slate-300`
    - Dropdown: `dark:bg-slate-800 dark:border-slate-700`
    - Dropdown items hover: `dark:hover:bg-indigo-900/50`
    - Mobile bottom sheet: `dark:bg-slate-800`
    - Header text: `dark:text-slate-100`
    - Item text: `dark:text-slate-100`, description: `dark:text-slate-400`
    - _Requirements: 4.1, 4.2, 4.3, 4.5_

  - [x] 2.2 Add dark mode classes to `Breadcrumbs.tsx`
    - Links: `dark:text-slate-400 dark:hover:text-indigo-400`
    - Current page: `dark:text-slate-100`
    - Separator: `dark:text-slate-600`
    - _Requirements: 4.4_

- [x] 3. Checkpoint - Verify EasyPortrait pages and navigation render correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Update EasyPortrait editor components for dark mode
  - [x] 4.1 Add dark mode classes to `ImageUpload.tsx`
    - Drop zone: `dark:bg-slate-800 dark:border-slate-600`
    - Text: `dark:text-slate-300`
    - _Requirements: 2.2, 2.3_

  - [x] 4.2 Add dark mode classes to `PhotoPreview.tsx`
    - Container: `dark:bg-slate-800 dark:border-slate-700`
    - _Requirements: 2.2, 2.5_

  - [x] 4.3 Add dark mode classes to `PassportSizeSelect.tsx`
    - List container: `dark:bg-slate-800 dark:border-slate-700`
    - Items: `dark:text-slate-300 dark:hover:bg-slate-700`
    - _Requirements: 2.2, 2.3, 2.5_

  - [x] 4.4 Add dark mode classes to `AdjustmentPanel.tsx`
    - Panel background: `dark:bg-slate-800 dark:border-slate-700`
    - Labels: `dark:text-slate-300`
    - Slider track: `dark:bg-slate-600`
    - Preview container: `dark:bg-slate-800 dark:border-slate-700`
    - _Requirements: 2.2, 2.3, 2.5_

  - [x] 4.5 Add dark mode classes to `EditorControls.tsx`
    - Controls container: `dark:bg-slate-800 dark:border-slate-700`
    - Inputs: `dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100`
    - _Requirements: 2.2, 2.3, 2.5_

  - [x] 4.6 Add dark mode classes to `PaymentModal.tsx`
    - Modal content: `dark:bg-slate-800`
    - Text: `dark:text-slate-100`
    - Price cards: `dark:border-slate-600`
    - _Requirements: 2.2, 2.3, 2.5_

  - [x] 4.7 Add dark mode classes to `CollageEditor.tsx`
    - Update all surface, text, and border colors for dark mode
    - _Requirements: 2.2, 2.3, 2.5_

- [x] 5. Checkpoint - Verify all EasyPortrait components render correctly in dark mode
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Add dark mode to SRT Editor
  - [x] 6.1 Add `@media (prefers-color-scheme: dark)` block to `srt-editor/styles.css`
    - Override `body` background to `#0f172a`
    - Override `header` to dark semi-transparent background (`rgba(15,23,42,0.8)`) and border (`#334155`)
    - Override `.import-area`, `.tool-card`, `.subtitle-item`, `.manual-form`, `.seo-content`, `.ad-container` backgrounds to `#1e293b` with `#334155` borders
    - Override text inputs, textareas, selects to dark backgrounds (`#1e293b`), light text (`#f1f5f9`), dark borders (`#334155`)
    - Override primary text to `#f1f5f9` and secondary text to `#94a3b8`
    - Override `.modal-content`, `.price-card`, `.edit-dialog`, `.confirm-dialog` to dark surfaces
    - Override `.mode-btn` colors and active states
    - Keep indigo/purple gradient accent colors unchanged
    - _Requirements: 1.2, 1.5, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

  - [x] 6.2 Add dark mode overrides for inline navigation styles in `srt-editor/index.html`
    - Add `@media (prefers-color-scheme: dark)` block inside the existing `<style>` tag
    - Override `.ws-home-btn` background and text colors
    - Override `.ws-app-switcher-btn` background and text colors
    - Override `.ws-app-switcher-dropdown` background, border, and text colors
    - Override `.ws-app-switcher-item` hover states
    - Override `.ws-breadcrumbs` text colors
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 7. Checkpoint - Verify SRT Editor renders correctly in dark mode
  - Ensure all tests pass, ask the user if questions arise.

- [ ]* 8. Property-based tests for dark mode correctness
  - [ ]* 8.1 Write property test for EasyPortrait dark palette application
    - **Property 1: EasyPortrait dark palette application**
    - Use `fast-check` with `fc.constantFrom(...)` to pick from themed element registry
    - Assert computed dark-mode styles match expected dark palette tokens
    - **Validates: Requirements 1.1, 2.1, 2.2, 2.3, 2.4, 2.5, 2.7**

  - [ ]* 8.2 Write property test for SRT Editor dark palette application
    - **Property 2: SRT Editor dark palette application**
    - Generate random selections from SRT Editor themed elements
    - Verify computed styles under dark media query match expected tokens
    - **Validates: Requirements 1.2, 3.1, 3.2, 3.3, 3.4, 3.5, 3.7**

  - [ ]* 8.3 Write property test for primary accent color invariance
    - **Property 3: Primary accent color invariance**
    - Generate random selections from elements using indigo accent
    - Assert color value is `#6366f1` in both light and dark modes
    - **Validates: Requirements 2.6, 3.6**

  - [ ]* 8.4 Write property test for WCAG contrast ratio compliance
    - **Property 4: WCAG contrast ratio compliance**
    - Generate random pairs from dark palette color mapping
    - Compute WCAG contrast ratio and assert ≥ 4.5:1 for normal text, ≥ 3:1 for large text
    - **Validates: Requirements 5.1, 5.2, 5.3**

- [x] 9. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Dark mode is purely CSS-driven — no JavaScript theme logic needed
- EasyPortrait uses Tailwind `dark:` variants; SRT Editor uses `@media (prefers-color-scheme: dark)`
- The indigo accent color (`#6366f1`) stays the same in both modes
- Test dark mode in Chrome DevTools: Rendering > Emulate CSS media feature `prefers-color-scheme: dark`
