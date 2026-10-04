# Chocobliss — Project Tracking

Last updated: 2026-10-04 (Phase 0)

---

## 1. Owner Decisions (Phase 0)

These decisions guide every phase. The agent must respect them.

| Decision | Value |
|---|---|
| Ordering model | Pickup only (no online payment in v1) |
| Delivery | No |
| Currency | BDT (Bangladeshi Taka) |
| Timezone | Asia/Dhaka |
| Opening hours | 8:00 AM – 10:00 PM (daily) |
| Brand assets ready? | No — use placeholders |
| Logo provided? | No — agent creates placeholder SVG |
| Photos provided? | No — use stock placeholders, replace later |
| Copy provided? | No — agent writes initial copy, owner edits later |
| Email provider | Store-only (no email notifications in v1) |
| Analytics needed? | No |
| Cookie banner needed? | No |
| Languages | English only |
| Admin count | 1 (owner) |

---

## 2. Accounts Created (Phase 0)

| Service | Status | Notes |
|---|---|---|
| Supabase (dev project) | ✅ Created | Project ref: `sslwbhdcmscsifrwxifa` |
| GitHub private repo | ✅ Created | Repo: `coffeeShop` |
| Vercel project | ✅ Imported | Env vars added |
| Upstash Redis | ✅ Created | Free tier |
| Cloudflare Turnstile | ✅ Created | Managed mode |
| Google Cloud OAuth | ⏳ Pending | Needs Phase 5 verification |

---

## 3. Environment Variables Set

### Vercel (8 variables)

| Key | Sensitive | Status |
|---|---|---|
| NEXT_PUBLIC_SITE_URL | No | ✅ |
| NEXT_PUBLIC_SUPABASE_URL | No | ✅ |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | No | ✅ |
| SUPABASE_SERVICE_ROLE_KEY | Yes | ✅ |
| UPSTASH_REDIS_REST_URL | Yes | ✅ |
| UPSTASH_REDIS_REST_TOKEN | Yes | ✅ |
| NEXT_PUBLIC_TURNSTILE_SITE_KEY | No | ✅ |
| TURNSTILE_SECRET_KEY | Yes | ✅ |

### Local `.env.local`

- ✅ `frontend/.env.local` created and filled
- ✅ `backend/.env.local` created and filled (if split structure)
- ✅ `.env.local` in `.gitignore`

---

## 4. Local Environment

| Tool | Version | Status |
|---|---|---|
| Node.js | vXX.XX.X | ✅ (must be 18.18+) |
| npm | X.XX.X | ✅ |
| Supabase CLI | X.XX.X | ✅ |
| Supabase login | — | ✅ |
| Supabase link | Project ref: `<your-ref>` | ✅ |
| Docker | Not installed | Skipped (using remote dev) |

---

## 5. Docs Created

| File | Status |
|---|---|
| docs/PROJECT_OVERVIEW.md | ✅ |
| docs/AGENT_RULES.md | ✅ |
| docs/PRD.md | ✅ |
| docs/TRD.md | ✅ |
| docs/ARCHITECTURE.md | ✅ |
| docs/SCHEMA.md | ✅ |
| docs/SECURITY.md | ✅ |
| docs/TESTING.md | ✅ |
| docs/UIUX.md | ✅ |
| docs/IMPLEMENTATION.md | ✅ |
| docs/TRACKING.md | ✅ (this file) |
| docs/STACK.md | ⏳ Needs creation |
| docs/CAPACITY.md | ⏳ Needs creation |
| docs/DESIGN.md | ⏳ Needs creation |

---

## 6. Phase Log

### Phase 0 — Manual External Setup
- **Status:** ✅ Complete
- **Started:** 2026-10-04
- **Completed:** 2026-10-04
- **Commit:** No commit (manual setup)
- **Notes:** All external accounts, secrets, and 14 planning documents confirmed.

### Phase 1 — Foundation & Database
- **Status:** ✅ Complete
- **Started:** 2026-10-04
- **Completed:** 2026-10-04
- **Commit:** Pending owner manual commit
- **Notes:** 11 tables migrated with forward-only SQL, RLS enabled on all tables, 22 products seeded, 14/14 automated RLS security tests passed, build and lint zero errors.

