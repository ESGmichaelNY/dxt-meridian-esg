/**
 * validation.ts
 * 
 * ⭐ GOLDEN EXEMPLAR - This file demonstrates best practices for validation utilities.
 * All validation modules should follow these patterns.
 * 
 * Key patterns demonstrated:
 * - Centralized Zod schemas and parsers
 * - Clear, consistent error handling
 * - Reusable validation helpers and type guards
 * - Pure functions with no side effects
 * - Proper TypeScript inference
 */

import { z } from 'zod'

// ----------------------------------------------------------------------------
// Common Scalar Schemas (reusable across the app)
// ----------------------------------------------------------------------------

/** UUID v4 validation */
export const UUIDSchema = z.string().uuid('Invalid UUID format')

/** Email validation with proper format */
export const EmailSchema = z.string().email('Invalid email address').toLowerCase()

/** URL validation */
export const URLSchema = z.string().url('Invalid URL format')

/** ISO date string validation */
export const ISODateStringSchema = z.string().datetime({ 
  message: 'Invalid ISO date format' 
})

/** Phone number validation (international format) */
export const PhoneSchema = z.string().regex(
  /^\+?[1-9]\d{1,14}$/,
  'Invalid phone number format'
)

/** Strong password validation */
export const PasswordSchema = z.string()
  .min(12, 'Password must be at least 12 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')

/** Positive integer validation */
export const PositiveIntSchema = z.number().int().positive()

/** Pagination parameters */
export const PaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
})

// ----------------------------------------------------------------------------
// Domain-Specific Schemas
// ----------------------------------------------------------------------------

/** Organization role enum */
export const OrganizationRoleSchema = z.enum(['owner', 'admin', 'member', 'viewer'])

/** User profile schema */
export const UserProfileSchema = z.object({
  id: UUIDSchema,
  email: EmailSchema,
  fullName: z.string().min(1).max(100).optional(),
  avatarUrl: URLSchema.optional(),
  bio: z.string().max(500).optional(),
  role: OrganizationRoleSchema.optional(),
  createdAt: ISODateStringSchema,
  updatedAt: ISODateStringSchema
})

/** Organization schema */
export const OrganizationSchema = z.object({
  id: UUIDSchema,
  name: z.string().min(1).max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  description: z.string().max(500).optional(),
  logoUrl: URLSchema.optional(),
  website: URLSchema.optional(),
  createdAt: ISODateStringSchema,
  updatedAt: ISODateStringSchema
})

/** ESG data entry schema */
export const ESGDataEntrySchema = z.object({
  organizationId: UUIDSchema,
  category: z.enum(['emissions', 'social', 'governance']),
  metric: z.string().min(1).max(100),
  value: z.number(),
  unit: z.string().min(1).max(50),
  period: z.object({
    start: ISODateStringSchema,
    end: ISODateStringSchema
  }),
  metadata: z.record(z.unknown()).optional(),
  verified: z.boolean().default(false)
})

// ----------------------------------------------------------------------------
// Validation Helpers
// ----------------------------------------------------------------------------

/**
 * Parse data and throw an error if invalid.
 * Use this when you want validation to halt execution on failure.
 * 
 * @example
 * ```ts
 * const user = parseOrThrow(UserProfileSchema, userData)
 * // user is now typed as UserProfile
 * ```
 */
export function parseOrThrow<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  errorPrefix = 'Validation failed'
): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      throw new Error(`${errorPrefix}: ${issues}`)
    }
    throw error
  }
}

/**
 * Parse data and return a Result type.
 * Use this when you want to handle validation errors gracefully.
 * 
 * @example
 * ```ts
 * const result = parseResult(UserProfileSchema, userData)
 * if (result.success) {
 *   console.log(result.data) // Typed as UserProfile
 * } else {
 *   console.error(result.error)
 * }
 * ```
 */
export function parseResult<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): 
  | { success: true; data: T }
  | { success: false; error: string } {
  const result = schema.safeParse(data)
  
  if (result.success) {
    return { success: true, data: result.data }
  }
  
  const issues = result.error.errors
    .map(e => `${e.path.join('.')}: ${e.message}`)
    .join(', ')
  
  return { success: false, error: issues }
}

/**
 * Create a type guard function from a Zod schema.
 * Use this when you need runtime type checking in conditional logic.
 * 
 * @example
 * ```ts
 * const isValidUser = makeGuard(UserProfileSchema)
 * if (isValidUser(data)) {
 *   // data is now typed as UserProfile
 * }
 * ```
 */
export function makeGuard<T>(
  schema: z.ZodSchema<T>
): (value: unknown) => value is T {
  return (value: unknown): value is T => {
    return schema.safeParse(value).success
  }
}

/**
 * Validate environment variables.
 * Throws on invalid configuration to fail fast.
 */
export function validateEnv() {
  const EnvSchema = z.object({
    // Public env vars (safe for client)
    NEXT_PUBLIC_SUPABASE_URL: URLSchema,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
    NEXT_PUBLIC_APP_URL: URLSchema,
    
    // Server-only env vars
    ...(typeof window === 'undefined' ? {
      SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
      SUPABASE_PROJECT_ID: z.string().min(1),
    } : {})
  })
  
  return parseOrThrow(EnvSchema, process.env, 'Environment validation failed')
}

/**
 * Sanitize user input for display.
 * Prevents XSS by escaping HTML entities.
 */
export function sanitizeHtml(input: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  }
  
  return input.replace(/[&<>"'/]/g, char => htmlEntities[char] || char)
}

/**
 * Validate and normalize date inputs.
 * Converts various date formats to ISO string.
 */
export function normalizeDate(input: unknown): string {
  if (typeof input === 'string') {
    const date = new Date(input)
    if (!isNaN(date.getTime())) {
      return date.toISOString()
    }
  }
  
  if (input instanceof Date) {
    return input.toISOString()
  }
  
  throw new Error('Invalid date input')
}

// ----------------------------------------------------------------------------
// Type Exports
// ----------------------------------------------------------------------------

export type UUID = z.infer<typeof UUIDSchema>
export type Email = z.infer<typeof EmailSchema>
export type OrganizationRole = z.infer<typeof OrganizationRoleSchema>
export type UserProfile = z.infer<typeof UserProfileSchema>
export type Organization = z.infer<typeof OrganizationSchema>
export type ESGDataEntry = z.infer<typeof ESGDataEntrySchema>
export type PaginationParams = z.infer<typeof PaginationSchema>
