/**
 * service.ts
 * 
 * ⚠️ DANGER: Service role client that bypasses RLS.
 * ONLY use this in secure server-side contexts for admin operations.
 * NEVER expose the service role key to the client!
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database/generated'

/**
 * Ensure this code is only running server-side.
 * Throws an error if called from the browser.
 */
export function ensureServerSide() {
  if (typeof window !== 'undefined') {
    throw new Error(
      '🚨 SECURITY VIOLATION: Service client can only be used on the server side! ' +
      'This client uses the service role key which bypasses RLS and must never be exposed to the browser.'
    )
  }
}

/**
 * Create a Supabase client with service role privileges.
 * 
 * ⚠️ WARNING: This client bypasses RLS policies!
 * Only use for admin operations in secure server-side contexts.
 * 
 * @example
 * ```ts
 * import { createServiceClient } from '@/lib/supabase/service'
 * 
 * // Only in API routes or server-side code!
 * export async function deleteUserCompletely(userId: string) {
 *   const supabase = createServiceClient()
 *   // Service role can bypass RLS
 *   await supabase.from('profiles').delete().eq('id', userId)
 * }
 * ```
 */
export function createServiceClient() {
  // Security check - ensure server-side only
  ensureServerSide()

  // Additional check for service role key
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured')
  }

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

/**
 * Execute an admin operation with service role privileges.
 * Includes automatic error handling and logging.
 * 
 * @example
 * ```ts
 * const result = await withServiceRole(async (supabase) => {
 *   return await supabase.from('profiles').select('*')
 * })
 * ```
 */
export async function withServiceRole<T>(
  operation: (client: ReturnType<typeof createServiceClient>) => Promise<T>
): Promise<T> {
  const startTime = Date.now()
  const client = createServiceClient()
  
  try {
    const result = await operation(client)
    
    // Log successful admin operations in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Service Role Operation] Completed in ${Date.now() - startTime}ms`)
    }
    
    return result
  } catch (error) {
    // Log errors
    console.error('[Service Role Operation Error]', error)
    throw error
  }
}
