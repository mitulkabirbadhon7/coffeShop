# PRD: Chocobliss Coffee Shop Website

## 1. Overview
A premium coffee shop website with immersive video animations, user authentication, an admin dashboard for content management, and production-grade security. Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and Supabase (Auth + Database + RLS).

## 2. Goals
- Deliver a visually stunning, fast-loading coffee shop site
- Allow public users to browse menu, read about, contact
- Allow authenticated admins to manage products, orders, site content
- Enforce security at every layer: auth, RLS, server validation, rate limiting, input sanitization, generic errors
- Deploy on Vercel with CI/CD via GitHub

## 3. Target Users
| User Type | Access |
|---|---|
| Guest | Home, About, Products, Contact (view only) |
| Registered User | + Order history, profile |
| Admin | + Admin dashboard (CRUD products, orders, content) |

## 4. Core Features
### 4.1 Public Pages
- Home: Hero video (coffee pouring), featured products, story, testimonials
- About: Steam cup video, mission, team
- Products: Ingredient video hero + full menu grid
- Contact: Form (name, email, message) with server-side validation
- Auth: Login, Register, Forgot Password, Email Verification

### 4.2 Auth & Security
- Supabase Auth (email/password + Google OAuth)
- Password hashing: bcrypt (Supabase default)
- RLS enabled on every table
- Server-side input validation with Zod
- Generic error messages
- Token-bucket rate limiting per IP and per user
- Admin routes protected by middleware + role check

### 4.3 Admin Dashboard
- Clean sidebar navigation
- CRUD: Products, Orders, Site Content
- Read-only user list
- Audit trail for all admin actions

### 4.4 Performance
- Lazy loading videos with IntersectionObserver
- next/image with WebP/AVIF
- API response caching (SWR/React Query)
- Compressed videos (WebM + MP4)

### 4.5 Accessibility
- prefers-reduced-motion respected
- WCAG AA contrast
- Keyboard navigable

## 5. Out of Scope (v1)
Payment processing, multi-language, native mobile app, realtime chat.

## 6. Success Metrics
- Lighthouse Performance > 90 (mobile)
- LCP < 2.5s on 4G
- Zero RLS leaks
- Rate limit blocks > 99% of abuse
