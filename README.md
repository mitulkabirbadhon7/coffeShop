# Chocobliss Coffee Roastery ☕✨

A premium, modern web experience for **Chocobliss Coffee**, an artisanal coffee roastery combining single-origin micro-lots with rich Venezuelan cacao notes.

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **Lottie React**.

---

## 🚀 Getting Started

### 1. Installation
Install the project dependencies:
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 3. Production Build & Deployment
To create an optimized production build:
```bash
npm run build
npm run start
```

---

## 🎬 Video & Media Assets

All video files and poster images are located in the `public/` directory:

```
public/
├── animations/
│   └── loading-cup.json       # Lottie cup-filling animation
├── images/
│   ├── hero-poster.png        # Home hero video fallback / poster
│   ├── about-poster.png       # About page steam video fallback / poster
│   ├── ingredients-poster.png # Products page video fallback / poster
│   ├── spill-poster.png       # 404 page coffee spill fallback / poster
│   ├── contact-poster.png     # Contact page subtle steam fallback / poster
│   └── F1.png - F8.png        # Product and team imagery
└── videos/
    ├── coffee-pour.mp4        # Hero video (webm/mp4)
    ├── steam-cup.mp4          # About section video
    ├── ingredients.mp4        # Products menu background video
    └── coffee-spill.mp4       # 404 Not Found background video
```

### How to Swap or Add Videos
1. Place your `.mp4` and `.webm` files inside `public/videos/`.
2. When using the `<VideoBackground />` component, supply both sources:
   ```tsx
   <VideoBackground
     srcWebm="/videos/your-video.webm"
     srcMp4="/videos/your-video.mp4"
     poster="/images/your-poster.png"
   />
   ```
3. WebM is preferred by modern browsers for smaller file sizes, while MP4 acts as a universal fallback.

### How to Swap Posters
Replace the corresponding image in `public/images/` or pass a new URL/path into the `poster` prop of `VideoBackground`. The poster is displayed immediately before video playback begins, and is shown permanently if the user has enabled `prefers-reduced-motion`.

---

## 🎨 Color Palette & Typography

Configured in `tailwind.config.ts`:
- **`coffee-dark`**: `#3A2215` (Deep Espresso brown)
- **`coffee-medium`**: `#6B4423` (Roasted bean brown)
- **`coffee-cream`**: `#F5E6D3` (Silky steamed foam)
- **`coffee-gold`**: `#C89B5E` (Warm honey amber gold)
- **`coffee-accent`**: `#A0522D` (Warm roasted chestnut)

### Typography
- **Headings**: `Playfair Display` (Serif loaded via `next/font/google`)
- **Body**: `Inter` (Sans-serif loaded via `next/font/google`)

---

## 🧩 Key Architecture & Components

- **`VideoBackground`** (`src/components/ui/VideoBackground.tsx`):
  - Autoplay, muted, loop, playsinline video background with `object-fit: cover`.
  - Accessible: `aria-hidden="true"`, `role="presentation"`.
  - Reduced Motion: Seamlessly falls back to high-res poster image when `prefers-reduced-motion` is detected.
- **`OrderButton`** (`src/components/ui/OrderButton.tsx`):
  - Accessible button/link with custom hover micro-interaction.
  - CSS-animated coffee liquid filling the cup from bottom to top with delicate rising steam particles.
- **`LoadingCup`** (`src/components/ui/LoadingCup.tsx`):
  - Uses `lottie-react` reading `/animations/loading-cup.json` with a sleek loading fallback.
- **`useLazyVideo`** (`src/hooks/useLazyVideo.ts`):
  - `IntersectionObserver`-based hook to defer loading below-the-fold videos until they approach viewport.
- **`useReducedMotion`** (`src/hooks/useReducedMotion.ts`):
  - React hook listening to `(prefers-reduced-motion: reduce)`.

---

## ♿ Accessibility Features
- All background videos include `aria-hidden="true"` and `role="presentation"`.
- Prefers-reduced-motion is automatically respected by substituting static poster photography.
- Contrast-checked color combinations with dark overlays over moving video.
- All interactive links and buttons have explicit `aria-label` descriptions.
- Screen-reader friendly semantic landmarks (`<main>`, `<header>`, `<nav>`, `<footer>`, `<section>`).
