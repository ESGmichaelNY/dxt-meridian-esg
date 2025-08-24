# Engineering Best Practices & Review Guide

> This document consolidates and **supersedes** the contents of `CLAUDE.md`. It integrates
> the best elements we've discussed (exemplars, review standards, contributor & reviewer
> checklists, code review command, and key setup tips for Next.js 15 + React 19 + TS 5.9 +
> ESLint 9 (flat) + Tailwind v4 + Supabase). The original `CLAUDE.md` is preserved below
> in **Appendix A** for reference.

---

## 1) Golden Exemplars (copy/paste references)

These files are created as **excellent examples of best practices**. All new code should
match their design, style, and conventions.

- `components/features/organizations/UserProfile.tsx`  
  *Best practices for React components:*  
  - Component structure and prop typing  
  - Accessibility-first markup  
  - Minimal state, memoization/derivation outside of render when possible  
  - Clean imports and naming conventions  

- `lib/utils/validation.ts`  
  *Best practices for utility modules:*  
  - Centralized Zod schemas and parsers  
  - Clear, consistent error handling (`parseOrThrow`, `parseResult`, `makeGuard`)  
  - Reusable validation helpers and type guards  

- `hooks/queries/use-user-data.ts`  
  *Best practices for custom hooks:*  
  - Remote state handling (`idle`/`loading`/`success`/`error`)  
  - Zod validation at API boundaries; normalize types (e.g., ISO → `Date`)  
  - Stable identities via `useCallback`/`useMemo`; proper async cleanup with `AbortController`  

> Each exemplar has a header comment stating it is an **excellent example of best practices**.
> Treat these as the "house style" for structure, typing, validation, and error handling.

---

## 2) Code Review Command

Carefully perform a comprehensive code review of `$ARGUMENTS`.

### Review Standards
(Refer to the exemplars above.)

### Process
1. **First**: Read the example files above to understand our design patterns, naming conventions, and code style.  
2. **Second**: Analyze `$ARGUMENTS` against these standards.  
3. **Third**: Create a detailed critique covering:
   - Code structure and organization
   - Adherence to established patterns
   - Performance considerations
   - Security implications
   - Maintainability concerns
   - Test coverage gaps

### Output Requirements
- Save each review as `ai-code-reviews/{{filename}}.review.md`
- Include specific line references for issues
- Provide concrete suggestions for improvements
- Rate overall quality: **Excellent / Good / Needs Improvement / Poor**
- Estimate refactoring effort: **Low / Medium / High**

---

## 3) Reviewer Checklist

Use this checklist while reviewing. It mirrors our exemplars.

### General
- [ ] Naming follows conventions (PascalCase components, kebab-case hooks).
- [ ] Imports are ordered and minimal; no unused symbols.
- [ ] Types are explicit; no `any` or unsafe casts unless justified.
- [ ] No secrets, magic numbers, or environment-specific assumptions.
- [ ] Comments and docs (TSDoc) are clear and purposeful.

### Components (UserProfile.tsx)
- [ ] Props are fully typed and minimal; avoids prop drilling where possible.
- [ ] Accessible by default (semantic elements, proper `alt`, ARIA where needed).
- [ ] UI derivations done outside render or via `useMemo` if client.
- [ ] Presentation separate from data fetching/business logic.
- [ ] Handles optional props gracefully (e.g., avatar fallback).

### Utilities (validation.ts)
- [ ] Uses Zod for validation; common scalars (UUID, Email, ISODateString) reused.
- [ ] Helpers (`parseOrThrow`, `parseResult`, `makeGuard`) used consistently.
- [ ] Functions are pure, deterministic, and side-effect free.
- [ ] Clear error messages with stable prefixes.
- [ ] Intentional exports; no leaking internal helpers unless needed.

### Hooks (use-user-data.ts)
- [ ] Remote state follows `idle / loading / success / error`.
- [ ] External data validated at the boundary and normalized (e.g., `Date`).
- [ ] `AbortController` used to cancel in-flight requests.
- [ ] Stable references via `useCallback`/`useMemo`; no conditional hooks.
- [ ] Predictable API: `isIdle`, `isLoading`, `isError`, `isSuccess`, `refetch`.

