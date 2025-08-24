# Pull Request

## Description
<!-- Briefly describe the changes in this PR -->

Closes #

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Contributor Self-Check ✅
Before assigning reviewers, please verify:

### General
- [ ] Created feature branch: `ai-feature-<name>`
- [ ] File/folder names follow conventions (PascalCase components, kebab-case hooks)
- [ ] All types explicit; no `any` or unchecked casts
- [ ] Imports ordered and minimal; removed unused imports
- [ ] No secrets, hardcoded values, or magic numbers
- [ ] Added/updated meaningful comments/TSDoc

### Components (if applicable)
- [ ] Props typed with TypeScript interfaces
- [ ] Accessibility handled (semantic HTML, ARIA labels, alt text)
- [ ] Minimal local state; derived values memoized
- [ ] Presentation and data fetching separated
- [ ] Follows `components/features/organizations/UserProfile.tsx` pattern

### Utilities (if applicable)
- [ ] Inputs validated with Zod
- [ ] Functions are pure (no side effects)
- [ ] Errors consistent via helpers (`parseOrThrow`, `result`, `makeGuard`)
- [ ] Follows `lib/utils/validation.ts` pattern

### Hooks (if applicable)
- [ ] Remote state modeled as `idle / loading / success / error`
- [ ] API data validated at boundary with Zod
- [ ] Cleanup logic included (AbortController)
- [ ] Stable references with `useCallback` / `useMemo`
- [ ] Follows `hooks/queries/use-user-data.ts` pattern

### Security & Performance
- [ ] All external data validated before use
- [ ] No sensitive info leaked in errors/logs
- [ ] RLS policies added/updated if touching database
- [ ] Avoided unnecessary re-renders; used memoization where needed
- [ ] Service role key NOT exposed to frontend

## Testing
- [ ] Tests written BEFORE implementation (TDD)
- [ ] All tests pass: `pnpm test`
- [ ] Test coverage ≥ 80%
- [ ] RLS policies tested (if applicable)
- [ ] Added unit tests
- [ ] Added integration tests (if applicable)

## Pre-Commit Verification
```bash
pnpm verify  # Must pass
pnpm build   # Must succeed
```

## Review Standards
This PR should match the design, style, and conventions of our exemplar files:
- `components/features/organizations/UserProfile.tsx`
- `lib/utils/validation.ts`
- `hooks/queries/use-user-data.ts`

## Screenshots (if UI changes)
<!-- Add screenshots here if there are visual changes -->

## Reviewer Notes
<!-- Add any additional context, concerns, or areas needing special attention -->

## Deployment Checklist (if applicable)
- [ ] Database migrations tested
- [ ] Environment variables documented
- [ ] Breaking changes communicated
- [ ] Performance impact assessed