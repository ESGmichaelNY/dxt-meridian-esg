# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application with React 19, TypeScript, and Tailwind CSS v4. It's an ESG (Environmental, Social, Governance) platform called Meridian that provides data entry, reporting, and organizational management features. The project uses Clerk for authentication, Supabase for database, and Drizzle ORM for database operations.

## Development Commands

### Package Management (pnpm)
- `pnpm install` - Install dependencies
- `pnpm install --frozen-lockfile` - Install dependencies for CI/CD
- `pnpm update` - Update dependencies
- `pnpm add <package>` - Add new dependency
- `pnpm remove <package>` - Remove dependency

### Build Commands  
- `pnpm run build` - Build the Next.js project for production
- `pnpm run dev` - Start Next.js development server
- `pnpm run start` - Start production server (after build)

### Testing Commands
- `pnpm test` - Run Vitest tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Run tests with coverage report
- `pnpm test:ui` - Open Vitest UI
- `pnpm test:jest` - Run Jest tests (legacy)

### Code Quality Commands
- `pnpm run lint` - Run ESLint for code linting
- `pnpm run lint:fix` - Run ESLint with auto-fix
- `pnpm run typecheck` or `pnpm run type-check` - Run TypeScript type checking
- `pnpm run verify` - Run type-check, lint, and tests together

### Database Commands (Drizzle + Supabase)
- `pnpm run drizzle:generate` - Generate Drizzle migrations
- `pnpm run drizzle:migrate` - Run Drizzle migrations
- `pnpm run drizzle:push` - Push schema to database
- `pnpm run drizzle:pull` - Pull schema from database
- `pnpm run drizzle:studio` - Open Drizzle Studio
- `pnpm run drizzle:check` - Check migrations
- `pnpm run supabase:start` - Start local Supabase
- `pnpm run supabase:stop` - Stop local Supabase
- `pnpm run supabase:reset` - Reset database
- `pnpm run supabase:types` - Generate TypeScript types from database

## Technology Stack

### Core Technologies  
- **TypeScript** - Primary programming language (strict mode enabled)
- **Node.js** - Runtime environment (v20.19.0+)
- **pnpm** - Package manager (v10.15.0)

### Frameworks & Libraries
- **Next.js 15** - Full-stack React framework with App Router
- **React 19** - UI library with latest features
- **Tailwind CSS v4** - Utility-first CSS framework
- **Clerk** - Authentication and user management
- **Supabase** - Database and backend services
- **Drizzle ORM** - TypeScript ORM for database operations
- **Zustand** - State management
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Build & Development Tools
- **Next.js built-in bundler** - Production builds
- **PostCSS** - CSS processing  
- **ESLint 9** - JavaScript/TypeScript linter
- **TypeScript 5.7** - Type checking
- **Husky** - Git hooks

### Testing Frameworks
- **Vitest** - Primary test runner
- **Testing Library** - React component testing
- **Jest** - Legacy test runner (being phased out)
- **MSW** - API mocking for tests


## Project Structure Guidelines

### File Organization (Next.js App Router)
```
app/                # Next.js App Router pages and layouts
├── api/           # API routes
├── dashboard/     # Dashboard pages
├── organizations/ # Organization management
├── settings/      # Settings pages
├── sign-in/       # Clerk authentication pages
└── sign-up/       # Clerk signup pages

components/        # Reusable UI components
├── auth/         # Authentication components
├── features/     # Feature-specific components
├── layout/       # Layout components
├── organizations/# Organization components
├── providers/    # Context providers
└── ui/          # Base UI components

hooks/            # Custom React hooks
├── mutations/   # Data mutation hooks
└── queries/     # Data fetching hooks

lib/              # Utilities and configurations
├── api/         # API client utilities
├── clerk/       # Clerk configuration
├── db/          # Database configuration
├── supabase/    # Supabase client
└── utils/       # Helper functions

types/            # TypeScript type definitions
└── database/    # Database types

drizzle/          # Database schema and migrations
tests/            # Test files
```

### Naming Conventions
- **Files**: Use kebab-case for file names (`user-profile.component.ts`)
- **Components**: Use PascalCase for component names (`UserProfile`)
- **Functions**: Use camelCase for function names (`getUserData`)
- **Constants**: Use UPPER_SNAKE_CASE for constants (`API_BASE_URL`)
- **Types/Interfaces**: Use PascalCase with descriptive names (`UserData`, `ApiResponse`)

## TypeScript Guidelines

### Type Safety
- Enable strict mode in `tsconfig.json`
- Use explicit types for function parameters and return values
- Prefer interfaces over types for object shapes
- Use union types for multiple possible values
- Avoid `any` type - use `unknown` when type is truly unknown

### Best Practices
- Use type guards for runtime type checking
- Leverage utility types (`Partial`, `Pick`, `Omit`, etc.)
- Create custom types for domain-specific data
- Use enums for finite sets of values
- Document complex types with JSDoc comments

## Code Quality Standards

### ESLint Configuration
- Use recommended ESLint rules for JavaScript/TypeScript
- Enable React-specific rules if using React
- Configure import/export rules for consistent module usage
- Set up accessibility rules for inclusive development

### Prettier Configuration
- Use consistent indentation (2 spaces recommended)
- Set maximum line length (80-100 characters)
- Use single quotes for strings
- Add trailing commas for better git diffs

### Testing Standards
- Aim for 80%+ test coverage
- Write unit tests for utilities and business logic
- Use integration tests for component interactions
- Implement e2e tests for critical user flows
- Follow AAA pattern (Arrange, Act, Assert)

## Performance Optimization

### Bundle Optimization
- Use code splitting for large applications
- Implement lazy loading for routes and components
- Optimize images and assets
- Use tree shaking to eliminate dead code
- Analyze bundle size regularly

### Runtime Performance
- Implement proper memoization (React.memo, useMemo, useCallback)
- Use virtualization for large lists
- Optimize re-renders in React applications
- Implement proper error boundaries
- Use web workers for heavy computations

## Security Guidelines

### Dependencies
- Regularly audit dependencies with `npm audit`
- Keep dependencies updated
- Use lock files (`package-lock.json`, `yarn.lock`)
- Avoid dependencies with known vulnerabilities

### Code Security
- Sanitize user inputs
- Use HTTPS for API calls
- Implement proper authentication and authorization
- Store sensitive data securely (environment variables)
- Use Content Security Policy (CSP) headers

## Development Workflow

### Before Starting
1. Check Node.js version (requires v20.19.0+)
2. Install pnpm if needed: `npm install -g pnpm@10.15.0`
3. Install dependencies with `pnpm install`
4. Set up environment variables (see below)
5. Start local Supabase: `pnpm run supabase:start`
6. Run type checking: `pnpm run typecheck`

### Required Environment Variables
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_PROJECT_ID=

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
CLERK_WEBHOOK_SECRET=
```

### During Development
1. Use TypeScript for type safety
2. Run linter frequently to catch issues early
3. Write tests for new features
4. Use meaningful commit messages
5. Review code changes before committing

### Before Committing
1. Run verification: `pnpm run verify` (runs type-check, lint, and tests)
2. Test production build: `pnpm run build`
3. Fix any linting issues: `pnpm run lint:fix`
4. Ensure all tests pass: `pnpm test`

### Key Project Features
- **ESG Data Management**: Emissions tracking, sustainability metrics
- **Multi-tenant Architecture**: Organization-based data isolation
- **Real-time Sync**: Clerk-Supabase user/organization synchronization
- **Type Safety**: End-to-end TypeScript with generated database types
- **Modern UI**: Tailwind CSS v4 with custom components