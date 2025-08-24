/**
 * server.ts
 * 
 * Server-side Supabase client for use in Server Components and API routes.
 * Handles cookie-based auth for SSR.
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database/generated'

/**
 * Create a Supabase client for server-side usage.
 * Automatically handles cookie-based auth.
 * 
 * @example
 * ```ts
 * import { createClient } from '@/lib/supabase/server'
 * 
 * export async function getProfile() {
 *   const supabase = await createClient()
 *   const { data: { user } } = await supabase.auth.getUser()
 *   // ...
 * }
 * ```
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
