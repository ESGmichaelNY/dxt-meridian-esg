# Code Review Command

Carefully perform a comprehensive code review of $ARGUMENTS.

---

## Review Standards

The following files are created as **excellent examples of best practices**.  
All new code should match their design, style, and conventions.

- `components/features/organizations/UserProfile.tsx`  
  *Best practices for React components:*  
  - Component structure and prop typing  
  - Accessibility-first markup  
  - Minimal state, memoization for derived data  
  - Clean imports and naming conventions  

- `lib/utils/validation.ts`  
  *Best practices for utility modules:*  
  - Centralized zod schemas and parsers  
  - Clear, consistent error handling  
  - Reusable validation helpers and type guards  

- `hooks/queries/use-user-data.ts`  
  *Best practices for custom hooks:*  
  - Remote state handling (`idle/loading/success/error`)  
  - zod validation at API boundaries  
  - Stable identities via `useCallback`/`useMemo`  
  - Proper async cleanup with `AbortController`  

> **Note:** Each of the exemplar files includes a header comment stating it is an “excellent example of best practices.” Use them as the house style for structure, typing, validation, and error handling.

---

## Process

1. **First**: Read the example files above to understand our design patterns, naming conventions, and code style.
2. **Second**: Analyze $ARGUMENTS against these standards.
3. **Third**: Create a detailed critique covering:
   - Code structure and organization
   - Adherence to established patterns
   - Performance considerations
   - Security implications
   - Maintainability concerns
   - Test coverage gaps

---

## Output Requirements

- Save review as `ai-code-reviews/{filename}.review.md` for each file reviewed.
- Include specific line references for issues.
- Provide concrete suggestions for improvements.
- Rate overall quality: **Excellent / Good / Needs Improvement / Poor**.
- Estimate refactoring effort: **Low / Medium / High**.

---

## Review Checklist

Use this checklist while reviewing. It directly reflects the patterns in our exemplars.

### General
- [ ] File and folder naming follows repo conventions (kebab-case for hooks, PascalCase for components).
- [ ] Imports are ordered and minimal; no unused symbols.
- [ ] Types are explicit; no `any` or unsafe casts unless justified.
- [ ] No hardcoded secrets, magic numbers, or environment-specific assumptions.
- [ ] Comments and docs (TSDoc) are clear and purposeful.

### Components (see `components/features/organizations/UserProfile.tsx`)
- [ ] Props are fully typed and minimal; avoids prop drilling where possible.
- [ ] Accessible by default (semantic elements, proper `alt`, ARIA where needed).
- [ ] UI-only derivations use `useMemo`; component is otherwise stateless/presentational.
- [ ] Clean separation of presentation vs. data fetching/business logic.
- [ ] Handles empty/missing optional props gracefully (e.g., avatar fallback).

### Utilities (see `lib/utils/validation.ts`)
- [ ] Uses zod for validation; common scalars (UUID, Email, ISODateString) reused.
- [ ] Provides helpers (`parseOrThrow`, `result`, `makeGuard`) for consistent error/reporting.
- [ ] Functions are pure, deterministic, and side-effect free.
- [ ] Clear error messages; stable prefixes for easier debugging.
- [ ] Exports are intentional; no leaking of internal helpers unless needed.

### Hooks (see `hooks/queries/use-user-data.ts`)
- [ ] Remote state follows `idle / loading / success / error` pattern.
- [ ] All external data validated at the boundary with zod; data normalized (e.g., date coercion).
- [ ] `AbortController` used to cancel in-flight requests on param change/unmount.
- [ ] Stable references via `useCallback` / `useMemo`; no conditional hooks.
- [ ] Returns a predictable, typed API with booleans (`isIdle`, `isLoading`, `isError`, `isSuccess`) and `refetch`.

### Security
- [ ] Inputs validated before use; untrusted data never used directly.
- [ ] No exposure of sensitive info in errors or logs.
- [ ] Proper handling of HTTP errors and edge cases (timeouts, aborts, non-2xx).

### Performance
- [ ] Avoids unnecessary re-renders (memoization, stable identities).
- [ ] Avoids heavy work in render paths; defers with effects or memo where appropriate.
- [ ] Network calls batched/limited where sensible; avoids duplicate fetches.

### Maintainability
- [ ] Code is easy to read and logically organized; minimal nesting.
- [ ] Reusable pieces extracted into utilities/hooks as appropriate.
- [ ] Tests cover critical paths; clear strategy for unit vs. integration (RTL/MSW) where applicable.

---

## Pass/Fail Guidance

✅ **Pass if:** Code aligns with the style and conventions shown in the exemplars; validation and error handling are consistent; APIs are typed and predictable.  
❌ **Fail if:** Code introduces untyped props, bypasses validation, duplicates patterns, or diverges materially from established best practices.