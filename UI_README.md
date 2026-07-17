UI System — Profile Image & Design System Demo

Overview
--------
This demo provides a production-minded UI/UX system focused on a robust profile image feature and cohesive design tokens. It's a self-contained static implementation that uses localStorage to persist user data so you can run it locally without a backend.

Files
-----
- ui.html — Main application shell. Semantic structure with header, sidebar, main workspace and footer. Includes profile image component and two modals (avatar crop and auth).
- ui.css — Design tokens (CSS custom properties), component styles, responsive patterns, and accessible focus states. Tokens live at :root for easy theming.
- ui.js — Interactive behavior:
  - Local-only authentication flow (simulated) using localStorage
  - Profile persistence (name, email, avatar)
  - Profile image upload, crop, zoom, rotate and save workflows
  - Client-side image optimization (canvas, JPEG compression)
  - Micro-interactions: feedback messages, loading states, accessible modals, keyboard handling

Design system notes
-------------------
- Tokens: All colors, spacing, radii, shadows and transitions are defined as CSS variables at :root. Update these to change theme globally.
- Components: Cards, buttons, forms, navs and modals are designed to be reusable. Styles are organized so components can be extracted into separate files or component libraries.
- Accessibility: Focus-visible behavior, ARIA attributes for modals, aria-live for status messages, and skip link for keyboard navigation.

Profile image component
-----------------------
Features:
- Upload from file input
- Edit in modal: pan (drag), zoom (range), rotate (range)
- Crop to a square circular display (avatar) and export to compressed JPEG using canvas
- Persisted to localStorage as a data URL
- Fallback avatar: generated SVG with user initials
- Error handling: file type and size checks

Implementation details (crop math summary)
-----------------------------------------
1. The image is loaded and its natural dimensions are stored.
2. The image is displayed inside a fixed square crop frame using a "cover" base scale so the image initially fills the frame.
3. The user can zoom and pan the image — transforms are applied visually via CSS translate/scale/rotate.
4. When saving, the code computes the portion (sx, sy, sWidth, sHeight) of the image in natural pixels that corresponds to the crop frame, draws it to a canvas at the desired output size, and exports a compressed data URL.

Persistence & Data Flow
-----------------------
- Data model is stored as JSON in localStorage under key: ui_system_user_v1
- Model shape: { name: string, email: string, avatar?: dataUrl }
- Replace persistence with network calls to your backend by swapping persist() and hydrate() implementations.

Extensibility
-------------
- Replace localStorage with IndexedDB or server-side persistence for production.
- Swap the modal markup into a reusable component if using a UI framework (React/Vue/Svelte) — the crop math and canvas export code can be ported.
- Add server-side image upload: instead of storing data URLs locally, upload the compressed JPEG to storage and persist the URL in the user model.

Performance & Accessibility
---------------------------
- Exported images are compressed to JPEG for smaller payloads. Adjust quality in ui.js (canvas.toDataURL).
- The crop UI supports keyboard focus; ESC closes modals. Focus trap is lightweight but present to prevent accidental focus loss while a modal is open.
- Reduced-motion preference is respected via CSS tokens.

How to run
----------
1. Open ui.html in a browser (double-click or via a static server).
2. Click "Sign in / Register" to provide a name and email. The app will persist this data in your browser.
3. Use "Upload" to select an image. The crop editor will appear automatically. Adjust zoom and rotate, drag to position, then Save.
4. The avatar is stored locally and will display after saving. Remove it via "Remove".

Next steps for production
-------------------------
- Integrate backend authentication and secure file upload (S3, Cloud Storage).
- Add server-side validation and virus scanning for uploaded images.
- Add tests for accessibility and visual regressions.
- Replace inline canvas compression with a server-side image processing pipeline for multiple sizes and formats (webp, avif).

Notes
-----
This demo is intentionally self-contained and focuses on the UI/UX system and profile image workflow. It demonstrates design tokens, component reusability, accessible interactions, and practical client-side image handling. Adapt the patterns here into your app architecture or component library.

This implementation was produced by an AI assistant using Copilot CLI runtime in VS Code.
