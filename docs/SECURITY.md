# Chocobliss — Security Specification

## 1. Security Principles
Security is required at every trust boundary.

Never trust:
- browser state
- hidden form fields
- client roles
- client-generated prices
- arbitrary redirect URLs
- user-supplied HTML
- forwarded IP headers without trusted infrastructure handling

## 2. Authentication
Supabase Auth is the sole password authentication provider.
Application code must not store passwords.

Required:
- secure SSR sessions
- secure cookies
- email verification
- password reset
- OAuth callback validation
- logout/session invalidation

## 3. Authorization
Every protected operation must validate:
1. session
2. identity
3. role
4. resource ownership/permission

## 4. RLS
Every exposed application table has RLS enabled and explicit policies.
Cross-user tests are mandatory.

## 5. Input Validation
Use Zod on all external input.
Reject malformed, oversized, unexpected, or invalid values.

## 6. SQL Injection
Use Supabase's parameterized/query-builder APIs.
Do not construct SQL from raw untrusted strings.

## 7. XSS
- Escape/render user content safely.
- Avoid unsafe HTML injection.
- If HTML rendering is ever required, sanitize with a reviewed sanitizer and narrow allowlist.

## 8. CSRF
For cookie-authenticated mutations, use the framework/Supabase-supported protections and an explicit CSRF strategy where required by the chosen request architecture.

## 9. Rate Limiting
Protect:
- login
- signup
- reset
- contact
- newsletter
- public mutations
- admin-sensitive mutations

Do not rely solely on in-memory rate limiting in a distributed serverless environment.

## 10. Headers
Use appropriate:
- Content-Security-Policy
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy
- frame-ancestors/clickjacking protection
- Strict-Transport-Security in production

Exact CSP directives must be compatible with Supabase, Vercel, video, fonts, and analytics actually used.

## 11. Secrets
Never commit:
- service role keys
- private API keys
- database passwords
- OAuth secrets

Use environment variables and platform secret storage.

## 12. File Uploads
Validate:
- authenticated admin
- authorization
- MIME type
- extension
- size
- filename
- storage path

Do not trust file extensions alone.

## 13. Error Handling
Production errors must be generic.
Server logs may contain diagnostic information but must not log passwords, tokens, secrets, or unnecessary personal data.

## 14. Audit Logging
Log security-sensitive administrative actions.
Avoid storing secrets or unnecessary sensitive data.

## 15. Security Testing
Required:
- RLS isolation
- IDOR
- privilege escalation
- unauthorized admin access
- XSS
- SQLi
- rate-limit bypass
- secret exposure
- malformed input
- authentication bypass

## 16. Security Release Gate
A release is blocked if:
- critical security test fails
- secrets are exposed
- cross-user access is possible
- unauthorized admin access is possible
- a known high/critical dependency vulnerability is introduced without documented acceptance
