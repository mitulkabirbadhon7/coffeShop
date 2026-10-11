# Chocobliss — Locked Stack

Every package version is pinned. Never install `latest`.
If a version is unavailable, STOP and ask the owner.

## Runtime
- Node.js: 20.x LTS (minimum 18.18)
- Package manager: npm 10.x
- TypeScript: 5.6.x (strict, noUncheckedIndexedAccess)

## Framework
- next: 15.0.x
- react: 19.0.x
- react-dom: 19.0.x

## Styling
- tailwindcss: 3.4.x
- postcss: 8.4.x
- autoprefixer: 10.4.x
- @tailwindcss/typography: 0.5.x

## Data & Auth
- @supabase/supabase-js: 2.45.x
- @supabase/ssr: 0.5.x
- zod: 3.23.x
- server-only: 0.0.1

## Rate Limiting & Bot Protection
- @upstash/ratelimit: 2.0.x
- @upstash/redis: 1.34.x
- @marsidev/react-turnstile: 0.7.x

## UI Utilities
- lucide-react: 0.451.x
- clsx: 2.1.x
- tailwind-merge: 2.5.x

## Motion (only if phase requires)
- framer-motion: 11.11.x
- lottie-react: 2.4.x

## Testing
- vitest: 2.1.x
- @vitest/coverage-v8: 2.1.x
- @testing-library/react: 16.0.x
- @testing-library/jest-dom: 6.5.x
- @testing-library/user-event: 14.5.x
- jsdom: 25.0.x
- @playwright/test: 1.48.x
- @axe-core/playwright: 4.10.x

## Tooling
- eslint: 9.13.x
- eslint-config-next: 15.0.x
- @typescript-eslint/eslint-plugin: 8.11.x
- @typescript-eslint/parser: 8.11.x
- prettier: 3.3.x
- husky: 9.1.x
- lint-staged: 15.2.x
- @next/bundle-analyzer: 15.0.x

## Monitoring
- @sentry/nextjs: 8.35.x

## Rules
- No `moment`, no full `lodash`, no `axios` (use fetch).
- Any package > 20 KB gzipped requires owner approval.
- Every icon comes from lucide-react.
- Run `ANALYZE=true npm run build` after UI phases.