/**
 * React hook for using Supabase with Clerk authentication
 * Based on: https://supabase.com/docs/guides/auth/third-party/clerk
 */

'use client'

import { useAuth as _useAuth, useSession } from '@clerk/nextjs'
import { useMemo } from 'react'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database/generated'

export function useSupabase() {
  const { session } = useSession()
  
  const supabase = useMemo(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    
    return createClient<Database>(
      supabaseUrl,
      supabaseAnonKey,
      {
        global: {
          headers: {},
        },
        auth: {
          persistSession: false,
        },
        accessToken: async () => {
          // Use the session's getToken method to get the JWT template
          // Note: 'supabase' template must be created in Clerk dashboard
          const token = await session?.getToken({ template: 'supabase' })
          return token ?? null
        },
      }
    )
  }, [session])
  
  return supabase
}