### Phase 2 — Application Architecture
- **Status:** ✅ Complete
- **Started:** 2026-10-04
- **Completed:** 2026-10-04
- **Commit:** Pending owner manual commit
- **Notes:** Route groups ((public), (auth), account, admin, api) established; core UI primitives (Button, Card, Badge, Input, Skeleton); data-access & order state machine services; 41/41 vitest tests green; 14 routes statically/dynamically generated under 95 kB.

### Phase 3 — Authentication
- **Status:** ✅ Complete
- **Started:** 2026-10-04
- **Completed:** 2026-10-04
- **Commit:** `74fc645`
- **Notes:** Supabase SSR cookie auth implemented; Zod validation schemas for login, signup, password reset & update; Server Actions with anti-enumeration protection; OAuth callback route with safe redirect sanitization; route-protecting middleware with session refresh; 19 new auth tests (60/60 total vitest tests passing); Next.js production build 17/17 pages verified with 0 lint errors.

### Phase 4 — Public Design System & Homepage
- **Status:** ✅ Complete
- **Started:** 2026-10-04
- **Completed:** 2026-10-04
- **Commit:** `622c8c0`
- **Notes:** Complete editorial homepage built with DESIGN.md design tokens (Espresso, Oat Milk, Latte Caramel, Cream Foam, Terracotta, Stone, Ash, Bark, Charcoal); accessible VideoBackground with poster fallback, network awareness, and reduced-motion protection; asymmetric editorial Hero with signature tasting notes card; FeaturedProductsSection fetching real DB products with BDT format; StorySection with craft showcase; CraftAtmosphereSection with roastery hours & pickup details; TestimonialsSection with authentic guest reviews; NewsletterSection with Zod validation, honeypot bot trap, and Server Action inserting into newsletter_subscribers; 70/70 vitest tests passing; Next.js production build First Load JS: 110 kB.

### Phase 5 — Products Catalog & Details
- **Status:** ✅ Complete
- **Started:** 2026-10-04
- **Completed:** 2026-10-04
- **Commit:** `7702d28`
- **Notes:** Interactive ProductCatalog with real-time category tabs, search input, sort selector, in-stock toggle, and live item counter; ProductDetailPage with JSON-LD (schema.org/Product), dynamic SEO metadata, breadcrumbs, tasting notes, ProductDetailActions quantity picker with cup-fill hover, Dhaka pickup guidelines, and related product recommendations; strict soft-deletion defense in data layer; 79/79 tests green across 11 suites; Next.js production build 17/17 routes passing cleanly.

### Phase 6 — About & Contact
- **Status:** ✅ Complete
- **Started:** 2026-10-04
- **Completed:** 2026-10-04
- **Commit:** Pending owner manual commit
- **Notes:** Editorial AboutPage with 4-stage roasting discipline, artisan team profiles (Master Roaster & Head Chocolatier), direct trade principles, and roastery showcase; Interactive ContactPage with Dhaka atelier counter hours (8 AM – 10 PM), Banani address, phone, and ContactForm; sendContactMessageAction Server Action with Zod validation, honeypot bot trap, and PostgreSQL contact_messages storage; 85/85 vitest tests passing across 12 suites; Next.js production build 17/17 routes passing with 0 lint errors.

*(Repeat for all 15 phases)*

---

## 7. Docs I Verified (Agent must update)

When the agent verifies a package/API against official docs, it records it here.

| Package/API | Version | Doc URL | Date |
|---|---|---|---|
| *(agent fills as it goes)* | | | |

---

## 8. Open TODOs

- [ ] Create `docs/STACK.md`
- [ ] Create `docs/CAPACITY.md`
- [ ] Create `docs/DESIGN.md`
- [ ] Configure Google OAuth in Supabase (Phase 5)
- [ ] Configure SMTP (Phase 13, optional)

---

## 9. Known Issues

None.

---

## 10. Next Action

Create the 3 missing docs, then reply "done" to the agent and start Phase 1.