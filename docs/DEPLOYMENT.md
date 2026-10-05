# Chocobliss — Production Deployment Guide

## 1. Architecture Overview
Chocobliss is architected as a high-performance Next.js 14 App Router application deployed on Vercel with serverless compute and edge routing, connected to a hardened Supabase managed PostgreSQL database and Upstash Redis rate-limiting cluster.

```text
[ Vercel Edge / CDN ]
        │
        ▼
[ Next.js 14 Serverless Engine ] (Route Handlers, Server Actions, SSR)
   ├── Content-Security-Policy & Security Headers
   ├── CSRF & In-Flight Origin Verification
   └── Centralized Rate Limiter (Upstash Redis)
        │
        ▼
[ Supabase PostgreSQL 15+ ]
   ├── Row Level Security (RLS) on all 11 tables
   ├── Hardened SECURITY DEFINER functions (search_path = '')
   ├── Auth Engine (TOTP MFA & Leaked Password Protection)
   └── Immutable Audit Trail (public.audit_logs)
```

---

## 2. Environment Variables Configuration

Set these variables in **Vercel Project Settings → Environment Variables**:

| Variable Name | Environment | Purpose | Sensitivity |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production & Preview | Canonical base URL (`https://chocobliss.coffee`) | Public |
| `NEXT_PUBLIC_SUPABASE_URL` | Production & Preview | Supabase project REST & Auth URL | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production & Preview | Supabase client anon public key | Public |
| `SUPABASE_SERVICE_ROLE_KEY` | Production & Preview | Server-only admin actions & role management | **Secret** (Never expose to client) |
| `UPSTASH_REDIS_REST_URL` | Production & Preview | Upstash Redis REST endpoint for rate-limiting | Public |
| `UPSTASH_REDIS_REST_TOKEN` | Production & Preview | Upstash Redis REST bearer token | **Secret** |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Production & Preview | Cloudflare Turnstile bot protection | Public |
| `TURNSTILE_SECRET_KEY` | Production & Preview | Cloudflare Turnstile verification secret | **Secret** |

---

## 3. Vercel Deployment Checklist

### Step 1: Link Repository to Vercel
1. Import the Git repository in Vercel.
2. Set Root Directory to `frontend`.
3. Framework Preset: **Next.js**.
4. Node.js Version: **20.x**.

### Step 2: Configure Build Settings
- Build Command: `next build` (or `npm run build`)
- Output Directory: `.next`
- Install Command: `npm ci`

### Step 3: Configure Custom Domain
1. In Vercel Project Settings → Domains:
   - Add `chocobliss.coffee` and `www.chocobliss.coffee`.
   - Point DNS A / CNAME records to Vercel's Anycast IP (`76.76.21.21`).
2. SSL/TLS certificates will be automatically provisioned by Let's Encrypt with auto-renewal.

---

## 4. Production Health Checks & Monitoring

The system exposes an automated health endpoint:
- **URL**: `GET /api/health`
- **Output**:
  ```json
  {
    "status": "healthy",
    "timestamp": "2026-10-05T12:00:00.000Z",
    "database": "connected",
    "categoriesCount": 5
  }
  ```
- **Uptime Monitoring**: Configure Better Stack, Pingdom, or Datadog to poll `/api/health` every 60 seconds with an HTTP 200 requirement.

---

## 5. Security & Pre-Launch Audit Verification

1. **Row Level Security (RLS)**:
   - 11/11 tables protected with RLS.
   - All `auth.uid()` invocations wrapped with subqueries `(select auth.uid())` for 0 initplan performance warnings.
   - All `SECURITY DEFINER` functions locked down with `SET search_path = ''`.
2. **HTTP Headers & Content Security Policy**:
   - `X-Frame-Options: DENY`
   - `X-Content-Type-Options: nosniff`
   - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
   - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
   - Strict CSP allowlisting Supabase, Cloudflare Turnstile, and Google Fonts.
3. **Secret Leak Prevention**:
   - Automated secret scanning in CI prevents staging or bundling service role keys.