### Security
- [ ] Inputs validated; untrusted data never used directly.
- [ ] No sensitive data in errors/logs.
- [ ] Proper HTTP error handling (timeouts, aborts, non-2xx).

### Performance
- [ ] Avoids unnecessary re-renders (memoization, stable identities).
- [ ] Heavy work not in render paths; uses effects/memo.
- [ ] Avoids duplicate fetches; batches where sensible.

### Maintainability
- [ ] Code is readable and logically organized; minimal nesting.
- [ ] Reusable pieces extracted into utilities/hooks where appropriate.
- [ ] Tests cover critical paths (unit for utils; RTL/MSW for hooks/components).

---

## 4) Contributor Self-Checklist

Before opening a pull request, verify your code aligns with our best practice exemplars.

### General
- [ ] File/folder names follow conventions (PascalCase components, kebab-case hooks).
- [ ] All types explicit; no `any` or unchecked casts.
- [ ] Imports ordered and minimal; remove unused imports.
- [ ] No secrets, hardcoded values, or magic numbers.
- [ ] Added/updated meaningful comments/docstrings.

### Components
- [ ] Props typed; A11y handled (`alt` text, ARIA, semantic HTML).
- [ ] Minimal local state; derived values memoized when client.
- [ ] Presentation and data fetching are separated.

### Utilities
- [ ] Inputs validated with Zod; reusable scalars leveraged.
- [ ] Functions are pure (no side effects).
- [ ] Errors consistent via helpers (`parseOrThrow`, `parseResult`, `makeGuard`).

### Hooks
- [ ] Remote state modeled as `idle / loading / success / error`.
- [ ] API data validated at the boundary and normalized.
- [ ] Cleanup logic included (e.g., `AbortController`).
- [ ] Stable references with `useCallback` / `useMemo`.

### Security & Performance
- [ ] All external data validated before use.
- [ ] No sensitive info leaked in errors/logs.
- [ ] Avoid unnecessary re-renders; use memoization where needed.

---

## 5) Project Conventions (Next.js 15 / React 19 / TS 5.9 / ESLint 9 / Tailwind v4)

- **Path alias:** in `tsconfig.json`
  ```json
  { "compilerOptions": { "baseUrl": ".", "paths": { "@/*": ["./*"] } } }
  ```
- **ESLint (flat) example:** `eslint.config.ts` with `typescript-eslint` meta-package and Next + React hooks rules.
- **Next config:**
  - Use `next.config.ts` (preferred) or `next.config.js` CJS. If `next.config.js`, export with `module.exports = nextConfig`.
  - Images: allow Supabase hosts via `remotePatterns`.
- **Tailwind v4:** configure in CSS via `@import "tailwindcss";`; no JS config needed.
- **pnpm strict builds:** run `pnpm approve-builds` once for `sharp`, Tailwind oxide, etc.

---

## 6) Supabase Patterns

- **Auth & SSR:** use `@supabase/supabase-js` + `@supabase/ssr` (cookie sessions). Avoid `@supabase/auth-ui-react` in React 19 projects.
- **Types:** generate DB types and type your clients:
  ```bash
  supabase gen types typescript --project-id <id> > types/database/generated.ts
  ```
  ```ts
  // lib/supabase/client.ts
  import { createClient } from "@supabase/supabase-js";
  import type { Database } from "@/types/database/generated";
  export const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  ```
- **Local dev:** `supabase init` → `supabase start` (Docker). Use Deno VS Code settings **only** in `supabase/functions/` if you build Edge Functions.
- **Typed mutations:** use `Table['Insert']` types; pass `null` not `undefined` where columns are nullable.

---

## 7) Architecture Notes (Meridian ESG)

