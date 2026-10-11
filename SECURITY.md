# Security Policy & Threat Model

## Threat Model Summary
This application uses a Next.js App Router front-end with a Supabase back-end. 
- **Authentication:** Handled by Supabase Auth (JWTs).
- **Authorization:** Handled via Postgres Row Level Security (RLS) policies.
- **Data Protection:** All sensitive API routes and Server Actions validate authentication status and inputs.
- **Client Security:** CSP is enforced. Forms are protected against CSRF and automated abuse via Cloudflare Turnstile.

## Security Checks & Results

| Check | Result | Command/Method |
|-------|--------|----------------|
| CSP & Security Headers | PASS | `npm run build && node tests/security-headers.js` |
| npm audit | PASS | `npm audit --omit=dev` (0 vulnerabilities after fix) |
| Secret Scan | PASS | `npx secretlint` / `git grep "SERVICE_ROLE_KEY"` (No leaks) |
| IDOR on orders | PASS | `vitest run advanced-security.test.ts` |
| Privilege escalation | PASS | `vitest run advanced-security.test.ts` |
| Mass assignment | PASS | `vitest run advanced-security.test.ts` |
| Open redirect | PASS | `vitest run advanced-security.test.ts` |
| Server Action origin | PASS | `vitest run advanced-security.test.ts` |
| Rate-limit bypass | PASS | `vitest run advanced-security.test.ts` |
| Storage bucket bypass | PASS | `vitest run advanced-security.test.ts` |
| Stored XSS | PASS | `vitest run advanced-security.test.ts` |
| User enumeration | PASS | `vitest run advanced-security.test.ts` |
| Session invalidation | PASS | `vitest run advanced-security.test.ts` |
| Admin without MFA | PASS | `vitest run advanced-security.test.ts` |

## Accepted Risks
| Risk | Owner Sign-off | Review Date |
|------|----------------|-------------|
| 'unsafe-inline' in style-src for Tailwind/Next.js | Owner | 2026-10-05 |
| 'unsafe-eval' removed from script-src (strict) | Owner | 2026-10-05 |

## Reporting a Vulnerability
Please email security@chocoblisscoffee.com with a description of the vulnerability. We will respond within 48 hours. Do not disclose vulnerabilities publicly until they have been patched.
