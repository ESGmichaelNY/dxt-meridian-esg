# Drizzle ORM Setup

This document describes how Drizzle ORM has been integrated with our Supabase PostgreSQL database.

## 📚 Reference Documentation
- [Drizzle with Supabase](https://supabase.com/docs/guides/database/drizzle)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)

## ✅ Current Implementation

### 1. Installation
```bash
pnpm add drizzle-orm postgres
pnpm add -D drizzle-kit
```

### 2. Configuration Files

#### `drizzle.config.ts`
- Database connection configuration
- Schema file location
- Migration output directory

#### `lib/db/schema.ts`
- Drizzle schema definitions for all tables
- TypeScript type exports
- Relations between tables

#### `lib/db/index.ts`
- Main database client for general use

#### `lib/db/server.ts`
- Server-side database client with connection pooling

### 3. Database Schema

The schema includes:
- **profiles**: User profiles (using Clerk user IDs)
- **organizations**: Company/organization data
- **organization_members**: User-organization relationships
- **organization_invitations**: Pending invitations

### 4. Available Scripts

```bash
# Generate migrations from schema changes
pnpm drizzle:generate

# Apply migrations to database
pnpm drizzle:migrate

# Push schema changes directly (dev only)
pnpm drizzle:push

# Pull schema from existing database
pnpm drizzle:pull

# Open Drizzle Studio (database GUI)
pnpm drizzle:studio

# Check schema for issues
pnpm drizzle:check
```

## 🔧 Usage Examples

### Query Examples

```typescript
import { getDb } from '@/lib/db/server'
import { profiles, organizations } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// Get a user profile
const user = await db
  .select()
  .from(profiles)
  .where(eq(profiles.id, userId))
  .limit(1)

// Insert a new organization
await db
  .insert(organizations)
  .values({
    name: 'Acme Corp',
    slug: 'acme-corp',
    industry: 'Technology',
    size: 'medium'
  })

// Update with conflict handling
await db
  .insert(profiles)
  .values({ id, email, fullName })
  .onConflictDoUpdate({
    target: profiles.id,
    set: { email, fullName, updatedAt: new Date() }
  })
```

### Using with API Routes

```typescript
// app/api/route.ts
import { getDb } from '@/lib/db/server'
import { profiles } from '@/lib/db/schema'

export async function GET() {
  const db = getDb()
  const users = await db.select().from(profiles)
  return Response.json(users)
}
```

## 🚀 Benefits of Drizzle

1. **Type Safety**: Full TypeScript support with auto-generated types
2. **Performance**: Lightweight with minimal runtime overhead
3. **Developer Experience**: Intuitive API similar to SQL
4. **Migrations**: Built-in migration system with drizzle-kit
5. **Studio**: Visual database browser for development

## 📝 Migration Path

1. Existing Supabase migrations remain in `/supabase/migrations`
2. New schema changes should be made in `/lib/db/schema.ts`
3. Generate and apply migrations using Drizzle Kit
4. Both systems can coexist during transition

## 🔐 Security Notes

- Database URL is stored in `DATABASE_URL` environment variable
- Use connection pooling in production
- Row Level Security (RLS) is currently disabled for development
- Will be re-enabled with Clerk JWT integration in production