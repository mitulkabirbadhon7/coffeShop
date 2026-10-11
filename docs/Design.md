# Chocobliss — Design Tokens

## Colors

### Core
- Espresso: `#2C221E` (text, headings)
- Oat Milk: `#FDFBF7` (page background)
- Latte Caramel: `#D4A373` (primary CTA)
- Cream Foam: `#FAEDCD` (cards, hover)
- Terracotta: `#E07A5F` (accent, active)

### Extended
- Stone: `#F4F1EA` (section alt background)
- Ash: `#8A8179` (muted text, borders)
- Bark: `#5C4A3D` (secondary headings)
- Charcoal: `#1A1613` (footer, admin bg)

### Admin
- Admin BG: `#1A1613`
- Admin Sidebar: `#2C221E`
- Admin Card: `#3A2D26`
- Admin Border: `#5C4A3D`
- Admin Active: `#D4A373`

### Status
- Success: `#4ADE80`
- Error: `#F87171`
- Warning: `#FBBF24`
- Info: `#60A5FA`

## Typography
- Headings: Playfair Display 400/700
- Body: Inter 400/500/600
- Fallback: Georgia, system-ui

### Scale
| Token | Mobile | Desktop | Weight | LH |
|---|---|---|---|---|
| display | 2.5rem | 4.5rem | 700 | 1.05 |
| h1 | 2rem | 3.5rem | 700 | 1.1 |
| h2 | 1.75rem | 2.5rem | 700 | 1.15 |
| h3 | 1.25rem | 1.5rem | 600 | 1.25 |
| body | 1rem | 1.0625rem | 400 | 1.65 |
| small | 0.875rem | 0.875rem | 400 | 1.5 |

## Spacing (4px base)
`4 · 8 · 16 · 24 · 32 · 48 · 80 · 120`

## Radii
- sm: 2px
- md: 4px
- lg: 8px
- Never use rounded-3xl or full

## Shadows
- sm: `0 1px 2px rgba(44,34,30,0.06)`
- md: `0 4px 12px rgba(44,34,30,0.08)`
- lg: `0 8px 24px rgba(44,34,30,0.10)`

## Motion
- fast: 150ms ease-out
- base: 200ms ease-out
- slow: 400ms cubic-bezier(0.22,1,0.36,1)
- Reduced motion: disable all transitions, no autoplay

## Breakpoints
- Mobile: 0–639
- Tablet: 640–1023
- Desktop: 1024–1279
- Wide: 1280+

## Layout
- Max width: 1280px
- Section padding: 80px desktop / 48px mobile
- Grid: 12 columns desktop

## Rules
- No purple or blue accents
- No centered "Welcome to X" hero
- No rounded-3xl
- No emoji in headings
- No shimmer or glow
- Use asymmetry (5/7, 4/8 splits)