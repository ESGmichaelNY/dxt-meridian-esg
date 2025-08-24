/**
 * Supabase Service Role Client
 * 
 * SECURITY WARNING: This client uses the service role key which bypasses RLS.
 * ONLY use this in secure server-side contexts for admin operations.
 * NEVER expose this client or key to the frontend.
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database/generated'

/**
 * Ensures this code is only running server-side
 * Throws an error if called from client-side
 */
function ensureServerSide() {
  if (typeof window !== 'undefined') {
    throw new Error(
      'SECURITY ERROR: Service role client can only be used on the server side. ' +
      'This client bypasses RLS and must never be exposed to the browser.'
    )
  }
}

/**
 * Creates a Supabase client with service role privileges
 * WARNING: This bypasses Row Level Security - use with caution!
 * 
 * @returns Service role Supabase client
 */
export function createServiceClient() {
  ensureServerSide()

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured')
  }

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

/**
 * Admin function to create an organization with initial owner
 * Uses service role to bypass RLS for initial setup
 */
export async function createOrganizationAsAdmin(
  organizationData: {
    name: string
    slug: string
    industry?: string
    size?: 'small' | 'medium' | 'large' | 'enterprise'
  },
  ownerId: string
) {
  ensureServerSide()
  
  const supabase = createServiceClient()
  
  // Start a transaction
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .insert(organizationData)
    .select()
    .single()
  
  if (orgError) throw orgError
  
  // Add owner as member
  const { error: memberError } = await supabase
    .from('organization_members')
    .insert({
      organization_id: org.id,
      user_id: ownerId,
      role: 'owner',
    })
  
  if (memberError) {
    // Rollback by deleting the organization
    await supabase.from('organizations').delete().eq('id', org.id)
    throw memberError
  }
  
  return org
}