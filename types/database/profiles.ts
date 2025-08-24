/**
 * profiles.ts
 * 
 * Extended types for user profiles with additional helper types.
 */

import type { Database } from './generated'

// Base types from Supabase
export type ProfileRow = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

// Extended type with role information
export interface UserProfile extends ProfileRow {
  role?: 'owner' | 'admin' | 'member' | 'viewer'
  organization?: {
    id: string
    name: string
    slug: string
  }
}

// Profile with organization memberships
export interface ProfileWithMemberships extends ProfileRow {
  organization_members: Array<{
    organization_id: string
    role: 'owner' | 'admin' | 'member' | 'viewer'
    organization: {
      id: string
      name: string
      slug: string
    }
  }>
}

// Public profile (safe to expose)
export interface PublicProfile {
  id: string
  fullName: string | null
  avatarUrl: string | null
  bio: string | null
}

// Profile creation payload
export interface CreateProfilePayload {
  email: string
  fullName?: string
  bio?: string
  avatarUrl?: string
}

// Profile update payload
export interface UpdateProfilePayload {
  fullName?: string
  bio?: string
  avatarUrl?: string
}
