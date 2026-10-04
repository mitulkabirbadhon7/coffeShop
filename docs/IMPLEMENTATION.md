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
- route groups
- layouts
- providers
- error/loading boundaries
- core UI primitives
- service/data-access structure
- configuration

Exit:
- architecture established
- no business logic in UI
- build passes

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

## Phase 13 — Security Hardening
- rate limiting
- headers
- CSP
- security tests
- dependency audit
- secret scanning
- abuse tests
- RLS audit

This phase must not be treated as optional; security should already exist in earlier phases.

## Phase 14 — Performance, Accessibility & SEO
- image optimization
- video optimization
- bundle analysis
- caching
- LCP/CLS work
- axe testing
- keyboard review
- metadata
- structured data

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
