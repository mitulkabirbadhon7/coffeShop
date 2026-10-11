# Chocobliss — Capacity Target

## Launch Scale
- Expected MAU: 5,000
- Expected DAU: 300
- Peak RPS: 20
- Peak concurrent users: 100

## Growth Scale (6–12 months)
- MAU: 50,000
- Peak RPS: 80
- Peak concurrent users: 500

## Plan Tiers
- Supabase: Free → Pro at 40,000 MAU
- Vercel: Hobby → Pro at 3,000 daily deploys
- Upstash Redis: Free → Pay-as-you-go at 10k commands/day
- CDN for video: Bunny.net (required, not Vercel)

## Required Infrastructure
- Rate limit store: Upstash Redis (serverless-safe)
- Video CDN: Bunny.net or Cloudflare Stream
- Database connection: Supabase PgBouncer (transaction mode)
- Caching: Next.js ISR + React Query (5 min staleTime)

## Non-Negotiables
- Never in-memory rate limiting (breaks serverless)
- Never serve videos from Vercel origin
- Never unbounded queries (always paginate)
- Every table needs indexes on foreign keys and filter columns

## Performance Budgets
- Home LCP: < 2.0s
- Menu LCP: < 2.2s
- Admin LCP: < 2.5s
- Total JS (gz): < 200 KB per page
- Total video payload: < 6 MB across site
- Total fonts: < 80 KB

## Alerts
- If RPS > 50 sustained → upgrade Vercel
- If DB size > 400 MB → upgrade Supabase
- If Redis commands > 8k/day → upgrade Upstash