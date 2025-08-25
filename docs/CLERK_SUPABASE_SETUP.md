# Clerk + Supabase Integration Setup

This document outlines how we've integrated Clerk authentication with Supabase database, following official documentation from both services.

## 📚 Reference Documentation
- [Clerk Next.js Quickstart](https://clerk.com/docs/quickstarts/nextjs)
- [Supabase + Clerk Integration](https://supabase.com/docs/guides/auth/third-party/clerk)

## ✅ Current Implementation

### 1. Clerk Setup (Compliant with Official Docs)

#### Packages Installed
```json
"@clerk/nextjs": "latest"
```

#### Middleware Configuration (`middleware.ts`)
```typescript
import { clerkMiddleware } from "@clerk/nextjs/server"
export default clerkMiddleware()
```
✅ Uses `clerkMiddleware()` from `@clerk/nextjs/server` (correct package)
✅ Proper matcher configuration for route protection

#### Layout Configuration (`app/layout.tsx`)
```typescript
<ClerkProvider>
  {/* App content */}
</ClerkProvider>
```
✅ App wrapped with `<ClerkProvider>`
✅ Using Clerk components (`SignInButton`, `SignUpButton`, `UserButton`, etc.)

#### Environment Variables
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```
✅ Proper environment variables configured

### 2. Supabase Integration

#### User Synchronization
We've implemented user sync in two ways:

1. **Automatic Sync Component** (`components/auth/UserSync.tsx`)
   - Syncs user on sign-in automatically
   - Uses client-side API call to `/api/user/sync`

2. **Webhook Support** (`app/api/webhooks/clerk/route.ts`)
   - Ready for production webhook integration
   - Handles `user.created` and `user.updated` events

#### Database Schema Updates
- Modified `profiles` table to use text IDs (Clerk format) instead of UUIDs
- Created `ensure_profile_exists` function for upsert operations
- Temporarily disabled RLS for development

### 3. Advanced Integration (For Production)

#### JWT Template Configuration (Recommended for Production)
To fully integrate with Supabase RLS:

1. **In Clerk Dashboard:**
   - Go to JWT Templates
   - Create a new template named "supabase"
   - Add custom claims:
   ```json
   {
     "role": "authenticated",
     "org_id": "{{org.id}}",
     "org_role": "{{org.role}}"
   }
   ```

2. **Update Supabase Config:**
   ```toml
   # supabase/config.toml
   [auth.third_party.clerk]
   enabled = true
   domain = "your-clerk-domain.clerk.accounts.dev"
   ```

3. **Use the Clerk-Supabase Client:**
   ```typescript
   // Server-side
   import { createClerkSupabaseClient } from '@/lib/supabase/clerk-client'
   const supabase = await createClerkSupabaseClient()
   
   // Client-side
   import { useSupabase } from '@/hooks/useSupabase'
   const supabase = useSupabase()
   ```

#### RLS Policies with Clerk Claims
Example RLS policy using Clerk JWT claims:
```sql
CREATE POLICY "Users can view their organization data"
ON public.organizations
FOR SELECT
USING (
  id = (current_setting('request.jwt.claims', true)::json->>'org_id')::uuid
);
```

## 🚀 Production Checklist

- [ ] Create JWT template in Clerk Dashboard
- [ ] Configure Supabase to accept Clerk JWTs
- [ ] Enable RLS policies using Clerk claims
- [ ] Set up Clerk webhooks for user sync
- [ ] Add `CLERK_WEBHOOK_SECRET` to environment variables
- [ ] Test JWT token flow with RLS policies

## 🔧 Current Development Setup

For local development, we're using:
- Simple user sync without JWT templates
- Service role key for database operations
- RLS temporarily disabled
- Manual sync on user sign-in

This approach works well for development and can be upgraded to the full JWT integration for production.

## 📝 Migration Path to Production

1. Create JWT template in Clerk
2. Update Supabase config
3. Re-enable RLS with Clerk-aware policies
4. Switch to using `createClerkSupabaseClient` for all DB operations
5. Configure webhooks for real-time user sync