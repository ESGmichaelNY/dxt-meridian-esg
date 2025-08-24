/**
 * Supabase Browser Client
 * 
 * Client-side Supabase client for use in browser components.
 * Uses the latest @supabase/ssr package for cookie management.
 */

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database/generated'

/**
 * Creates a Supabase client for browser/client components
 * This client uses the anon key which is safe to expose
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}