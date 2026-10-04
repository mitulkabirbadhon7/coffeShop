# Chocobliss — Testing Strategy

## 1. Goals
Testing must verify functionality, security, accessibility, and regression safety.

## 2. Test Pyramid

```text
          E2E
       Integration
     Unit / Utilities
```

Use unit tests for deterministic logic, integration tests for boundaries, and E2E for critical user journeys.

## 3. Unit Tests
Cover:
- validation schemas
- formatters
- authorization helpers
- order transition rules
- business utilities
- data transformation
- error mapping

## 4. Integration Tests
Cover:
- auth flows where practical
- server actions
- route handlers
- Supabase data access
- RLS
- admin authorization
- product mutations
- order mutations

## 5. RLS Tests
Mandatory scenarios:
- user A cannot read user B profile
- user A cannot read user B orders
- user A cannot update user B data
- guest cannot read private records
- user cannot modify products
- user cannot read audit logs
- admin can perform authorized operations

## 6. E2E
Critical journeys:
- signup
- login
- logout
- OAuth
- password reset
- browse products
- filter products
- account/profile
- order history
- admin login
- product CRUD
- order status
- contact
- newsletter

## 7. Accessibility
Run automated axe checks against critical pages.
Also manually verify:
- keyboard navigation
- focus visibility
- modal behavior
- forms
- reduced motion
- headings/landmarks

## 8. Security
Test:
- XSS payload rejection/safe rendering
- SQL injection attempts
- IDOR
- role escalation
- forged admin role
- rate-limit thresholds
- forwarding-header spoof attempts
- secret exposure

## 9. Performance
Measure production builds.
Track:
- LCP
- CLS
- total blocking time where applicable
- JS payload
- image weight
- video impact

## 10. Coverage
Targets:
- 70%+ for core library/business logic
- 60%+ for API/server boundary logic
- 100% coverage for security-critical rules where practical

Coverage percentages are targets, not substitutes for meaningful tests.

## 11. CI Gate
Required:
- lint
- typecheck
- unit
- integration/security tests
- build
- configured E2E

Failures must be reported, never hidden.
