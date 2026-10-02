# Project Tracking & Engineering Standards

## Purpose
Defines development workflows, progress tracking, quality standards, and security enforcement at each phase.

## 1. Mandatory Checks Before Every Phase
- [ ] Read current phase from IMPLEMENTATION.md
- [ ] Verify .env.local exists and is gitignored
- [ ] Confirm all secrets use Secret type on Vercel
- [ ] Check no NEXT_PUBLIC_ prefix on sensitive keys
- [ ] Run git status, no .env files staged

## 2. After Every Phase
- [ ] npm run build passes with zero errors
- [ ] npm run lint passes with zero warnings
- [ ] Test mobile layout at 375px
- [ ] Test slow 3G throttling
- [ ] Verify no console errors
- [ ] Commit with proper message
- [ ] Push to GitHub
- [ ] Write phase review

## 3. Security Rules (Never Break)
- RLS enabled on every new table
- Zod validation on every API route
- Rate limiting on auth and admin routes
- Admin routes check role = 'admin' server-side
- Never log passwords, tokens, or full user objects
- Generic client errors
- Passwords hashed with bcrypt

## 4. Engineering Standards & Documentation
- Check official documentation before implementing APIs
- Use verified, production-ready package versions
- Maintain strict type safety across all interfaces
- Call out manual dashboard configuration steps explicitly

## 5. Commit Message Format
Type(scope): short description

Body explaining what and why.

Phase: N

Types: feat, fix, chore, docs, style, refactor, test, security
