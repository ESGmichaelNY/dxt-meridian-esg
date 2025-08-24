
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
  - Clear, consistent error handling (`parseOrThrow`, `result`, `makeGuard`)  
  - Reusable validation helpers and type guards  

- `hooks/queries/use-user-data.ts`  
  *Best practices for custom hooks:*  
  - Remote state handling (`idle`/`loading`/`success`/`error`)  
  - Zod validation at API boundaries; normalize types (e.g., ISO → `Date`)  
  - Stable identities via `useCallback`/`useMemo`; proper async cleanup with `AbortController`  

> Each exemplar has a header comment stating it is an **excellent example of best practices**.
> Treat these as the “house style” for structure, typing, validation, and error handling.

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
- [ ] Helpers (`parseOrThrow`, `result`, `makeGuard`) used consistently.
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
- [ ] Errors consistent via helpers (`parseOrThrow`, `result`, `makeGuard`).

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
- Business logic in `services/*` — split `*.server.ts` (secrets) vs `*.public.ts` (pure).
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

## Appendix A — Original `CLAUDE.md` (for reference)

# Meridian ESG - Task-Oriented Product Requirements Document

**Version:** 3.3  
**Date:** August 22, 2025  
**Development Approach:** Incremental with Claude Code  
**Technology Stack:** Next.js 15.5, React 19, Supabase, TypeScript, Tailwind CSS 4, ESLint 9

---

## 🔴 CRITICAL: Technology Stack Updates

### Current Stack Versions (Updated August 22, 2025)
- **Next.js:** 15.5.0 (security update, cache poisoning fix)
- **React:** 19.0.0 (latest stable with Server Components)
- **React DOM:** 19.0.0 (matching React version)
- **ESLint:** 9.33.0 (using new flat config system)
- **Tailwind CSS:** 4.0.0 (ground-up rewrite with better performance)
- **TypeScript:** 5.7.3 (latest stable)
- **Supabase:** Latest stable versions

### Recent Security Update
- **Next.js 15.3.0 → 15.5.0**: Fixed cache poisoning vulnerability (CVE GHSA-r2fc-ccr8-96c4)

### Key Configuration Changes

#### React 19 New Features
- Server Components and Actions are stable
- New hooks: `useActionState`, `useFormStatus`, `useOptimistic`
- Improved hydration error reporting
- Better support for custom elements
- Enhanced async handling

#### ESLint 9 Flat Config
- Configuration now in `eslint.config.js` (not `.eslintrc`)
- Better performance and simpler configuration
- Uses JavaScript objects instead of JSON
- All new ESLint features target v9

#### Tailwind CSS 4
- Configuration via CSS `@theme` directive (no `tailwind.config.js`)
- Automatic content detection
- 3.5x faster builds
- Uses `@tailwindcss/postcss` plugin

---

## 🔴 CRITICAL: Development Workflow Requirements

### Git Workflow - MANDATORY for Every Task
1. **Before ANY changes**: Create and checkout a feature branch
   ```bash
   git checkout -b ai-feature-<short-descriptive-name>
   ```
2. **Write automated tests** for ALL code before implementation
3. **Compile and pass ALL tests** before committing
   ```bash
   npm run build
   npm run test
   npm run lint
   ```
4. **Commit with clear messages** referencing the task ID
   ```bash
   git add .
   git commit -m "Task X.X: Description of changes"
   ```
5. **Never commit directly to main branch**

### Testing Requirements
- **Unit Tests**: Required for all functions, utilities, and components
- **Integration Tests**: Required for API routes and database operations
- **E2E Tests**: Required for critical user flows
- **RLS Policy Tests**: Required for all database security policies
- **Test Coverage**: Minimum 80% coverage required

---

## 🔐 Supabase Security Best Practices (MANDATORY)

### Row-Level Security (RLS) Requirements
1. **Enable RLS on ALL user-facing tables** - No exceptions
2. **Document every RLS policy** with comments explaining:
   - Who it applies to
   - What operation it controls
   - Business logic reasoning
