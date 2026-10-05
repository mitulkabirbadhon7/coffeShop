# Chocobliss — Antigravity Agent Rules

## 1. Mandatory Reading
Before every phase, read:
- `docs/PROJECT_OVERVIEW.md`
- `docs/PRD.md`
- `docs/TRD.md`
- `docs/ARCHITECTURE.md`
- `docs/SCHEMA.md`
- `docs/SECURITY.md`
- `docs/TESTING.md`
- `docs/IMPLEMENTATION.md`
- this file

Then read the phase-specific requirements.

## 2. Scope Discipline
Implement only the requested phase unless a dependency is genuinely required.
Do not rewrite unrelated code.

## 3. Security
Security is never optional.
Never:
- expose secrets
- trust client roles
- bypass RLS
- store passwords
- disable validation to make tests pass
- weaken authorization
- log sensitive credentials

## 4. Code Style
- TypeScript strict
- readable names
- focused functions
- clear errors
- no unnecessary `any`
- no dead code
- no duplicated business logic
- OOP only where it provides real value
- keep UI, business logic, and data access separated

## 5. Validation
All untrusted input must be validated with the approved schema strategy.

## 6. Database
Do not query the database directly from presentational components.
Use the approved server/data-access layer.

## 7. Auth
Use Supabase Auth.
Never create a second password/authentication system.

## 8. RLS
Never disable RLS as a shortcut.
Add or update policies deliberately and test cross-user isolation.

## 9. Testing
After implementation:
- lint
- typecheck
- unit tests
- integration/security tests relevant to the phase
- build
- E2E where applicable

If a test fails:
1. diagnose it
2. fix it if within scope
3. otherwise report it clearly

Never claim the phase is complete with hidden failures.

## 10. Documentation
If implementation changes architecture/schema/security behavior, update the relevant documentation.

Update `docs/IMPLEMENTATION.md` after each completed phase.

## 11. Git Safety
Before completion:
- inspect `git status`
- inspect `git diff`
- ensure secrets are not staged
- ensure unrelated changes are not accidentally included

Provide:
- commit message
- exact add/commit/push commands
- branch reminder
- next phase

## 12. Dependency Discipline
Do not install a package unless:
- it solves a real requirement
- the package is maintained
- it is compatible with the stack
- its security/license implications are acceptable

## 13. UI Rules
Follow the design system.
Do not introduce:
- generic SaaS styling
- excessive rounded cards
- purple gradients
- arbitrary component styles
- inconsistent typography

## 14. Performance
Do not make a feature work by unnecessarily converting Server Components to Client Components.
Avoid unnecessary JavaScript.
Lazy-load heavy media.

## 15. Accessibility
Every UI feature must be keyboard usable and semantically structured.
Respect `prefers-reduced-motion`.

## 16. Completion Report
At the end of each phase report:
- what changed
- files changed
- tests executed
- test results
- security checks
- build result
- documentation updated
- known issues
- git commands
- next phase

## 17. Ambiguity Rule
If requirements conflict or are materially ambiguous, stop before making a potentially destructive architectural decision and explain the ambiguity.

## 18. No Fake Completion
Never say:
- "all tests pass" without running them
- "secure" without performing relevant checks
- "production ready" when required gates are failing
- "implemented" when only a placeholder exists

## Phase Start Protocol
1. Read AGENT_RULES.md (once per session)
2. Read SECURITY.md (before any auth/DB/admin work)
3. Read SCHEMA.md (before any migration)
4. Read the current phase section in IMPLEMENTATION.md
5. Do NOT re-read other docs unless the phase explicitly requires it
6. Before writing any file, check if it already exists — do not overwrite

---

# 🆕 SELLABLE-GRADE ADDITIONS

## 19. Stack Lock — No Version Guessing
Before Phase 1, read `docs/STACK.md`. It pins the exact version of every package.
- Never install a package version that is not listed in `STACK.md`.
- Never install `latest`, `next`, `^`, or `~` without explicit owner approval.
- If a version in `STACK.md` is unavailable, STOP and ask the owner.
- Record the exact installed versions in `docs/TRACKING.md` after `npm install`.

If `docs/STACK.md` is missing, STOP before Phase 1 and ask the owner to create it.

## 20. Blocked-State Protocol
If blocked for more than 2 attempts on the same error:
1. STOP. Do not retry a third time with the same approach.
2. Create `BLOCKED.md` at project root with:
   - Phase number
   - Exact error (full message, not summary)
   - 3 approaches attempted and why each failed
   - 2–3 proposed solutions with pros/cons
   - Files touched and current git status
3. Reply to the owner: "Phase N blocked. See BLOCKED.md."
4. Wait for the owner's instruction. Do not proceed.
5. Delete `BLOCKED.md` after resolution.

Never comment out a failing test. Never skip a failing check. Never mark a phase complete while blocked.

## 21. Owner Review Checklist (Per Phase)
At the end of every phase, print this exact block so the owner can verify:
