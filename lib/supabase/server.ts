/**
 * Supabase Server Client
 * 
 * Server-side Supabase client for use in Server Components,
 * Route Handlers, and Server Actions.
 * 
 * IMPORTANT: Always create a new client for each request to ensure
 * proper cookie handling and user isolation.
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database/generated'

/**
 * Creates a Supabase client for server components
 * Handles cookie-based auth automatically
 * 
 * @returns Supabase client configured for server-side use
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

/**
 * Gets the current authenticated user
 * Always use this instead of getSession() for security
 * 
 * @returns User object or null if not authenticated
 */
export async function getUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }
  
  return user
}

/**
 * Ensures the user is authenticated
 * Throws an error if not authenticated
 * 
 * @returns Authenticated user object
 */
export async function requireUser() {
  const user = await getUser()
  
  if (!user) {
    throw new Error('Authentication required')
  }
  
  return user
}