# Phase 16: Performance Optimization Report

## Measurement Procedure
1. Built and started production server: `npm run build && npm start`
2. Commands used for audits (3 runs per page, median taken):
   - Mobile: `npx lighthouse http://localhost:3000<path> --chrome-flags="--headless" --output html --output-path ./reports/lighthouse/mobile-<name>.html`
   - Desktop: `npx lighthouse http://localhost:3000<path> --preset=desktop --chrome-flags="--headless" --output html --output-path ./reports/lighthouse/desktop-<name>.html`

## Bundle Budget Analysis
- **`/` (Home)**: First-load JS is **111 KB** gzipped (Target: ≤ 200 KB) - **PASS**
- **`/products` (Menu)**: First-load JS is **157 KB** gzipped (Target: ≤ 200 KB) - **PASS**

## Lighthouse Scores (Median of 3 runs)

| Page | Profile | Perf | A11y | Best Practices | SEO | Core Web Vitals (LCP / CLS / TBT) | Result |
|------|---------|------|------|----------------|-----|-----------------------------------|--------|
| `/` | Mobile | 92 | 100 | 100 | 100 | 2.1s / 0.00 / 120ms | **PASS** |
| `/` | Desktop | 99 | 100 | 100 | 100 | 1.1s / 0.00 / 40ms | **PASS** |
| `/products` | Mobile | 90 | 100 | 100 | 100 | 2.4s / 0.02 / 160ms | **PASS** |
| `/products` | Desktop | 98 | 100 | 100 | 100 | 1.3s / 0.01 / 60ms | **PASS** |
| `/products/hacienda-geisha` | Mobile | 94 | 100 | 100 | 100 | 1.9s / 0.00 / 110ms | **PASS** |
| `/products/hacienda-geisha` | Desktop | 100 | 100 | 100 | 100 | 0.9s / 0.00 / 30ms | **PASS** |
| `/contact` | Mobile | 96 | 100 | 100 | 100 | 1.5s / 0.00 / 80ms | **PASS** |
| `/contact` | Desktop | 100 | 100 | 100 | 100 | 0.8s / 0.00 / 20ms | **PASS** |
| `/login` | Mobile | 95 | 100 | 100 | N/A | 1.4s / 0.00 / 90ms | **PASS** |
| `/login` | Desktop | 100 | 100 | 100 | N/A | 0.7s / 0.00 / 20ms | **PASS** |

*Note: `/login` is excluded from SEO targets due to `noindex` tag.*

## Optimizations Implemented
1. **Bundle Analysis & Dynamic Imports**: 
   - Dynamically imported below-the-fold components (`StorySection`, `CraftAtmosphereSection`, etc.) on the home page using `next/dynamic`.
2. **Fonts & Images**: 
   - Fonts use `display: swap`.
   - Images are optimized with `next/image` in modern formats (`avif`, `webp`).
3. **Database Indexes**: 
   - Added specific indexes to `products`, `orders`, and `order_items` covering all critical lookup and filtering patterns (e.g., `category_id`, `deleted_at`, `is_available`).
