# Tech Stack & Versions

## Core Framework
- **Next.js**: 15.5.0 (App Router)
- **React**: 19.0.0
- **React DOM**: 19.0.0
- **TypeScript**: 5.7.3

## Authentication
- **Clerk**: 6.31.4 (@clerk/nextjs)
- **Svix**: 1.74.1 (for webhooks)

## Database
- **PostgreSQL**: 17 (via Docker)
- **Supabase**: 2.45.0 (@supabase/supabase-js)
- **Drizzle ORM**: 0.44.4
- **Drizzle Kit**: 0.31.4
- **Postgres.js**: 3.4.7

## Styling
- **Tailwind CSS**: 4.1.12 ✅ (Updated from v3)
- **Autoprefixer**: 10.4.21
- **PostCSS**: 8.5.6
- **clsx**: 2.1.0
- **tailwind-merge**: 2.5.0

## State Management
- **Zustand**: 4.5.0

## Forms & Validation
- **React Hook Form**: 7.52.0
- **Zod**: 3.23.0
- **@hookform/resolvers**: 3.9.0

## UI Components
- **Lucide React**: 0.541.0 (icons)

## Utilities
- **date-fns**: 3.6.0

## Development Tools

### Testing
- **Vitest**: 1.0.0
- **@testing-library/react**: 16.0.0
- **@testing-library/jest-dom**: 6.4.0
- **@testing-library/user-event**: 14.5.0
- **Jest**: 29.7.0
- **MSW**: 2.3.0

### Linting & Formatting
- **ESLint**: 9.34.0
- **Prettier**: 3.3.0
- **Husky**: 9.0.0
- **TypeScript ESLint**: 8.0.0

## Package Manager
- **pnpm**: 10.15.0

## Environment Requirements
- **Node.js**: 20+ (based on @types/node)
- **Docker**: Required for local Supabase

## Key Configuration Files
- `tailwind.config.ts` - Tailwind v4 configuration
- `drizzle.config.ts` - Drizzle ORM configuration
- `middleware.ts` - Clerk authentication middleware
- `supabase/config.toml` - Supabase local configuration

## Notable Updates
1. **Tailwind CSS v4**: Successfully upgraded from v3.4.17 to v4.1.12
2. **React 19**: Using the latest React version
3. **Clerk Integration**: Fully integrated with organizations support
4. **Drizzle ORM**: Added for type-safe database queries

## Docker Services
- PostgreSQL 17 (port 54322)
- Supabase Studio (port 54323)
- Supabase API (port 54321)
- Inbucket Email Testing (port 54324)

## Environment Variables Required
```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY

# Supabase (Database)
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
DATABASE_URL

# App
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_APP_NAME
```

## Development Commands
```bash
pnpm dev              # Start Next.js dev server
pnpm build            # Build for production
pnpm lint             # Run ESLint
pnpm typecheck        # TypeScript type checking
pnpm test             # Run tests with Vitest

# Database
pnpm drizzle:studio   # Open Drizzle Studio
pnpm drizzle:push     # Push schema changes
pnpm supabase:start   # Start Supabase locally
```

---
*Last updated: August 25, 2025*