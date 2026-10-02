# TRD: Chocobliss Coffee Shop Website

## 1. Tech Stack
| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Auth | Supabase Auth |
| Database | Supabase Postgres + RLS |
| Storage | Supabase Storage |
| Deployment | Vercel |
| CI/CD | GitHub to Vercel |
| Rate Limiting | @universal-rate-limit/nextjs (token-bucket) |
| Validation | Zod |
| Video | FFmpeg + HandBrake (WebM/MP4) |
| Animation | Framer Motion + Lottie |

## 2. Security Layers
1. Authentication — Supabase Auth JWT
2. Authorization — RLS on every table
3. Input Validation — Zod schemas
4. Rate Limiting — token-bucket per IP + per user
5. Monitoring — Supabase logs + Vercel Analytics
6. Encryption — bcrypt passwords, HTTPS

## 3. Environment Variables
| Variable | Exposure | Purpose |
|---|---|---|
| NEXT_PUBLIC_SUPABASE_URL | Public | Supabase URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Public | Client anon key |
| SUPABASE_SERVICE_ROLE_KEY | Secret | Server-only |
| RATE_LIMIT_SECRET | Secret | Token bucket signing |
| ADMIN_EMAILS | Secret | Admin email list |

Rule: Never prefix secrets with NEXT_PUBLIC_. Mark all secrets as Secret type on Vercel.

## 4. Database Schema
Tables: profiles, products, orders, site_content.
Every table must have RLS enabled with explicit policies:
- profiles: users see own, admins see all
- products: public read, admin write
- orders: users see own, admins see all
- site_content: public read, admin write

## 5. Rate Limiting
- Public bucket: 20 tokens, refill 5 per 10s
- Auth bucket: 5 tokens, refill 1 per 60s
- Admin bucket: 100 tokens, refill 20 per 10s
- Empty bucket returns 429 with Retry-After

## 6. Input Validation
Zod schemas for every API route. Never trust client input.

## 7. Performance
- next/image with tuned sizes
- priority only for LCP
- IntersectionObserver lazy loading for videos
- SWR caching 5 min for public data
- Vercel Edge Cache for static assets

## 8. Error Handling
- Generic client messages
- Full errors logged server-side only
- 404 custom page, 500 error boundary

## 9. Deployment
- main branch to Vercel production
- Preview deployments for PRs
- Secrets in Vercel dashboard only
- .env.local gitignored, .env.example committed
