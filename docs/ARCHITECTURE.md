# Chocobliss — Architecture

## 1. High-Level Architecture

Browser
→ Next.js UI
→ Server Action / Route Handler
→ Validation
→ Authentication
→ Authorization
→ Service / Business Logic
→ Data Access
→ Supabase PostgreSQL / Storage

## 2. Next.js Layers

### Presentation
`app/`, `components/`, layouts, pages, UI primitives.

### Application
Server Actions and Route Handlers. Responsible for:
- request parsing
- validation
- authentication
- authorization
- invoking services
- safe response mapping

### Domain/Services
Business rules such as:
- order status transitions
- product operations
- content publishing
- audit events

### Data Access
Dedicated Supabase query modules. UI components must not directly execute database queries.

### Infrastructure
Supabase clients, storage helpers, rate limiter, logging, environment configuration.

## 3. Suggested Structure

```text
src/
├── app/
│   ├── (public)/
│   ├── (auth)/
│   ├── account/
│   ├── admin/
│   ├── api/
│   ├── error.tsx
│   ├── loading.tsx
│   └── not-found.tsx
├── components/
│   ├── ui/
│   ├── layout/
│   ├── marketing/
│   ├── products/
│   ├── account/
│   └── admin/
├── lib/
│   ├── supabase/
│   ├── auth/
│   ├── validation/
│   ├── security/
│   ├── services/
│   ├── data/
│   └── utils/
├── types/
└── config/
```

## 4. Supabase Clients
Use separate browser/server patterns appropriate for Next.js SSR.
The service-role client is server-only and must never be imported into client components.

## 5. Request Pipeline

```text
Request
→ Parse
→ Validate
→ Authenticate
→ Authorize
→ Execute business rule
→ Data access
→ Audit if required
→ Safe response
```

## 6. Server Components
Prefer Server Components for:
- public product lists
- content
- dashboard reads
- user/account reads

Use Client Components for:
- interactive filters
- forms needing client interaction
- animations/browser APIs
- local UI state

## 7. Error Architecture
Use typed/application errors internally and map them to generic safe responses externally. Never expose database/provider stack traces to users.

## 8. Caching
Use Next.js caching/revalidation intentionally. User-specific and authorization-sensitive data must not be accidentally cached across users.

## 9. Media
Large videos are lazy loaded and must not block LCP. Product images use responsive optimization.

## 10. Admin
Admin UI is protected by server-side session + role authorization. RLS remains an independent database security layer.

## 11. Extensibility
The architecture should permit future Stripe/payment integration without rewriting authentication, products, orders, or the admin system.
