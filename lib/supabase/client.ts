/**
 * client.ts
 * 
 * Browser-safe Supabase client using only the anon key.
 * This client respects RLS policies and is safe for frontend use.
 */

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database/generated'

/**
 * Supabase client for browser/client-side usage.
 * Uses anon key which respects RLS policies.
 * 
 * @example
 * ```ts
 * import { createClient } from '@/lib/supabase/client'
 * 
 * const supabase = createClient()
 * const { data, error } = await supabase
 *   .from('profiles')
 *   .select('*')
 * ```
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