3. **Use auth.uid() dynamically** - NEVER hardcode user IDs
4. **Test policies with multiple user roles** before deployment
5. **Add client-side filtering** in addition to RLS for performance
6. **Monitor policy performance** using Supabase logs

### Authentication Security Requirements
1. **Service role key protection**:
   - NEVER expose in frontend code
   - Only use in server-side/backend code
   - Store in environment variables
   - Rotate periodically
2. **Password policies**:
   - Minimum 12 characters
   - Require uppercase, lowercase, numbers, and symbols
   - Implement password strength meter
3. **Email verification**: Required for all new accounts
4. **MFA preparation**: Architecture must support future MFA implementation
5. **Rate limiting**: Implement on all auth endpoints
6. **Session management**: 
   - Secure cookie configuration
   - Automatic session refresh
   - Proper logout cleanup

### API Key Management
1. **Anon key**: Safe for frontend, limited by RLS
2. **Service role key**: Backend only, bypasses RLS
3. **Key rotation schedule**: Every 90 days
4. **Environment variables**: 
   - Never commit .env.local
   - Use .env.local.example for templates
   - Validate all env vars on startup

### Storage Security
1. **Bucket access levels**: Default to private
2. **Signed URLs**: Use for temporary file access
3. **File validation**: Type and size restrictions
4. **Virus scanning**: Plan for integration

### Input Validation & Sanitization
1. **Zod schemas** for all user inputs
2. **SQL injection prevention** through parameterized queries
3. **XSS prevention** through proper escaping
4. **CSRF protection** via SameSite cookies

---

## Executive Summary

Meridian ESG is a cloud-based ESG/Sustainability data management platform built on Supabase's multi-tenant architecture with security-first design principles. This PRD breaks down development into small, atomic tasks that can be completed incrementally while maintaining comprehensive test coverage and security best practices.

---

## Phase 1: Foundation & Infrastructure (Week 1)

### Task 1.1: Project Initialization
**Priority:** Critical  
**Estimated Time:** 2 hours  
**Dependencies:** None  
**Branch Name:** `ai-feature-project-init`

**Pre-implementation:**
- [ ] Create feature branch
- [ ] Write tests for environment validation

**Implementation:**
- [ ] Initialize Next.js 15 project with TypeScript and App Router
- [ ] Install core dependencies:
  ```bash
  npx create-next-app@latest meridian-esg --typescript --tailwind --app
  cd meridian-esg
  npm install @supabase/supabase-js @supabase/ssr
  npm install @supabase/auth-ui-react @supabase/auth-ui-shared
  npm install zod react-hook-form @hookform/resolvers
  npm install react@^19.0.0 react-dom@^19.0.0
  npm install next@15.5.0 eslint-config-next@15.5.0
  npm install eslint@^9.33.0
  npm install tailwindcss@^4.0.0 @tailwindcss/postcss@^4.0.0
  ```
- [ ] Configure TypeScript strict mode in `tsconfig.json`
- [ ] Setup ESLint 9 flat config in `eslint.config.js`
- [ ] Configure Tailwind CSS 4 with `@import "tailwindcss"` in globals.css
- [ ] Setup environment variables structure in `.env.local.example`
- [ ] Create environment validation with Zod

**Testing:**
- [ ] Test environment variable validation
- [ ] Test TypeScript configuration
- [ ] Test ESLint 9 flat config
- [ ] Verify React 19 features work
- [ ] Verify all dependencies installed

**Commit Checklist:**
- [ ] All tests pass
- [ ] Build succeeds
- [ ] Lint passes with ESLint 9
- [ ] Commit with message: "Task 1.1: Initialize project with Next.js 15.5 and React 19"

### Task 1.2: Supabase Local Development Setup
**Priority:** Critical  
**Estimated Time:** 1 hour  
**Dependencies:** Task 1.1  
**Branch Name:** `ai-feature-supabase-setup`

**Pre-implementation:**
- [ ] Create feature branch from updated main
- [ ] Write tests for Supabase configuration

**Implementation:**
- [ ] Install Supabase CLI
- [ ] Initialize Supabase in project:
  ```bash
  npx supabase init
  npx supabase start
  ```
