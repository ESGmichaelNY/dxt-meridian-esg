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

## Contributor Self-Check
Before assigning reviewers, please verify:

### Code Quality
- [ ] Code follows our exemplar patterns (UserProfile.tsx, validation.ts, use-user-data.ts)
- [ ] Naming conventions followed (PascalCase components, kebab-case hooks/utils)
- [ ] No `any` types or unsafe casts
- [ ] Imports are organized and minimal
- [ ] Comments/TSDoc added where necessary

### Testing
- [ ] Tests written for new functionality
- [ ] All tests pass (`pnpm test`)
- [ ] Coverage meets 80% threshold
- [ ] Edge cases considered and tested

### Security
- [ ] All inputs validated with Zod
- [ ] No service role keys in frontend code
- [ ] RLS policies added/updated if database changes
- [ ] No hardcoded secrets or magic values
- [ ] XSS and SQL injection prevention considered

### Performance
- [ ] Unnecessary re-renders avoided
- [ ] Heavy computations memoized
- [ ] API calls properly cached/debounced
- [ ] Bundle size impact considered

## Review Standards
This PR follows the design patterns from our golden exemplars:
- `components/features/organizations/UserProfile.tsx` - Component patterns
- `lib/utils/validation.ts` - Validation patterns
- `hooks/queries/use-user-data.ts` - Data fetching patterns

## Testing Instructions
<!-- How can reviewers test these changes? -->

1. 
2. 
3. 

## Screenshots
<!-- If applicable, add screenshots to help explain your changes -->

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published

## Reviewer Notes
<!-- Any additional context, concerns, or follow-up tasks -->
