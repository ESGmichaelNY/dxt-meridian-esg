/**
 * Supabase client configured to work with Clerk authentication
 * Based on: https://supabase.com/docs/guides/auth/third-party/clerk
 */

import { createClient } from '@supabase/supabase-js'
import { auth } from '@clerk/nextjs/server'
import type { Database } from '@/types/database/generated'

/**
 * Create a Supabase client for server-side usage with Clerk auth
 * This client uses Clerk's JWT token for authentication
 */
export async function createClerkSupabaseClient() {
  const { getToken } = await auth()
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  // Get the custom JWT token from Clerk
  const token = await getToken({ template: 'supabase' })
  
  const supabase = createClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token ?? supabaseAnonKey}`,
        },
      },
      auth: {
        persistSession: false,
      },
    }
  )
  
  return supabase
}

/**
 * Create a Supabase client for client-side usage with Clerk auth
 * This should be used in client components
 */
export function createClerkSupabaseClientBrowser(getToken: () => Promise<string | null>) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  const supabase = createClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      global: {
        fetch: async (url, options = {}) => {
          const token = await getToken()
          
          const headers = new Headers(options.headers)
          
          if (token) {
            headers.set('Authorization', `Bearer ${token}`)
          }
          
          return fetch(url, {
            ...options,
            headers,
          })
        },
      },
      auth: {
        persistSession: false,
      },
    }
  )
  
  return supabase
}