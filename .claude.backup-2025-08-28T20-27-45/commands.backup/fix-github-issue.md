# Fix GitHub Issue

Analyze and fix the GitHub issue: $ARGUMENTS

## Workflow Steps

### 1. Issue Analysis
```bash
# View the issue details
gh issue view $ISSUE_NUMBER

# Check related issues
gh issue list --label "bug" --state open

# Review issue comments
gh issue view $ISSUE_NUMBER --comments
```

### 2. Create Feature Branch
```bash
# Create branch from main
git checkout main
git pull origin main
git checkout -b fix/issue-$ISSUE_NUMBER-brief-description

# Example: git checkout -b fix/issue-123-organization-sync-error
```

### 3. Understand the Problem
- Read issue description and reproduction steps
- Check error logs if provided
- Search codebase for related code:
  ```bash
  # Use Grep tool for searching
  grep -r "error message" --include="*.ts" --include="*.tsx"
  
  # Check specific directories
  ls app/api/  # For API issues
  ls components/  # For UI issues
  ls lib/db/  # For database issues
  ```

### 4. Implement the Fix

#### For Database Issues:
- Check Drizzle schema in `lib/db/schema.ts`
- Review migrations in `supabase/migrations/`
- Use Drizzle ORM for all queries (never Supabase client directly)
- Example fix:
  ```typescript
  // lib/db/server.ts
  import { getDb } from '@/lib/db/server'
  const db = getDb()
  // Use db for queries
  ```

#### For Authentication Issues:
- Check Clerk configuration in `middleware.ts`
- Review organization sync in `hooks/use-organization-sync.ts`
- Verify webhook handlers in `app/api/webhooks/clerk/route.ts`

#### For UI Issues:
- Components use Tailwind CSS v4
- Check for Clerk components (SignInButton, UserButton, etc.)
- Verify organization context if needed

### 5. Testing

```bash
# Run type checking
pnpm typecheck

# Run linting
pnpm lint

# Run tests
pnpm test

# Test locally
pnpm dev
# Navigate to http://localhost:3000
```

### 6. Verify Database Changes

If database schema changed:
```bash
# Generate new migration
pnpm drizzle:generate

# Apply migration
pnpm drizzle:push

# Update types
pnpm drizzle:pull
```

### 7. Commit Changes

```bash
# Stage changes
git add -A

# Commit with descriptive message
git commit -m "fix: resolve issue #$ISSUE_NUMBER - brief description

- Root cause: explain what was wrong
- Solution: explain what was changed
- Testing: mention how it was tested

Fixes #$ISSUE_NUMBER"
```

### 8. Create Pull Request

```bash
# Push branch
git push -u origin fix/issue-$ISSUE_NUMBER-brief-description

# Create PR with GitHub CLI
gh pr create \
  --title "Fix: Issue #$ISSUE_NUMBER - Brief Description" \
  --body "## Summary
  
Fixes #$ISSUE_NUMBER

## Problem
[Describe the issue]

## Solution
[Describe the fix]

## Testing
- [ ] Type checking passes
- [ ] Linting passes
- [ ] Tests pass
- [ ] Manual testing completed

## Screenshots
[If UI changes, add before/after screenshots]" \
  --base main

# Link PR to issue
gh issue develop $ISSUE_NUMBER --repo $REPO
```

### 9. Monitor CI/CD

```bash
# Check PR status
gh pr checks

# View workflow runs
gh run list

# Watch specific workflow
gh run watch
```

## Project-Specific Considerations

### Tech Stack
- **Next.js 15.5.0**: App Router patterns
- **Clerk**: Authentication and organizations
- **Drizzle ORM**: Database operations (NOT Supabase client)
- **PostgreSQL 17**: Via Supabase
- **Tailwind CSS v4**: Styling
- **TypeScript**: Strict mode enabled

### Common Issue Categories

#### 1. Organization Sync Issues
- Check `app/api/webhooks/clerk/route.ts`
- Verify `hooks/use-organization-sync.ts`
- Review organization IDs (text, not UUID)

#### 2. Database Type Mismatches
- Organization IDs should be text (Clerk format)
- User IDs should be text (Clerk format)
- Check foreign key constraints

#### 3. Authentication Errors
- Verify Clerk environment variables
- Check middleware configuration
- Review protected routes

#### 4. UI/UX Issues
- Ensure Tailwind v4 compatibility
- Check responsive design
- Verify dark mode support

## Quick Commands Reference

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm lint             # Run ESLint
pnpm typecheck        # TypeScript checking

# Database
pnpm drizzle:studio   # Visual database browser
pnpm drizzle:push     # Push schema changes
pnpm drizzle:pull     # Pull schema from DB
pnpm supabase:start   # Start local Supabase

# GitHub
gh issue list         # List all issues
gh pr list           # List all PRs
gh pr checks         # Check PR status
gh pr merge          # Merge PR
```

## Error Handling Best Practices

1. **Always use try-catch** in API routes
2. **Log errors** with context for debugging
3. **Return meaningful error messages** to users
4. **Use Zod** for input validation
5. **Handle Clerk errors** gracefully
6. **Check database constraints** before operations

## Remember

- Use the GitHub CLI (`gh`) for all GitHub operations
- Follow the existing code patterns in the project
- Update documentation if behavior changes
- Add tests for bug fixes to prevent regression
- Request review from team members before merging