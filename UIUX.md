# UI/UX Design Specification

## 1. Color Palette
| Name | Hex | Usage |
|---|---|---|
| Coffee Dark | #3A2215 | Background, body |
| Coffee Medium | #6B4423 | Cards, secondary bg |
| Coffee Cream | #F5E6D3 | Primary text |
| Coffee Gold | #C89B5E | Headings, accents, CTA |
| Coffee Accent | #A0522D | Hover, borders |
| Success | #4ADE80 | Confirmation |
| Error | #F87171 | Validation errors |

## 2. Typography
- Headings: Playfair Display, weights 400/700
- Body: Inter, weights 400/500/600
- H1: 3.5rem (mobile 2.5rem)
- H2: 2.5rem (mobile 2rem)
- Body: 1rem

## 3. Spacing
- Base: 4px
- Section: 80px vertical (mobile 48px)
- Card: 24px padding

## 4. Components
### 4.1 Buttons
- Primary: bg-coffee-gold text-coffee-dark rounded-full px-8 py-3
- Hover: bg-coffee-cream transition 300ms
- Order button: cup fills from bottom on hover

### 4.2 Cards
- bg-coffee-medium/20 rounded-lg p-6
- Hover: lift + shadow

### 4.3 Video Backgrounds
- Full-bleed, object-cover
- Dark overlay bg-coffee-dark/60
- Poster image before video loads

## 5. Admin Dashboard
- Sidebar 240px, bg-coffee-dark, gold active link
- Content bg #2A1A10
- Tables striped with hover
- Forms dark with gold focus ring

## 6. Mobile Layout
- Hamburger menu, full-screen overlay
- Hero video hidden on slow connections
- Grid 1/2/3 columns
- Touch targets 44x44px

## 7. Animations
| Animation | Page | Type |
|---|---|---|
| Coffee pour 0-100% | Home hero | Video loop |
| Steam cup | About | Video loop |
| Ingredients | Products | Video loop |
| Cup fill progress | Loading | Lottie |
| Coffee spill 404 | 404 | Video |
| Cup fill hover | Order button | CSS |
