# Chocobliss Coffee Roastery ☕✨

A premium coffee shop website and backend service for **Chocobliss Coffee**.

## 📁 Repository Structure

```
├── doc/                        # Documentation & Planning Specifications
│   ├── PRD.md                  # Product Requirements Document
│   ├── TRD.md                  # Technical Requirements Document
│   ├── UIUX.md                 # UI/UX Design Specifications
│   ├── TRACKING.md             # Project Tracking & Engineering Standards
│   └── IMPLEMENTATION.md       # Phase-by-phase Implementation Roadmap
│
├── frontend/                   # Frontend Workspace (Next.js 14 App Router)
│   ├── public/
│   │   ├── animations/         # Lottie animations
│   │   ├── images/             # Product photography & posters
│   │   └── videos/             # Background videos (coffee pour, steam, etc.)
│   └── src/
│       ├── app/                # Next.js App Router pages
│       ├── components/         # Layout & UI components
│       ├── hooks/              # Custom React hooks
│       ├── lib/                # Utility & client libraries
│       └── types/              # TypeScript definitions
│
└── backend/                    # Backend API Service (Node.js / Express / Supabase)
    └── src/
        ├── config/             # Environment & service configurations
        ├── controllers/        # Request controllers
        ├── middleware/         # Auth, validation & rate limiting
        ├── routes/             # REST API routes
        ├── schemas/            # Zod validation schemas
        ├── services/           # Business logic & database operations
        └── types/              # Backend TypeScript types
```

## 🌿 Branches

- **`main`**: Combined baseline containing documentation and overall folder structure.
- **`frontend`**: Dedicated branch for frontend Next.js application development.
- **`backend`**: Dedicated branch for backend API development.

---

## 🚀 Production Operations & Deployment Runbook (Phase 17)

### 1. Production Deployment Procedure
1. **Supabase Database Preparation:**
   - Verify all migrations succeed on local/staging stacks: `supabase db push --dry-run`.
   - Take a manual backup of the production database in the Supabase Dashboard.
   - Apply pending migrations to production Supabase project via `supabase db push`.
2. **Vercel Project Configuration:**
   - Verify **Root Directory** is configured as `frontend` in Vercel Project Settings → General.
   - Configure all Production Environment Variables:
     - `NEXT_PUBLIC_SUPABASE_URL` (Production URL)
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Production Anon Key)
     - `SUPABASE_SERVICE_ROLE_KEY` (Production Service Role Key - Server-only)
     - `NEXT_PUBLIC_SITE_URL` (e.g. `https://chocobliss.com`)
     - `UPSTASH_REDIS_REST_URL` & `UPSTASH_REDIS_REST_TOKEN` (Rate limiting)
     - `SENTRY_DSN` & `NEXT_PUBLIC_SENTRY_DSN` (Error monitoring)
3. **Trigger Deployment:**
   - Merge the approved phase PR into `main` branch.
   - Vercel automatically builds and deploys `main`.
4. **Post-Deploy Smoke Test:**
   - Run the smoke test: `cd frontend && npx vitest run tests/e2e/smoke.test.ts`.
   - Verify `/`, `/menu`, `/login` load cleanly, `/admin` redirects to login when logged out, and `/api/health` returns status `healthy`.

---

### 2. Rollback Procedure
1. **Instant Vercel Rollback:**
   - Open Vercel Project Dashboard → **Deployments**.
   - Locate the previous known-good deployment.
   - Click the three dots menu `(...)` and select **"Promote to Production"** (or **"Instant Rollback"**).
   - Traffic instantly switches back to the previous immutable deployment artifact within seconds.
2. **Database Rollback:**
   - Migrations are strictly forward-only. If a schema change broke application logic, do NOT edit remote migration logs.
   - Write a new forward migration file `supabase/migrations/000X_revert_feature.sql` reversing the changes and apply with `supabase db push`.

---

### 3. Key Rotation Procedure
1. **Supabase API Keys (`anon` & `service_role`):**
   - In Supabase Dashboard → Settings → API, click **"Generate new secret key"**.
   - Copy the new `service_role` and `anon` keys.
   - Immediately update `SUPABASE_SERVICE_ROLE_KEY` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel Environment Variables.
   - Trigger a redeploy in Vercel.
2. **Upstash Redis Rate Limit Tokens:**
   - In Upstash Console, regenerate REST token.
   - Update `UPSTASH_REDIS_REST_TOKEN` in Vercel and redeploy.
3. **Sentry DSN:**
   - In Sentry Settings → Client Keys, rotate or create a new DSN.
   - Update `SENTRY_DSN` and `NEXT_PUBLIC_SENTRY_DSN` in Vercel.

---

### 4. Admin Recovery Procedure
1. **Emergency Administrator Elevation:**
   - If all administrators lose access or lockout occurs, access the production Supabase SQL Editor:
     ```sql
     UPDATE public.profiles
     SET role = 'ADMIN'
     WHERE id = (
       SELECT id FROM auth.users WHERE email = 'admin@chocobliss.com' LIMIT 1
     );
     ```
2. **MFA Reset:**
   - If an admin loses their MFA authenticator:
     ```sql
     DELETE FROM auth.mfa_factors
     WHERE user_id = (SELECT id FROM auth.users WHERE email = 'admin@chocobliss.com' LIMIT 1);
     ```
   - User re-authenticates with email/password and re-enrolls MFA.

---

### 5. Restore From Backup Procedure
1. **Daily Automated Backups:**
   - Supabase automatically takes scheduled backups (PITR available on Pro plan).
   - Download the target backup `.sql` snapshot from Supabase Dashboard → Database → Backups.
2. **Restoring to Database:**
   - Set application to maintenance mode if needed.
   - Restore schema and data:
     ```bash
     psql "$DATABASE_URL" -f backup.sql
     ```
3. **Verification:**
   - Run post-restore sanity check:
     ```bash
     cd frontend && npm test
     ```

---

### 6. Failed Migration Procedure
1. **Atomic Postgres Transactions:**
   - All migrations are wrapped in `BEGIN; ... COMMIT;`.
   - If any SQL statement encounters an error, Postgres aborts the entire transaction and leaves the database completely untainted.
2. **Inspection:**
   - Run `supabase migration list` to check which migrations succeeded and which was not applied.
3. **Resolution:**
   - Fix the syntax or constraint error in a new migration or before re-running.
   - Never delete records from `supabase_migrations.schema_migrations` manually without owner sign-off.

