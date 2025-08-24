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