- Feature-first UI under `components/features/*`.
- Business logic in `services/*` – split `*.server.ts` (secrets) vs `*.public.ts` (pure).
- API endpoints in `app/api/v1/*` with zod-validated inputs/outputs (co-locate endpoint schemas in `lib/api/endpoints/*`).
- Hooks in `hooks/queries/*` and `hooks/mutations/*`. Prefer **Server Components** for reads; use hooks for interactive client flows.
- State: prefer server state; use `stores/zustand` for ephemeral UI state only.
- Workers: decide runtime per job (Edge Functions vs. Node job runner) and document it in ARCHITECTURE.md.

---

## 8) PR Template (copy into `.github/pull_request_template.md`)

```md
# Pull Request

## Description
<!-- Briefly describe the changes in this PR -->

Closes #

## Contributor Self-Check
Before assigning reviewers, please go through the [Contributor Checklist](docs/CONTRIBUTOR_CHECKLIST.md).

## Review Standards
This PR should match the design, style, and conventions of our exemplar files:
- components/features/organizations/UserProfile.tsx
- lib/utils/validation.ts
- hooks/queries/use-user-data.ts

## Reviewer Checklist
- Naming conventions, imports tidy, explicit typing
- Components: a11y, minimal local state, separation of concerns
- Utilities: zod validation, pure functions, consistent errors
- Hooks: remote state pattern, zod at boundary, cleanup, stable refs
- Security/Performance: validate inputs, no sensitive logs, avoid extra renders

## Reviewer Notes
<!-- Add any additional comments, concerns, or follow-up tasks -->
```

---

## 9) Package Manager Policy (Corepack + pnpm)

**Why:** Reproducible installs across macOS/Linux/CI; no PATH/version drift from other installers.

**Rules**
1) **Pin the package manager** in `package.json`:
```json
{ "packageManager": "pnpm@10.15.0" }
```

2) **Enable Corepack** (once per machine and in CI):
```bash
corepack enable
corepack prepare pnpm@10.15.0 --activate
```

3) **Install dependencies**:
```bash
pnpm install --frozen-lockfile
```

4) **Avoid multiple pnpm installers**
```bash
brew uninstall pnpm || true
npm -g uninstall pnpm || true
```

