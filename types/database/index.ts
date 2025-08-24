/**
 * Database Type Helpers
 * 
 * Utility types for working with Supabase generated types.
 * Import the generated types and use these helpers for better DX.
 */

import type { Database } from './generated'

// Table types
export type Tables = Database['public']['Tables']
export type Enums = Database['public']['Enums']
export type Functions = Database['public']['Functions']
export type Views = Database['public']['Views']

// Individual table types
export type Organization = Tables['organizations']['Row']
export type OrganizationInsert = Tables['organizations']['Insert']
export type OrganizationUpdate = Tables['organizations']['Update']

export type Profile = Tables['profiles']['Row']
export type ProfileInsert = Tables['profiles']['Insert']
export type ProfileUpdate = Tables['profiles']['Update']

export type OrganizationMember = Tables['organization_members']['Row']
export type OrganizationMemberInsert = Tables['organization_members']['Insert']
export type OrganizationMemberUpdate = Tables['organization_members']['Update']

export type TemporalData = Tables['temporal_data']['Row']
export type TemporalDataInsert = Tables['temporal_data']['Insert']
export type TemporalDataUpdate = Tables['temporal_data']['Update']

// Enum types (if any)
export type UserRole = Enums['user_role']
export type DataCategory = Enums['data_category']
export type ReportStatus = Enums['report_status']

// Utility types for API responses
export type ApiResponse<T> = 
  | { success: true; data: T; error?: never }
  | { success: false; data?: never; error: string }

// Utility type for nullable fields (Supabase returns null, not undefined)
export type Nullable<T> = T | null

// Type guard helpers
export function isOrganization(obj: unknown): obj is Organization {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    'created_at' in obj
  )
}

export function isProfile(obj: unknown): obj is Profile {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'user_id' in obj &&
    'created_at' in obj
  )
}

// Helper for extracting column names (useful for select queries)
export type ColumnNames<T extends keyof Tables> = keyof Tables[T]['Row']

// Helper for relationships (if using Supabase's relational queries)
export type WithRelations<T, R extends Record<string, unknown>> = T & R

// Example usage with relations:
// type ProfileWithOrg = WithRelations<Profile, { organization: Organization }>

// Query builder types for better type inference
export type SelectQuery<T extends keyof Tables> = {
  select?: Array<ColumnNames<T>>
  where?: Partial<Tables[T]['Row']>
  orderBy?: ColumnNames<T>
  limit?: number
}

// Error types
export class DatabaseError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'DatabaseError'
  }
}

// Pagination types
export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Date handling helpers (Supabase returns ISO strings)
export function parseSupabaseDate(dateString: string | null): Date | null {
  if (!dateString) return null
  return new Date(dateString)
}

export function toSupabaseDate(date: Date): string {
  return date.toISOString()
}

// JSONB type helpers
export type JsonValue = 
  | string 
  | number 
  | boolean 
  | null 
  | JsonObject 
  | JsonArray

export interface JsonObject {
  [key: string]: JsonValue
}

export interface JsonArray extends Array<JsonValue> {}

// Type-safe JSONB casting
export function parseJsonb<T>(value: unknown): T {
  if (typeof value === 'string') {
    return JSON.parse(value) as T
  }
  return value as T
}

// Export everything from generated types (for convenience)
export * from './generated'