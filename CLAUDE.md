# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `pnpm dev` - Start development server on http://localhost:3000
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm verify` - Run all checks (typecheck, lint, test) before committing

### Code Quality
- `pnpm lint` - Run ESLint 9 with flat config
- `pnpm typecheck` - Run TypeScript type checking with strict mode
- `pnpm test` - Run Jest tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Run tests with coverage report (minimum 80% required)

### Supabase Local Development
- `pnpm supabase:start` - Start local Supabase instance (requires Docker)
- `pnpm supabase:stop` - Stop local Supabase
- `pnpm supabase:reset` - Reset local database
- `pnpm supabase:types` - Generate TypeScript types from database schema

## Architecture

### Tech Stack
- **Framework:** Next.js 15.5.0 with App Router and Server Components
- **UI:** React 19.0.0 with new hooks (useActionState, useFormStatus, useOptimistic)
- **Database:** Supabase (PostgreSQL with Row-Level Security)
- **Styling:** Tailwind CSS 4.0.0 (configured via CSS, not JS config)
- **Language:** TypeScript 5.7.3 with strict mode
- **Validation:** Zod for all input validation
- **State:** Zustand for client-side state, server state preferred
- **Package Manager:** pnpm 10.15.0 via Corepack

### Project Structure
- `app/` - Next.js App Router pages and API routes
  - `api/v1/` - Versioned API endpoints with Zod validation
  - `auth/` - Authentication pages (login, signup, callback)
  - `dashboard/`, `organizations/`, `reports/` - Feature pages
- `components/features/` - Feature-specific components organized by domain
- `components/ui/` - Reusable UI components
- `lib/` - Core utilities and configurations
  - `api/endpoints/` - API endpoint schemas
  - `supabase/` - Supabase client configurations
  - `utils/` - Utility functions (validation.ts is the exemplar)
  - `validation/` - Shared Zod schemas
- `hooks/` - Custom React hooks
  - `queries/` - Data fetching hooks (use-user-data.ts is the exemplar)
  - `mutations/` - Data mutation hooks
- `services/` - Business logic layer
- `stores/zustand/` - Client-side state management
- `types/database/` - TypeScript types for database entities
- `supabase/` - Database migrations and edge functions
- `tests/` - Test files organized by type (unit, integration, e2e)

### Code Standards

Follow the exemplar files for best practices:

1. **Components** (see `components/features/organizations/UserProfile.tsx`):
   - Use memo for performance optimization
   - Proper TypeScript interfaces for props
   - Accessibility-first with semantic HTML and ARIA
   - Derive UI state with useMemo
   - Handle optional props gracefully
   - Clear component naming with displayName

2. **Utilities** (see `lib/utils/validation.ts`):
   - Centralized Zod schemas with reusable scalars
   - Consistent error handling with parseOrThrow, result, makeGuard
   - Pure functions without side effects
   - Clear, descriptive error messages
   - Type exports and type guards

3. **Hooks** (see `hooks/queries/use-user-data.ts`):
   - Remote state pattern: idle → loading → success/error
   - Validate API responses with Zod at boundaries
   - Normalize data (e.g., date strings to Date objects)
   - AbortController for cleanup
   - Stable references with useCallback/useMemo
   - Consistent API: isIdle, isLoading, isError, isSuccess, refetch

### Security Requirements

1. **Supabase Security**:
   - Enable RLS on ALL user-facing tables
   - Document every RLS policy with comments
   - Use auth.uid() dynamically, never hardcode IDs
   - Service role keys only in server-side code
   - Test RLS policies with multiple user roles

2. **Input Validation**:
   - Validate ALL inputs with Zod schemas
   - Sanitize user input before database operations
   - Use parameterized queries to prevent SQL injection
   - Implement XSS prevention through proper escaping

3. **Authentication**:
   - Password requirements: 12+ chars, mixed case, numbers, symbols
   - Email verification required for new accounts
   - Secure session management with httpOnly cookies
   - Rate limiting on auth endpoints

### Development Workflow

1. **Before ANY changes**:
   ```bash
   git checkout -b ai-feature-<descriptive-name>
   ```

2. **After implementation**:
   ```bash
   pnpm verify  # Runs typecheck, lint, and tests
   ```

3. **Commit with clear messages**:
   ```bash
   git commit -m "Task/Feature: Clear description of changes"
   ```

### Testing Requirements
- Write tests BEFORE implementation (TDD)
- Minimum 80% code coverage
- Test RLS policies with different user roles
- Test validation and error handling
- Test accessibility requirements

### React 19 & Next.js 15 Features
- Use Server Components by default, Client Components only when needed
- Leverage new React 19 hooks for better UX:
  - `useActionState` for form actions
  - `useFormStatus` for form state
  - `useOptimistic` for optimistic updates
- Use Next.js 15 typed routes (experimental.typedRoutes enabled)
- Implement streaming and partial hydration where beneficial

### Configuration Notes
- ESLint 9 uses flat config in `eslint.config.ts`
- Tailwind CSS 4 configured via CSS `@import`, not JS config
- TypeScript path alias: `@/*` maps to project root
- Strict TypeScript mode enabled
- Images from Supabase domains allowed via remotePatterns