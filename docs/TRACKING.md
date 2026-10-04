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
- **Status:** ⬜ Not started
- ...

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