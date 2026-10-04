# Chocobliss — 15-Phase Implementation Plan

## Phase 1 — Foundation & Database
- [x] Project baseline
- [x] Supabase setup
- [x] environment handling
- [x] schema/migrations
- [x] RLS foundation
- [x] database types
- [x] Supabase clients
- [x] initial tests

Exit:
- [x] schema applies
- [x] typecheck/lint/build pass
- [x] basic RLS tests pass

## Phase 2 — Application Architecture
- [x] route groups
- [x] layouts
- [x] providers
- [x] error/loading boundaries
- [x] core UI primitives
- [x] service/data-access structure
- [x] configuration

Exit:
- [x] architecture established
- [x] no business logic in UI
- [x] build passes

## Phase 3 — Authentication
- Supabase SSR auth
- signup/login
- email verification
- logout
- password reset
- Google OAuth
- protected account routes

Security:
- generic errors
- rate limiting
- secure session handling
- auth tests

## Phase 4 — Public Design System & Homepage
- typography
- palette
- responsive grid
- header/footer
- hero
- video system
- featured products
- story
- testimonials
- newsletter

Exit:
- responsive
- accessible
- visual requirements met
- performance checked

## Phase 5 — Products
- product listing
- categories
- filters
- product details
- optimized images/video
- availability
- SEO metadata

Tests:
- filtering
- active/deleted product behavior
- accessibility

## Phase 6 — About & Contact
- About
- team
- process
- contact form
- validation
- spam/rate limiting
- contact storage
- admin message foundation

## Phase 7 — User Account
- profile
- addresses
- account UI
- user-specific data
- order history foundation

Security:
- ownership/RLS tests
- IDOR tests

## Phase 8 — Orders
- order domain model
- order creation if enabled for V1
- order items
- price snapshots
- status transitions
- order history

Security:
- server-side pricing/business rules
- transition validation

## Phase 9 — Admin Foundation
- admin layout
- middleware/protection
- role checks
- dashboard shell
- navigation
- admin UI primitives

Security:
- forged-role tests
- unauthorized route tests

## Phase 10 — Admin Products
- product CRUD
- categories
- image upload
- soft delete/restore
- featured status
- validation
- audit logging

## Phase 11 — Admin Orders & Users
- order management
- status transitions
- user list
- safe user information
- audit logging

## Phase 12 — Content & Testimonials
- site content editor
- testimonials
- publishing state
- ordering
- validation
- audit trail

## Phase 13 — Security Hardening (✅ Complete)
- Rate limiting: Centralized sliding-window rate limiting engine with Upstash Redis (`@upstash/ratelimit` & `@upstash/redis`) and in-memory fallback protecting auth, public mutations, orders, and `/api/` endpoints
- HTTP Headers: Comprehensive baseline security headers in `next.config.mjs` and `middleware.ts` (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `HSTS 2-years`, COOP, CORP)
- Content-Security-Policy (CSP): Strict directives with `frame-ancestors 'none'`, Supabase/Turnstile/Google Fonts allowlists, and production HTTPS upgrade
- CSRF & Origin Verification: `csrf.ts` validating trusted request origins on mutations
- Error Sanitization & Masking: `error-sanitizer.ts` preventing database internal leakages and redacting credentials in diagnostic objects
- Security & Abuse Tests: 40 automated security tests covering rate limiting, headers, CSP, CSRF, error masking, secret scanning, and RLS audit (198/198 total tests passing across 25 suites)
- Secret Scanning: Verified zero client-component secret exposure
- Dependency Audit: Documented and verified against pinned stack rules

## Phase 14 — Performance, Accessibility & SEO (✅ Complete)
- Image optimization: `next.config.mjs` configured with modern AVIF and WebP formats, remotePatterns for Supabase Storage, explicit responsive deviceSizes and imageSizes
- Video optimization: IntersectionObserver-driven lazy playback for below-the-fold media, `preload="metadata"` / `preload="none"`, and zero-CLS aspect ratio containers (`aspect-[4/5]`, `aspect-[16/9]`)
- Bundle analysis: First-load shared JS maintained at 87.2 kB (well within <200 kB target)
- Accessibility (WCAG 2.2 AA): Keyboard skip-link (`#main-content`), main content landmark, ARIA attributes on navigation elements (`aria-expanded`, `aria-controls`, `role="navigation"`), and Escape-key dismissibility
- Metadata: Comprehensive `metadataBase`, Open Graph card, Twitter card, robots indexing rules, and canonical link generation
- Robots & Sitemap: Dynamic `robots.ts` and dynamic `sitemap.ts` indexing core marketing pages and live product offerings
- Structured data: Schema.org JSON-LD structured data for `CoffeeShop`, `Product`, and `BreadcrumbList`
- Automated test suites: 12 new tests across SEO, accessibility, and performance (210/210 vitest tests passing across 28 suites)

## Phase 15 — Production Release
- full regression
- E2E suite
- production build
- environment verification
- CI/CD
- Vercel deployment
- documentation audit
- final security review
- final git diff review

## Phase Exit Protocol
Every phase:
1. read relevant docs
2. implement only phase scope
3. test
4. lint
5. typecheck
6. security check
7. build
8. review diff
9. update docs/tracker
10. report exact Git commands
11. report blockers honestly

## Phase Dependencies
1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12 → 13 → 14 → 15
