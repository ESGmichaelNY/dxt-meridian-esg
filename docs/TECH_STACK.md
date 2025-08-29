# Tech Stack Decision Record

**Date:** January 2025  
**Status:** LOCKED - Do not change without team discussion

## Core Decisions

### 🔐 Authentication: Clerk
**Decision:** Use Clerk for all authentication needs  
**Rationale:** 
- Built-in organizations/multi-tenancy support
- Excellent DX with React hooks
- Webhook-based user sync
- Production-ready with minimal setup

**DO NOT:**
- ❌ Use Supabase Auth
- ❌ Implement custom auth
- ❌ Mix authentication providers

### 💾 Database: PostgreSQL + Drizzle ORM
**Decision:** PostgreSQL 17 via Supabase (hosting only) + Drizzle ORM  
**Rationale:**
- Type-safe queries with Drizzle
- Better TypeScript integration than Prisma
- Lighter weight than TypeORM
- Direct SQL when needed

**DO NOT:**
- ❌ Use Supabase client for database queries
- ❌ Use Prisma (adds complexity)
- ❌ Write raw SQL without Drizzle
- ❌ Use UUID primary keys (use text for Clerk compatibility)

### 🎨 Styling: Tailwind CSS v4
**Decision:** Tailwind CSS v4 with PostCSS  
**Rationale:**
- Latest features and performance improvements
- Native CSS configuration
- Smaller bundle sizes
- Better IDE support

**DO NOT:**
- ❌ Downgrade to Tailwind v3
- ❌ Use CSS-in-JS libraries (styled-components, emotion)
- ❌ Mix styling solutions

## Implementation Rules

### Database Operations
```typescript
// ✅ CORRECT - Always use Drizzle
import { getDb } from '@/lib/db/server'
const db = getDb()
const users = await db.select().from(profiles)

// ❌ WRONG - Never use Supabase client for DB
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()
const { data } = await supabase.from('profiles').select()
```

### Authentication
```typescript
// ✅ CORRECT - Use Clerk hooks
import { useUser } from '@clerk/nextjs'
const { user, isLoaded } = useUser()

// ❌ WRONG - Don't use Supabase auth
import { createClient } from '@/lib/supabase/client'
const { data: { user } } = await supabase.auth.getUser()
```

### ID Fields
```typescript
// ✅ CORRECT - Text IDs for Clerk
export const profiles = pgTable("profiles", {
  id: text().primaryKey().notNull(), // Clerk user ID
})

// ❌ WRONG - UUID IDs
export const profiles = pgTable("profiles", {
  id: uuid().primaryKey().defaultRandom(),
})
```

## Tech Stack Summary

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Framework** | Next.js | 15.5.0 | React framework with App Router |
| **UI Library** | React | 19.1.1 | Latest with new hooks |
| **Language** | TypeScript | 5.9.2 | Type safety |
| **Authentication** | Clerk | 6.31.4 | Auth & organizations |
| **Database** | PostgreSQL | 17 | Data storage |
| **ORM** | Drizzle | 0.44.4 | Type-safe queries |
| **Styling** | Tailwind CSS | 4.1.12 | Utility-first CSS |
| **State** | Zustand | 4.5.0 | Client state management |
| **Forms** | React Hook Form | 7.62.0 | Form handling |
| **Validation** | Zod | 3.23.0 | Schema validation |
| **Icons** | Lucide React | 0.541.0 | Icon library |
| **Package Manager** | pnpm | 10.15.0 | Fast, disk-efficient |

## Migration Paths

### If You're Coming From...

#### Supabase Auth → Clerk
1. User data is synced via webhooks
2. Organizations are first-class citizens
3. Use `/sign-in` and `/sign-up` routes
4. Remove all Supabase auth code

#### Prisma → Drizzle
1. Schema defined in `lib/db/schema.ts`
2. Use `drizzle-kit` for migrations
3. Type-safe queries out of the box
4. No code generation step needed

#### Tailwind v3 → v4
1. Use `@tailwindcss/postcss` package
2. Config remains similar
3. Better performance and smaller bundles

## Potential Improvements (Discuss First!)

### Consider for Future:
1. **tRPC** - Type-safe APIs (adds complexity, evaluate need)
2. **Tanstack Query** - Better data fetching (currently using native fetch)
3. **Playwright** - E2E testing (currently Vitest for unit tests)
4. **Biome** - Faster linting/formatting than ESLint+Prettier
5. **Bun** - Faster runtime than Node.js (check compatibility)

### DO NOT Change Without Discussion:
- Authentication provider (Clerk is working well)
- Database ORM (Drizzle is performant and type-safe)
- Styling solution (Tailwind v4 is optimal)
- Package manager (pnpm is fast and reliable)

## Commands Reference

```bash
# Development
pnpm dev                  # Start dev server

# Database
pnpm drizzle:generate    # Generate migrations
pnpm drizzle:push       # Apply schema to DB
pnpm drizzle:pull       # Pull DB schema

# Type checking
pnpm typecheck          # Check TypeScript
pnpm lint              # Run ESLint

# Testing
pnpm test              # Run tests
pnpm test:coverage     # Coverage report

# Build
pnpm build            # Production build
```

## Environment Variables

```env
# Clerk (Required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# Database (Required)
DATABASE_URL=postgresql://...

# Supabase (For hosting only)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Routes
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/organizations
```

## File Structure Conventions

```
app/
  api/
    webhooks/clerk/    # Clerk webhooks only
    [feature]/         # Feature APIs
  (auth)/             # Auth pages group
    sign-in/
    sign-up/
  (protected)/        # Protected pages group
    dashboard/
    organizations/
lib/
  db/
    schema.ts         # Drizzle schema
    server.ts         # Server DB client
  supabase/
    service.ts        # Service role client (admin only)
components/
  auth/              # Auth components
  features/          # Feature components
  ui/               # Reusable UI
```

---

**Remember:** This stack is battle-tested and working. Changes should only be made after team discussion and with clear migration paths.