**CI (GitHub Actions)**
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
- run: corepack enable
- run: corepack prepare pnpm@10.15.0 --activate
- run: pnpm install --frozen-lockfile
- run: pnpm verify
```

**Notes**
- Corepack ships with Node ≥ 16.13. Upgrade Node if needed.
- Devs may keep Brew-installed pnpm locally, but Corepack + `"packageManager"` governs CI and enforces the version.
- Do **not** mix npm -g and Corepack on the same repo.

---

## Testing Requirements

### Unit Testing Requirements
- [ ] Minimum 80% code coverage
- [ ] All utility functions tested
- [ ] All components tested
- [ ] All API routes tested
- [ ] All database functions tested

### RLS Testing Requirements
- [ ] Test matrix for each policy:
  - Different user roles
  - Cross-tenant access
  - Unauthorized access
  - Anonymous access
- [ ] Performance testing with large datasets
- [ ] Concurrent access testing

### Integration Testing Requirements
- [ ] Full user flows tested
- [ ] API integration tests
- [ ] Database transaction tests
- [ ] File upload/download tests

### Security Testing Requirements
- [ ] SQL injection tests
- [ ] XSS tests
- [ ] CSRF tests
- [ ] Authentication bypass attempts
- [ ] Authorization bypass attempts
- [ ] Rate limiting tests

### Performance Testing Requirements
- [ ] Page load times < 2 seconds
- [ ] API response times < 500ms
- [ ] Database query times < 100ms
- [ ] Concurrent user testing

---

## Security Checklist (Run Before Each Commit)

### Environment & Keys
- [ ] Service role key NEVER in frontend code
- [ ] Environment variables validated
- [ ] No secrets in code
- [ ] .env.local not committed

### Database Security
- [ ] RLS enabled on all tables
- [ ] Policies tested and documented
- [ ] No direct database access from frontend
- [ ] Input validation on all queries

### Authentication & Authorization
- [ ] Password requirements enforced
- [ ] Email verification enabled
- [ ] Session management secure
- [ ] RBAC properly implemented

### Input Validation
- [ ] All inputs validated with Zod
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] File upload validation

### Testing
- [ ] All tests pass
- [ ] Security tests included
- [ ] Coverage > 80%
- [ ] No skipped tests

---

## Performance Optimization Requirements

- [ ] Database indexes on all foreign keys
- [ ] Database indexes on commonly queried fields
- [ ] JSONB GIN indexes where appropriate
- [ ] Query result caching implemented
- [ ] Lazy loading for large datasets
- [ ] Image optimization
- [ ] Code splitting implemented
- [ ] CDN for static assets
- [ ] React 19's improved hydration and streaming

---

## Monitoring & Logging Requirements

- [ ] Error logging configured
- [ ] Performance monitoring enabled
- [ ] Security event logging
- [ ] Audit trails for sensitive operations
- [ ] User activity tracking (privacy-compliant)
- [ ] Database query monitoring
- [ ] Rate limit monitoring

---

## Deployment Checklist

### Pre-deployment
- [ ] All tests pass
- [ ] Security audit complete (including npm audit)
- [ ] Performance benchmarks met
- [ ] Documentation updated
- [ ] Environment variables configured
- [ ] Database migrations tested

### Production Setup
- [ ] SSL/TLS configured
- [ ] Rate limiting enabled
- [ ] Monitoring configured
- [ ] Backup strategy implemented
- [ ] Disaster recovery plan
- [ ] Security headers configured

---

## Success Metrics

- **Code Quality:** 
  - 80%+ test coverage
  - 0 critical security issues
  - All linting rules pass (ESLint 9)
  - No npm vulnerabilities
- **Performance:** 
  - < 2 second page loads
  - < 500ms API responses
  - 99.9% uptime
- **Security:** 
  - Pass OWASP Top 10 audit
  - No data breaches
  - 100% RLS coverage
  - Regular security updates
- **Development Velocity:** 
  - 2-3 tasks completed per day
  - < 5% bug rate
  - All commits pass CI/CD

---

## Code References & Resources

1. **React 19 Docs:** [Official Release Blog](https://react.dev/blog/2024/12/05/react-19)
2. **Next.js 15.5 Security:** [Cache Poisoning Fix](https://github.com/advisories/GHSA-r2fc-ccr8-96c4)
3. **Supabase Security Best Practices:** [Official Docs](https://supabase.com/docs/guides/auth/row-level-security)
4. **Multi-tenant Architecture:** [GitHub - dikshantrajput/supabase-multi-tenancy](https://github.com/dikshantrajput/supabase-multi-tenancy)
5. **Next.js Supabase Starter:** [GitHub - imbhargav5/nextbase-nextjs-supabase-starter](https://github.com/imbhargav5/nextbase-nextjs-supabase-starter)
6. **Production SaaS Template:** [GitHub - Razikus/supabase-nextjs-template](https://github.com/Razikus/supabase-nextjs-template)
7. **RLS Testing Guide:** [Supabase RLS Testing](https://supabase.com/docs/guides/database/testing)
8. **ESLint 9 Migration Guide:** [ESLint Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files)
9. **Tailwind CSS 4 Docs:** [Tailwind CSS v4](https://tailwindcss.com/blog/tailwindcss-v4)

---

## Critical Reminders

⚠️ **NEVER**:
- Expose service role key to frontend
- Commit .env.local file
- Skip tests before committing
- Disable RLS on user tables
- Hardcode user IDs in policies
- Store passwords in plain text
- Trust user input without validation
- Ignore npm audit warnings

✅ **ALWAYS**:
- Create feature branch before changes
- Write tests before implementation
- Enable RLS on all user tables
- Document RLS policies
- Validate all inputs with Zod
- Use parameterized queries
- Check security requirements
- Run full test suite before commit
- Use ESLint 9 flat config for linting
- Configure Tailwind CSS 4 with @theme directive
- Leverage React 19's new features for better UX
- Keep dependencies updated for security
