# Implementation Guide — Phase by Phase

## How to Use
1. Review the phase specifications and engineering objectives.
2. Complete the phase, run all checks, commit, push.
3. Write a review at the bottom.
4. Move to next phase.

## Phase 1: Project Setup & Security Foundation
Scope: Set up Next.js 14 with TypeScript, Tailwind, App Router. Install @supabase/supabase-js, @supabase/ssr, zod, @universal-rate-limit/nextjs, framer-motion, lottie-react, lucide-react. Create .env.example, .env.local, src/lib/supabase/client.ts, src/lib/supabase/server.ts, src/lib/schemas.ts, src/lib/rate-limit.ts, src/middleware.ts.

Commit: chore(setup): initialize Next.js 14 with TypeScript, Tailwind, Supabase

## Phase 2: Authentication
Scope: Implement Supabase Auth with email/password + Google OAuth. Create login, register, forgot-password, verify-email pages, auth callback route, AuthForm component, useAuth hook. Rate limit login 5/min. RLS on profiles. Generic errors.

Commit: feat(auth): add Supabase Auth with email/password and Google OAuth

## Phase 3: Admin Dashboard
Scope: Build secure admin dashboard at /admin with layout, overview stats, products CRUD, orders list, content editor, users list, Sidebar, DataTable, StatCard. Middleware blocks non-admin. Zod validation. Audit logging. Rate limit admin API 100/min.

Commit: feat(admin): add secure admin dashboard with product/order/content CRUD

## Phase 4: Public Pages + Animations
Scope: Build Home, About, Products, Contact, 404 pages with video backgrounds. Add VideoBackground (lazy loaded), OrderButton (hover fill), LoadingCup (Lottie). next/image with sizes. WebM + MP4. Mobile poster fallback. prefers-reduced-motion respected.

Commit: feat(pages): add public pages with lazy-loaded video animations

## Phase 5: Testing, Hardening, Deployment
Scope: Test RLS cross-user, rate limit 21st request, admin route as non-admin, SQL injection and XSS rejected, mobile 375/768/1024, slow 3G, no console errors. Run npm audit. Set Vercel secrets. Deploy. Enable Analytics.

Commit: security: harden RLS, rate limits, validation; deploy to Vercel

## Manual Tasks Checklist

### Before Phase 1
- [ ] Create Supabase project
- [ ] Enable Email Auth + Google OAuth
- [ ] Copy Supabase URL, anon key, service role key
- [ ] Create GitHub repo, connect to Vercel
- [ ] Set Vercel env vars as Secret type

### After Phase 2
- [ ] Enable email confirmation in Supabase
- [ ] Add redirect URLs: localhost + production

### After Phase 3
- [ ] Manually insert first admin: UPDATE profiles SET role='admin' WHERE id='<user-id>';
- [ ] Verify RLS policies in Supabase dashboard

### After Phase 4
- [ ] Upload compressed videos to /public/videos/
- [ ] Upload posters to /public/posters/
- [ ] Upload Lottie JSON to /public/animations/

### After Phase 5
- [ ] Add custom domain in Vercel
- [ ] Enable Supabase Point-in-Time Recovery
- [ ] Set up daily backups

## Phase Review Template

### What was done?
### How was it done?
### Why was it done this way?
### Security checks passed?
### Performance checks passed?
### Manual tasks completed?
### Blockers / notes?

## Summary: Manual vs Automated

| Task | Manual or Automated |
|---|---|
| Create Supabase project | Manual |
| Enable Auth providers | Manual |
| Insert first admin | Manual (SQL) |
| Set Vercel secrets | Manual |
| Write RLS policies | Automated |
| Zod validation | Automated |
| Rate limiting | Automated |
| Lazy loading videos | Automated |
| Commit + push | Automated |
| Phase review | Manual |