- [ ] Configure `supabase/config.toml` with:
  - Email verification enabled
  - Strong password requirements
  - Session configuration
- [ ] Document local development setup in README.md
- [ ] Add Supabase scripts to package.json

**Testing:**
- [ ] Test Supabase connection
- [ ] Verify config.toml settings
- [ ] Test local database accessibility

**Commit Checklist:**
- [ ] All tests pass
- [ ] Supabase starts successfully
- [ ] Documentation complete
- [ ] Commit with message: "Task 1.2: Configure Supabase local development"

### Task 1.3: Supabase Client Configuration with Security
**Priority:** Critical  
**Estimated Time:** 3 hours  
**Dependencies:** Task 1.2  
**Branch Name:** `ai-feature-supabase-clients`
**Reference:** [Supabase Next.js Auth Helpers](https://github.com/supabase/supabase/tree/master/examples/user-management/nextjs-user-management)

**Pre-implementation:**
- [ ] Create feature branch
- [ ] Write tests for each client type
- [ ] Write tests for environment validation

**Implementation:**
Create modular Supabase client utilities with security best practices:

- [ ] Create `src/lib/supabase/client.ts` for browser client (anon key only)
- [ ] Create `src/lib/supabase/server.ts` for server client with SSR
- [ ] Create `src/lib/supabase/service.ts` for service role (with server-side validation)
- [ ] Create `src/lib/supabase/middleware.ts` for auth middleware
- [ ] Implement type-safe environment variable validation with Zod
- [ ] Add server-side check in service.ts to prevent client-side usage

```typescript
// Example with security validation
export function ensureServerSide() {
  if (typeof window !== 'undefined') {
    throw new Error('Service client can only be used on the server side')
  }
}
```

**Testing:**
- [ ] Unit tests for each client
- [ ] Test environment validation
- [ ] Test server-side validation
- [ ] Test error handling

**Commit Checklist:**
- [ ] All tests pass (100% coverage for security functions)
- [ ] No service role key exposure possible
- [ ] Build succeeds
- [ ] Commit with message: "Task 1.3: Implement secure Supabase clients"

---

## Phase 2: Multi-Tenant Data Model with RLS (Week 1-2)

### Task 2.1: Core Organizations Schema with RLS
**Priority:** Critical  
**Estimated Time:** 4 hours  
**Dependencies:** Task 1.3  
**Branch Name:** `ai-feature-organizations-schema`
**Pattern:** Multi-tenant with tenant_id isolation

**Pre-implementation:**
- [ ] Create feature branch
- [ ] Write RLS policy tests
- [ ] Document each policy purpose

**Implementation:**
Create migration file `supabase/migrations/001_organizations.sql`:

- [ ] Create organizations table with proper fields
- [ ] Create organization_invitations table
- [ ] Create organization_roles enum
- [ ] Implement audit fields (created_at, updated_at)
- [ ] Enable RLS on ALL tables
- [ ] Create documented RLS policies:

```sql
-- Policy: Users can only view organizations they belong to
-- Purpose: Enforce tenant isolation for data privacy
-- Applies to: All authenticated users
CREATE POLICY "org_select_policy"
  ON organizations FOR SELECT
  TO authenticated
  USING (id IN (SELECT get_user_organizations(auth.uid())));

-- Add similar documentation for all policies
```

**Testing:**
- [ ] Test RLS policies with different user roles
- [ ] Test unauthorized access attempts
- [ ] Test policy performance
- [ ] Test cascade deletes

**Commit Checklist:**
- [ ] All RLS tests pass
- [ ] Policies documented
- [ ] Migration runs successfully
- [ ] Commit with message: "Task 2.1: Create organizations schema with RLS"

### Task 2.2: User Profiles & Memberships with Security
**Priority:** Critical  
**Estimated Time:** 4 hours  
**Dependencies:** Task 2.1  
**Branch Name:** `ai-feature-user-profiles`
**Reference:** [Supabase Multi-tenancy Pattern](https://roughlywritten.substack.com/p/supabase-multi-tenancy-simple-and)

**Pre-implementation:**
- [ ] Create feature branch
- [ ] Write tests for profile creation
- [ ] Write tests for membership management
- [ ] Write RLS policy tests

**Implementation:**
- [ ] Create profiles table linked to auth.users
- [ ] Create organization_members junction table
- [ ] Create roles and permissions structure
- [ ] Add user_metadata and app_metadata handling
- [ ] Implement RLS policies with documentation
- [ ] Add validation triggers for data integrity

**Security Requirements:**
- [ ] Profiles can only be created for auth.users
- [ ] Users can only update their own profile
- [ ] Organization membership requires invitation or admin action
- [ ] Role changes require admin permission

**Testing:**
- [ ] Test profile CRUD operations
- [ ] Test membership creation/deletion
- [ ] Test role-based access
- [ ] Test RLS policy enforcement
- [ ] Test SQL injection attempts

**Commit Checklist:**
- [ ] All tests pass (including security tests)
- [ ] RLS policies tested and documented
- [ ] Build succeeds
- [ ] Commit with message: "Task 2.2: Implement secure user profiles and memberships"

### Task 2.3: Unified Temporal Data Model with Validation
**Priority:** Critical  
**Estimated Time:** 5 hours  
**Dependencies:** Task 2.2  
**Branch Name:** `ai-feature-temporal-data`
**SOLID Principle:** Open/Closed - Extensible via JSONB

**Pre-implementation:**
- [ ] Create feature branch
- [ ] Write tests for data validation
- [ ] Write tests for JSONB operations
- [ ] Write RLS policy tests

**Implementation:**
Create the core temporal_data table with security and validation:

- [ ] Design temporal_data table with JSONB for flexibility
- [ ] Add proper indexes for performance
- [ ] Create data_categories enum
- [ ] Implement version tracking
- [ ] Add input validation functions
- [ ] Create RLS policies with documentation
- [ ] Add data integrity constraints

```sql
-- Add validation function for temporal data
CREATE OR REPLACE FUNCTION validate_temporal_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate required fields in JSONB
  -- Validate date ranges
  -- Validate units match category
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Testing:**
- [ ] Test data insertion/updates
- [ ] Test JSONB queries
- [ ] Test validation functions
- [ ] Test RLS policies
- [ ] Test index performance
- [ ] Test concurrent access

**Commit Checklist:**
- [ ] All tests pass
- [ ] Validation functions tested
- [ ] Performance benchmarks met
- [ ] Commit with message: "Task 2.3: Create temporal data model with validation"

### Task 2.4: Comprehensive RLS Policies Implementation
**Priority:** Critical  
**Estimated Time:** 5 hours  
**Dependencies:** Task 2.3  
**Branch Name:** `ai-feature-rls-policies`
**Reference:** [Supabase RLS Best Practices](https://www.antstack.com/blog/multi-tenant-applications-with-rls-on-supabase-postgress/)

**Pre-implementation:**
- [ ] Create feature branch
- [ ] Design test scenarios for each policy
- [ ] Create test users with different roles

**Implementation:**
Implement comprehensive RLS policies with testing:

- [ ] Create helper function for tenant isolation (SECURITY DEFINER)
- [ ] Implement policies for organizations table
- [ ] Implement policies for temporal_data table
- [ ] Implement policies for profiles table
- [ ] Document each policy with comments
- [ ] Add policy performance monitoring

**Testing Requirements:**
- [ ] Test each policy with:
  - Owner role
  - Admin role
  - Member role
  - Viewer role
  - Unauthorized user
  - Anonymous user
- [ ] Test cross-tenant access attempts
- [ ] Test policy performance with large datasets
- [ ] Test bypass attempts

**Commit Checklist:**
- [ ] All RLS tests pass (100% coverage)
- [ ] No security vulnerabilities found
- [ ] Performance within acceptable limits
- [ ] Commit with message: "Task 2.4: Implement comprehensive RLS policies"

---

## Phase 3: Authentication & Authorization (Week 2)

### Task 3.1: Secure Authentication UI Components with React 19
**Priority:** High  
**Estimated Time:** 4 hours  
**Dependencies:** Task 2.4  
**Branch Name:** `ai-feature-auth-ui`
**Reference:** [Supabase Auth UI](https://github.com/supabase/auth-ui)

**Pre-implementation:**
- [ ] Create feature branch
- [ ] Write component tests
- [ ] Write integration tests
- [ ] Design error handling tests

**Implementation:**
- [ ] Create `app/auth/login/page.tsx` with:
  - Email/password validation
  - Rate limiting awareness
  - Error handling with React 19's improved error boundaries
  - Loading states using React 19 Suspense
- [ ] Create `app/auth/signup/page.tsx` with:
  - Password strength indicator
  - Email verification notice
  - Terms acceptance
  - Organization creation flow
  - Use React 19's `useFormStatus` for form state
- [ ] Create `app/auth/callback/route.ts` for OAuth handling
- [ ] Implement email verification flow
- [ ] Add password reset with security questions
- [ ] Add CAPTCHA for bot protection

**Security Requirements:**
- [ ] Password strength validation (12+ chars, mixed case, numbers, symbols)
- [ ] Email verification required
- [ ] Rate limiting indicators
- [ ] Secure error messages (no user enumeration)
- [ ] CSRF protection

**Testing:**
- [ ] Test authentication flows
- [ ] Test validation rules
- [ ] Test error scenarios
- [ ] Test loading states
- [ ] Test accessibility

**Commit Checklist:**
- [ ] All tests pass
- [ ] Security requirements met
- [ ] Accessibility standards met
- [ ] Commit with message: "Task 3.1: Implement secure authentication UI with React 19"

### Task 3.2: Protected Routes & Middleware with Session Management
**Priority:** High  
**Estimated Time:** 3 hours  
**Dependencies:** Task 3.1  
**Branch Name:** `ai-feature-protected-routes`

**Pre-implementation:**
- [ ] Create feature branch
- [ ] Write middleware tests
- [ ] Write session management tests

**Implementation:**
- [ ] Create authentication middleware with:
  - Session validation
  - Automatic refresh
  - Security headers
- [ ] Implement protected route wrapper
- [ ] Add organization context provider
- [ ] Create user session management
- [ ] Add activity timeout
- [ ] Implement secure logout
- [ ] Use React 19 Server Components for server-side auth checks

**Security Requirements:**
- [ ] Session cookies with Secure, HttpOnly, SameSite
- [ ] Automatic session refresh before expiry
- [ ] Activity timeout after 30 minutes
- [ ] Secure logout clearing all sessions

**Testing:**
- [ ] Test middleware with various scenarios
- [ ] Test session refresh
- [ ] Test timeout behavior
- [ ] Test concurrent sessions
- [ ] Test logout completeness

**Commit Checklist:**
- [ ] All tests pass
- [ ] Security headers implemented
- [ ] Session management secure
- [ ] Commit with message: "Task 3.2: Implement protected routes and session management"

### Task 3.3: Organization Management UI with RBAC
**Priority:** High  
**Estimated Time:** 5 hours  
**Dependencies:** Task 3.2  
**Branch Name:** `ai-feature-org-management`

**Pre-implementation:**
- [ ] Create feature branch
- [ ] Write component tests
- [ ] Write RBAC tests
- [ ] Write invitation flow tests

**Implementation:**
- [ ] Create organization creation flow with validation
- [ ] Build organization switcher component
- [ ] Implement member invitation system with:
  - Email validation
  - Expiry management
  - Role selection
  - Use React 19's `useOptimistic` for optimistic updates
- [ ] Add role management interface
- [ ] Create audit log for organization changes

**Security Requirements:**
- [ ] Only admins can invite members
- [ ] Invitations expire after 7 days
- [ ] Email verification for invitations
- [ ] Audit log for all changes
- [ ] Rate limiting on invitations

**Testing:**
- [ ] Test RBAC enforcement
- [ ] Test invitation flow
- [ ] Test expiry handling
- [ ] Test concurrent operations
- [ ] Test audit logging

**Commit Checklist:**
- [ ] All tests pass
- [ ] RBAC properly enforced
- [ ] Audit logging functional
- [ ] Commit with message: "Task 3.3: Implement organization management with RBAC"

---

## Phase 4: Core ESG Data Management (Week 3)

### Task 4.1: Validated Data Entry Forms with React 19
**Priority:** High  
**Estimated Time:** 6 hours  
**Dependencies:** Task 3.3  
**Branch Name:** `ai-feature-data-entry`
**SOLID Principle:** Single Responsibility

**Pre-implementation:**
- [ ] Create feature branch
- [ ] Write validation tests
- [ ] Write form component tests
- [ ] Write integration tests

**Implementation:**
Create modular data entry components with validation:

- [ ] Create emissions data entry form (Scope 1, 2, 3)
- [ ] Create social metrics form
- [ ] Create governance metrics form
- [ ] Implement form validation with Zod
- [ ] Use React 19's `useActionState` for form actions
- [ ] Add bulk upload capability
- [ ] Add draft saving with optimistic updates
- [ ] Add validation error handling

**Validation Requirements:**
- [ ] Input sanitization for all fields
- [ ] Range validation for numeric values
- [ ] Date range validation
- [ ] Unit consistency checks
- [ ] XSS prevention

**Testing:**
- [ ] Test each form with valid data
- [ ] Test validation rules
- [ ] Test error handling
- [ ] Test draft saving
- [ ] Test bulk upload
- [ ] Test SQL injection attempts
- [ ] Test XSS attempts

**Commit Checklist:**
- [ ] All tests pass
- [ ] Validation comprehensive
- [ ] Security tests pass
- [ ] Commit with message: "Task 4.1: Implement validated data entry forms with React 19"

### Task 4.2: Secure Data Grid & Management
**Priority:** High  
**Estimated Time:** 4 hours  
**Dependencies:** Task 4.1  
**Branch Name:** `ai-feature-data-grid`

**Pre-implementation:**
- [ ] Create feature branch
- [ ] Write grid component tests
- [ ] Write export/import tests

**Implementation:**
- [ ] Implement data table with:
  - Client-side filtering (in addition to RLS)
  - Sorting
  - Pagination
  - Column customization
  - Use React 19's improved performance features
- [ ] Add inline editing with validation
- [ ] Create data export functionality
- [ ] Build data import from CSV/Excel with validation

**Security Requirements:**
- [ ] Export respects RLS policies
- [ ] Import validates all data
- [ ] File upload size limits
- [ ] File type validation
- [ ] Sanitize imported data

**Testing:**
- [ ] Test grid performance with large datasets
- [ ] Test filtering and sorting
- [ ] Test inline editing
- [ ] Test export formats
- [ ] Test import validation
- [ ] Test malicious file uploads

**Commit Checklist:**
- [ ] All tests pass
- [ ] Performance benchmarks met
- [ ] Security validated
- [ ] Commit with message: "Task 4.2: Implement secure data grid"

### Task 4.3: Data Quality & Validation Engine
**Priority:** High  
**Estimated Time:** 4 hours  
**Dependencies:** Task 4.2  
**Branch Name:** `ai-feature-data-quality`
**SOLID Principle:** Interface Segregation

**Pre-implementation:**
- [ ] Create feature branch
- [ ] Write validation engine tests
- [ ] Write workflow tests

**Implementation:**
- [ ] Create validation rules engine
- [ ] Implement data completeness checks
- [ ] Add anomaly detection
- [ ] Build approval workflow
- [ ] Add data quality scoring
- [ ] Create quality dashboards

**Validation Rules:**
- [ ] Required field checks
- [ ] Range validations
- [ ] Cross-field validations
- [ ] Historical consistency
- [ ] Outlier detection

**Testing:**
- [ ] Test each validation rule
- [ ] Test workflow states
- [ ] Test anomaly detection
- [ ] Test quality scoring
- [ ] Test performance

**Commit Checklist:**
- [ ] All tests pass
- [ ] Validation engine performant
- [ ] Workflow states correct
- [ ] Commit with message: "Task 4.3: Implement data quality engine"

---

## Phase 5: Framework Compliance (Week 4)

### Task 5.1: Framework Standards Mapping with Validation
**Priority:** High  
**Estimated Time:** 6 hours  
**Dependencies:** Task 4.3  
**Branch Name:** `ai-feature-framework-mapping`
**SOLID Principle:** Open/Closed - New frameworks without modification

**Pre-implementation:**
- [ ] Create feature branch
- [ ] Write mapping tests
- [ ] Write validation tests

**Implementation:**
Create framework mapping with validation:

- [ ] Create framework standards tables
- [ ] Implement mapping validation
- [ ] Add version management
- [ ] Create mapping UI
- [ ] Add compliance checking

**Testing:**
- [ ] Test framework mappings
- [ ] Test version management
- [ ] Test compliance calculations
- [ ] Test mapping updates

**Commit Checklist:**
- [ ] All tests pass
- [ ] Mappings validated
- [ ] Commit with message: "Task 5.1: Implement framework mapping"

### Task 5.2: Secure Reporting Templates
**Priority:** Medium  
**Estimated Time:** 5 hours  
**Dependencies:** Task 5.1  
**Branch Name:** `ai-feature-report-templates`

**Pre-implementation:**
- [ ] Create feature branch
- [ ] Write template tests
- [ ] Write generation tests

**Implementation:**
- [ ] Create GRI reporting template
- [ ] Create ISSB reporting template
- [ ] Create TCFD reporting template
- [ ] Implement template customization
- [ ] Add template versioning
- [ ] Add access controls

**Security Requirements:**
- [ ] Templates respect RLS
- [ ] No data leakage
- [ ] Audit trail for exports
- [ ] Watermarking support

**Testing:**
- [ ] Test template generation
- [ ] Test customization
- [ ] Test access controls
- [ ] Test data isolation

**Commit Checklist:**
- [ ] All tests pass
- [ ] Templates secure
- [ ] Commit with message: "Task 5.2: Implement secure reporting templates"

### Task 5.3: Report Generation Engine with Audit Trail
**Priority:** Medium  
**Estimated Time:** 5 hours  
**Dependencies:** Task 5.2  
**Branch Name:** `ai-feature-report-engine`
**SOLID Principle:** Dependency Inversion

**Pre-implementation:**
- [ ] Create feature branch
- [ ] Write engine tests
- [ ] Write audit tests

**Implementation:**
- [ ] Build report data aggregation service
- [ ] Create PDF generation capability
- [ ] Implement Excel export
- [ ] Add audit trail generation
- [ ] Add report versioning
- [ ] Add digital signatures

**Security Requirements:**
- [ ] Audit trail for all reports
- [ ] Report versioning
- [ ] Access logging
- [ ] Data integrity checks
- [ ] Optional encryption

**Testing:**
- [ ] Test report generation
- [ ] Test audit trail
- [ ] Test versioning
- [ ] Test large reports
- [ ] Test concurrent generation

**Commit Checklist:**
- [ ] All tests pass
- [ ] Audit trail complete
- [ ] Performance acceptable
- [ ] Commit with message: "Task 5.3: Implement report generation engine"

---

## Testing Strategy

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

## Development Workflow with Claude Code

### For Each Task:
1. **Start Session**
   - Review PRD and current task
   - Check previous task completion
   - Create feature branch

2. **Pre-implementation**
   - Write tests first (TDD)
   - Document approach
   - Review security requirements

3. **Implementation**
   - Follow task checklist
   - Implement incrementally
   - Run tests frequently

4. **Validation**
   - Run all tests
   - Check security requirements
   - Verify performance
   - Run npm audit for vulnerabilities

5. **Commit**
   - Ensure all tests pass
   - Build succeeds
   - Lint passes with ESLint 9
   - No security vulnerabilities
   - Clear commit message

6. **Documentation**
   - Update relevant docs
   - Add inline comments
   - Update README if needed

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
