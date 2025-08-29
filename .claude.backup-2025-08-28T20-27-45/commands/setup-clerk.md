# Setup Clerk Authentication

Set up Clerk authentication for: $ARGUMENTS

## Overview

Configures Clerk authentication, organizations, and database sync for the Meridian ESG platform.

## Prerequisites

- Clerk account created at https://clerk.com
- Clerk application created
- PostgreSQL database running (via Supabase)

## Workflow Steps

### 1. Environment Configuration

```bash
# Check for required environment variables
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Optional Clerk settings
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

### 2. Webhook Configuration

Configure Clerk webhooks for user/organization sync:

```typescript
// app/api/webhooks/clerk/route.ts
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { getDb } from '@/lib/db/server'
import { profiles, organizations } from '@/lib/db/schema'

export async function POST(req: Request) {
  // Verify webhook signature
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
  
  // Handle events:
  // - user.created -> Insert into profiles
  // - user.updated -> Update profiles
  // - organization.created -> Insert into organizations
  // - organizationMembership.created -> Sync membership
}
```

### 3. Database Schema Setup

Ensure database tables match Clerk's data model:

```typescript
// lib/db/schema.ts
export const profiles = pgTable('profiles', {
  id: text('id').primaryKey(), // Clerk user ID (text, not UUID)
  email: text('email').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

export const organizations = pgTable('organizations', {
  id: text('id').primaryKey(), // Clerk org ID (text, not UUID)
  name: text('name').notNull(),
  slug: text('slug'),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow()
})
```

### 4. Middleware Configuration

```typescript
// middleware.ts
import { authMiddleware } from '@clerk/nextjs'

export default authMiddleware({
  publicRoutes: ['/', '/sign-in', '/sign-up', '/api/webhooks/clerk'],
  ignoredRoutes: ['/api/webhooks/clerk']
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
}
```

### 5. Component Integration

```tsx
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
```

### 6. Organization Setup

```tsx
// components/providers/organization-provider.tsx
import { OrganizationSwitcher, useOrganization } from '@clerk/nextjs'

export function OrganizationProvider({ children }) {
  const { organization } = useOrganization()
  
  // Sync current organization to database
  // Provide organization context to app
  
  return (
    <>
      <OrganizationSwitcher />
      {children}
    </>
  )
}
```

### 7. Testing Checklist

- [ ] User can sign up at `/sign-up`
- [ ] User can sign in at `/sign-in`
- [ ] User profile syncs to database
- [ ] Organization creation works
- [ ] Organization switching works
- [ ] Webhooks receive events
- [ ] Database has correct user/org data
- [ ] Protected routes require auth
- [ ] Public routes are accessible

### 8. Common Issues & Solutions

**Issue**: Webhook signature verification fails
```bash
# Ensure CLERK_WEBHOOK_SECRET matches Clerk dashboard
# Check webhook endpoint URL in Clerk dashboard
```

**Issue**: User not syncing to database
```bash
# Verify webhook is configured for user.* events
# Check database permissions
# Ensure text IDs (not UUIDs) in schema
```

**Issue**: Organization features not working
```bash
# Enable organizations in Clerk dashboard
# Configure organization webhook events
# Update middleware for org routes
```

## Verification Commands

```bash
# Check environment variables
pnpm exec printenv | grep CLERK

# Test webhook locally
ngrok http 3000
# Update webhook URL in Clerk dashboard

# Verify database schema
pnpm drizzle:studio

# Check Clerk integration
curl -H "Authorization: Bearer $CLERK_SECRET_KEY" \
  https://api.clerk.dev/v1/users
```

## Important Notes

1. **NEVER** use Supabase Auth - Clerk handles all authentication
2. **ALWAYS** use text IDs for Clerk compatibility (not UUIDs)
3. **ALWAYS** verify webhook signatures in production
4. **NEVER** expose CLERK_SECRET_KEY to the client

## Next Steps

After setup:
1. Test full authentication flow
2. Verify organization management
3. Check database sync
4. Configure additional Clerk features (MFA, social login, etc.)