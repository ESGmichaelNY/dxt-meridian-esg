/**
 * client.ts
 * 
 * Browser-safe Supabase client using only the anon key.
 * This client respects RLS policies and is safe for frontend use.
 */

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database/generated'
import { validateEnv } from '@/lib/utils/validation'

// Validate environment variables
const env = typeof window !== 'undefined' ? process.env : validateEnv()

/**
 * Supabase client for browser/client-side usage.
 * Uses anon key which respects RLS policies.
 * 
 * @example
 * ```ts
 * import { supabase } from '@/lib/supabase/client'
 * 
 * const { data, error } = await supabase
 *   .from('profiles')
 *   .select('*')
 * ```
 */
export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
