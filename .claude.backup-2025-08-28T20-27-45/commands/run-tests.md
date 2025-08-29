# Run Tests

Run comprehensive tests for: $ARGUMENTS

## Overview

Executes all testing suites and generates coverage reports for the Meridian ESG platform.

## Test Types

### 1. Type Checking
```bash
pnpm typecheck
```
Validates TypeScript types across the entire codebase.

### 2. Linting
```bash
pnpm lint
```
Checks code style and best practices with ESLint 9.

### 3. Unit Tests
```bash
pnpm test
```
Runs Vitest unit tests for components, hooks, and utilities.

### 4. Integration Tests
```bash
pnpm test:integration
```
Tests API routes, database operations, and Clerk webhooks.

### 5. Coverage Report
```bash
pnpm test:coverage
```
Generates comprehensive test coverage report.

## Workflow Steps

### PHASE 1: Pre-Test Setup

1. **Environment Check**
   ```bash
   # Ensure test environment variables are set
   cp .env.test.example .env.test
   
   # Required test env vars:
   DATABASE_URL=postgresql://postgres:postgres@localhost:54322/test
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

2. **Database Setup**
   ```bash
   # Create test database
   pnpm drizzle:push --config drizzle.config.test.ts
   
   # Seed test data if needed
   pnpm db:seed:test
   ```

### PHASE 2: Run Test Suites

1. **Quick Check** (for CI/CD)
   ```bash
   pnpm verify
   # Runs: typecheck → lint → test
   ```

2. **Full Test Suite**
   ```bash
   # Run all tests in sequence
   pnpm typecheck && \
   pnpm lint && \
   pnpm test && \
   pnpm test:integration && \
   pnpm test:e2e
   ```

3. **Watch Mode** (for development)
   ```bash
   pnpm test:watch
   ```

4. **UI Mode** (interactive testing)
   ```bash
   pnpm test:ui
   ```

### PHASE 3: Test Specific Features

Based on $ARGUMENTS, run targeted tests:

```bash
# Test specific file/pattern
pnpm test src/components/UserProfile
pnpm test hooks/use-organization

# Test by category
pnpm test --grep "authentication"
pnpm test --grep "database"
pnpm test --grep "api"

# Test changed files only
pnpm test --changed
```

### PHASE 4: Coverage Analysis

1. **Generate Coverage**
   ```bash
   pnpm test:coverage
   ```

2. **Review Coverage Report**
   - Open `coverage/index.html` in browser
   - Check coverage thresholds:
     - Statements: >80%
     - Branches: >75%
     - Functions: >80%
     - Lines: >80%

3. **Coverage by Feature**
   ```bash
   # Coverage for specific directories
   pnpm test:coverage src/components
   pnpm test:coverage src/hooks
   pnpm test:coverage src/lib/db
   ```

## Test Categories

### Component Tests
```typescript
// components/__tests__/UserProfile.test.tsx
import { render, screen } from '@testing-library/react'
import { UserProfile } from '../UserProfile'

describe('UserProfile', () => {
  it('renders user information', () => {
    const user = { id: 'user_123', email: 'test@example.com' }
    render(<UserProfile user={user} />)
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
  })
})
```

### Hook Tests
```typescript
// hooks/__tests__/use-organization-sync.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { useOrganizationSync } from '../use-organization-sync'

describe('useOrganizationSync', () => {
  it('syncs organization data', async () => {
    const { result } = renderHook(() => useOrganizationSync())
    await waitFor(() => {
      expect(result.current.isSynced).toBe(true)
    })
  })
})
```

### API Route Tests
```typescript
// app/api/user/__tests__/sync.test.ts
import { POST } from '../sync/route'

describe('POST /api/user/sync', () => {
  it('syncs user with database', async () => {
    const response = await POST(mockRequest)
    expect(response.status).toBe(200)
  })
})
```

### Database Tests
```typescript
// lib/db/__tests__/queries.test.ts
import { getDb } from '../server'
import { profiles } from '../schema'

describe('Database Queries', () => {
  it('creates user profile', async () => {
    const db = getDb()
    const user = await db.insert(profiles).values({
      id: 'user_123',
      email: 'test@example.com'
    }).returning()
    expect(user[0].email).toBe('test@example.com')
  })
})
```

## Test Utilities

### Mock Clerk User
```typescript
import { useUser } from '@clerk/nextjs'
jest.mock('@clerk/nextjs')

const mockUser = {
  id: 'user_123',
  emailAddresses: [{ emailAddress: 'test@example.com' }]
}
(useUser as jest.Mock).mockReturnValue({ user: mockUser })
```

### Mock Database
```typescript
import { mockDb } from '@/test/utils/mock-db'

beforeEach(() => {
  mockDb.reset()
})
```

## CI/CD Integration

### GitHub Actions
```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm verify
      - run: pnpm test:coverage
      - uses: codecov/codecov-action@v3
```

## Common Issues

**Issue**: Tests fail with "Cannot find module"
```bash
# Clear cache and reinstall
rm -rf node_modules .next
pnpm install
```

**Issue**: Database connection errors
```bash
# Ensure test database is running
pnpm supabase:start
# Check DATABASE_URL in .env.test
```

**Issue**: Clerk mock not working
```bash
# Ensure test setup file is configured
# vitest.config.ts should include setupFiles
```

## Output Summary

After running tests, provide:
1. Test results (passed/failed/skipped)
2. Coverage percentages
3. Failed test details with fixes
4. Performance metrics
5. Recommendations for improvement

## Quick Commands

```bash
# Most common test commands
pnpm verify          # Quick validation
pnpm test           # Run unit tests
pnpm test:watch     # Development mode
pnpm test:coverage  # Full coverage report
```