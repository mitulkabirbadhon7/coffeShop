# PRD — Chocobliss Coffee Shop

## 1. Overview
Chocobliss is a premium coffee shop website with immersive editorial video, Supabase authentication, a secure admin dashboard, and production security. It is a single Next.js App Router application backed by Supabase Auth, PostgreSQL, and Storage.

## 2. Goals
- Premium non-template editorial design
- Guest product/about/contact experience
- Authenticated customer accounts
- User order history
- Secure admin dashboard
- Product/order/content/user management
- RLS, Zod, authorization, rate limiting, safe errors
- Lighthouse Performance >=95 target
- LCP <2s target
- Vercel deployment with GitHub CI/CD

## 3. Non-Goals
- Payments/Stripe
- Multi-language
- Native app
- Realtime chat
- Loyalty
- Delivery tracking
- POS integration
- Advanced analytics

## 4. Users
Guest, User, Admin.

## 5. Public Features
Home, About, Products, Product Detail, Contact, 404, loading experience.

Home includes hero video, featured products, story, steam video, testimonials, newsletter.

## 6. Authentication
- Email/password through Supabase Auth
- Google OAuth
- Password reset
- Email verification
- Secure SSR sessions
- Generic errors
- No password storage in application code

## 7. User Features
- Profile
- Addresses
- Order history
- Order details/status

## 8. Admin
- Overview
- Product CRUD
- Images
- Orders/status
- Site content
- Testimonials
- Read-only users
- Contact messages
- Audit trail

## 9. Security
- Supabase Auth
- RLS on all exposed application tables
- Zod validation
- Rate limiting
- Secure headers
- Server-side authorization
- SQLi/XSS prevention
- Secret isolation
- Generic production errors
- Audit logging

## 10. Performance
- Lazy video
- AVIF/WebP images
- Server Components by default
- code splitting
- compressed WebM/MP4
- font optimization
- initial client JS target <200KB compressed

## 11. Accessibility
- WCAG 2.2 AA target
- keyboard navigation
- semantic HTML
- ARIA where appropriate
- reduced motion
- accessible forms
- axe checks

## 12. Design
Warm brown/cream/gold palette, Playfair Display + Inter, editorial asymmetry, grain, hand-drawn accents, generous spacing.

Avoid purple gradients, generic centered heroes, excessive rounded cards, generic SaaS styling, and obvious AI-template aesthetics.

## 13. Success
- Lighthouse >=95 target
- LCP <2s target
- CLS <0.05
- zero known RLS leaks
- no unauthorized admin access
- no known high/critical dependency vulnerability at release
- critical security tests pass
- accessibility checks pass

## 14. Constraints
- English
- desktop/mobile web
- Supabase/Vercel
- Node 18+ minimum
- GitHub CI/CD

## 15. Risks
Video weight, RLS mistakes, rate-limit bypass, secret leaks, accessibility regressions, excessive client JS, slow first paint.

## 16. Milestones
See `docs/IMPLEMENTATION.md` for the 15-phase execution plan.

## 17. Definition of Done
A feature/phase is complete only after implementation, relevant tests, lint, typecheck, security checks, build, documentation, and git diff review are complete or explicitly reported as blocked.
