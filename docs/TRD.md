# Chocobliss — Technical Requirements Document

## 1. Runtime
- Node.js 18+ minimum; use the repository-approved LTS version.
- TypeScript strict mode.
- Next.js App Router.
- Production deployment on Vercel.
- Supabase provides Auth, PostgreSQL, and Storage.

## 2. Application Architecture
- Server Components by default.
- Client Components only where interactivity/browser APIs require them.
- Server Actions/API routes for mutations and trust-boundary operations.
- Dedicated data-access/service layer.
- Zod at external input boundaries.
- Centralized authorization helpers.
- Centralized error handling.

## 3. Authentication
Supabase Auth is the sole password authentication provider.
- Email/password
- Google OAuth
- Email verification
- Password reset
- Logout
- Secure SSR session handling
- No application password storage or hashing

## 4. Authorization
Roles:
- USER
- ADMIN

Authorization must be enforced server-side and supported by RLS. Client-side role checks are UI-only and never security boundaries.

## 5. Database
PostgreSQL via Supabase.
RLS is mandatory on every exposed application table.
UUID identifiers are preferred.
Timestamps use timezone-aware database timestamps.
Soft deletion is used for products.

## 6. Storage
Supabase Storage is used for product/site media where appropriate.
Uploads require:
- authenticated admin authorization
- MIME/type validation
- file-size limits
- safe filenames
- storage policy enforcement

## 7. Validation
Zod is required for:
- forms
- API payloads
- server action input
- query/path parameters when untrusted
- admin mutations

## 8. Security
Required:
- RLS
- authorization checks
- rate limiting
- secure cookies
- security headers
- XSS-safe rendering
- SQL-injection-safe database APIs
- secret isolation
- generic production errors
- audit logging for sensitive admin operations

## 9. Performance
Targets:
- Lighthouse Performance >=95
- LCP <2s under defined production test conditions
- CLS <0.05
- initial client JS target <200KB compressed on representative routes
- lazy below-fold video
- optimized images
- minimal client components

## 10. Accessibility
Target WCAG 2.2 AA principles.
Required:
- semantic HTML
- keyboard navigation
- focus states
- accessible forms/errors
- reduced-motion support
- appropriate ARIA
- contrast compliance
- skip link
- accessible modal/menu behavior

## 11. SEO
Public routes require:
- metadata
- canonical URL where applicable
- Open Graph
- semantic headings
- descriptive URLs
- appropriate structured data

Admin/private routes must not be indexed.

## 12. CI/CD
CI must run:
- dependency install
- lint
- typecheck
- unit tests
- integration/security tests
- build
- E2E for configured protected flows

Deployment must depend on passing required checks.

## 13. Code Quality
- readable names
- small focused functions
- no swallowed exceptions
- avoid unjustified `any`
- no duplicated business logic
- no hardcoded secrets
- OOP only where it improves domain/service organization
- SOLID/DRY/KISS where applicable

## 14. Environment
Never commit secrets.
Example categories:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server only)

## 15. Definition of Done
A phase is complete only after implementation, relevant tests, security checks, lint/typecheck, build, documentation update, and git diff review all pass or are explicitly documented as blocked.
