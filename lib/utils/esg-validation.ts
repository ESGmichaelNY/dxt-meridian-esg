/**
 * ESG Data Validation Utilities
 * 
 * Validation functions for ESG data entry forms
 */

/**
 * Validate emissions data value
 */
export function validateEmissionsData(value: any): boolean {
  if (value === null || value === undefined) {
    return false
  }
  
  if (typeof value === 'string' && isNaN(Number(value))) {
    return false
  }
  
  const numValue = Number(value)
  return !isNaN(numValue) && numValue >= 0
}

/**
 * Validate date range
 */
export function validateDateRange(startDate: Date, endDate: Date): boolean {
  return startDate <= endDate
}

/**
 * Format emissions value for display
 */
export function formatEmissionsValue(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Zod schema for emissions data form
 */
import { z } from 'zod'

export const emissionsDataSchema = z.object({
  scope1: z.number({
    required_error: 'Scope 1 emissions is required',
    invalid_type_error: 'Scope 1 emissions must be a number',
  }).min(0, 'Must be a positive number'),
  scope2: z.number({
    required_error: 'Scope 2 emissions is required',
    invalid_type_error: 'Scope 2 emissions must be a number',
  }).min(0, 'Must be a positive number'),
  scope3: z.number({
    invalid_type_error: 'Scope 3 emissions must be a number',
  }).min(0, 'Must be a positive number').optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  unit: z.enum(['tCO2e', 'kgCO2e', 'mtCO2e']).default('tCO2e'),
  notes: z.string().optional(),
})

export type EmissionsData = z.infer<typeof emissionsDataSchema>
