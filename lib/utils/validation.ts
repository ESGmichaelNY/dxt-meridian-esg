/**
 * Validation Utilities
 * 
 * This file is an EXCELLENT EXAMPLE OF BEST PRACTICES for utility modules.
 * Use this as a reference for centralized Zod schemas, consistent error handling,
 * reusable validation helpers, and type guards.
 */

import { z } from 'zod'

// Common scalar schemas - reusable across the application
export const UUIDSchema = z.string().uuid('Invalid UUID format')
export const EmailSchema = z.string().email('Invalid email address')
export const URLSchema = z.string().url('Invalid URL format')
export const ISODateStringSchema = z.string().datetime({ offset: true })
export const PositiveIntSchema = z.number().int().positive()
export const NonEmptyStringSchema = z.string().min(1, 'Field cannot be empty')

// Password validation with detailed requirements
export const PasswordSchema = z
  .string()
  .min(12, 'Password must be at least 12 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')

// Helper function for parsing with error throwing
export function parseOrThrow<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  errorPrefix = 'Validation error'
): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
      throw new Error(`${errorPrefix}: ${messages.join(', ')}`)
    }
    throw error
  }
}

// Helper function for safe parsing with result object
export function result<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data)
  
  if (result.success) {
    return { success: true, data: result.data }
  }
  
  const messages = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
  return { success: false, error: messages.join(', ') }
}

// Type guard factory
export function makeGuard<T>(schema: z.ZodSchema<T>) {
  return (value: unknown): value is T => {
    return schema.safeParse(value).success
  }
}

// Common entity schemas
export const UserSchema = z.object({
  id: UUIDSchema,
  email: EmailSchema,
  fullName: z.string().nullable(),
  avatarUrl: URLSchema.nullable(),
  role: z.enum(['owner', 'admin', 'member', 'viewer']),
  department: z.string().nullable(),
  isVerified: z.boolean(),
  createdAt: ISODateStringSchema,
  updatedAt: ISODateStringSchema,
})

export const OrganizationSchema = z.object({
  id: UUIDSchema,
  name: NonEmptyStringSchema,
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  industry: z.string().nullable(),
  size: z.enum(['small', 'medium', 'large', 'enterprise']).nullable(),
  website: URLSchema.nullable(),
  createdAt: ISODateStringSchema,
  updatedAt: ISODateStringSchema,
})

export const PaginationSchema = z.object({
  page: PositiveIntSchema.default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
})

// Type exports
export type User = z.infer<typeof UserSchema>
export type Organization = z.infer<typeof OrganizationSchema>
export type Pagination = z.infer<typeof PaginationSchema>

// Type guards
export const isUser = makeGuard(UserSchema)
export const isOrganization = makeGuard(OrganizationSchema)
export const isUUID = makeGuard(UUIDSchema)
export const isEmail = makeGuard(EmailSchema)

// Validation utilities for forms
export function validateFormData<T>(
  schema: z.ZodSchema<T>,
  formData: FormData
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const data: Record<string, unknown> = {}
  
  for (const [key, value] of formData.entries()) {
    data[key] = value
  }
  
  const result = schema.safeParse(data)
  
  if (result.success) {
    return { success: true, data: result.data }
  }
  
  const errors: Record<string, string> = {}
  for (const error of result.error.errors) {
    const path = error.path.join('.')
    errors[path] = error.message
  }
  
  return { success: false, errors }
}

// Sanitization helpers
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim()
}

// Normalization helpers
export function normalizeDate(dateString: string): Date {
  const parsed = parseOrThrow(ISODateStringSchema, dateString, 'Invalid date format')
  return new Date(parsed)
}

export function normalizePhoneNumber(phone: string): string {
  return phone.replace(/\D/g, '')
}