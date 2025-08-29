import { describe, it, expect } from 'vitest'
import { 
  validateEmissionsData, 
  validateDateRange,
  formatEmissionsValue 
} from '@/lib/utils/esg-validation'

describe('ESG Data Validation', () => {
  describe('validateEmissionsData', () => {
    it('should validate positive numbers', () => {
      expect(validateEmissionsData(100)).toBe(true)
      expect(validateEmissionsData(0)).toBe(true)
      expect(validateEmissionsData(1234.56)).toBe(true)
    })

    it('should reject negative numbers', () => {
      expect(validateEmissionsData(-1)).toBe(false)
      expect(validateEmissionsData(-100)).toBe(false)
    })

    it('should reject non-numeric values', () => {
      expect(validateEmissionsData('abc')).toBe(false)
      expect(validateEmissionsData(null)).toBe(false)
      expect(validateEmissionsData(undefined)).toBe(false)
    })
  })

  describe('validateDateRange', () => {
    it('should validate correct date ranges', () => {
      const startDate = new Date('2025-01-01')
      const endDate = new Date('2025-01-31')
      
      expect(validateDateRange(startDate, endDate)).toBe(true)
    })

    it('should reject end date before start date', () => {
      const startDate = new Date('2025-01-31')
      const endDate = new Date('2025-01-01')
      
      expect(validateDateRange(startDate, endDate)).toBe(false)
    })

    it('should allow same start and end date', () => {
      const date = new Date('2025-01-15')
      
      expect(validateDateRange(date, date)).toBe(true)
    })
  })

  describe('formatEmissionsValue', () => {
    it('should format numbers to 2 decimal places', () => {
      expect(formatEmissionsValue(1234.567)).toBe('1,234.57')
      expect(formatEmissionsValue(1000)).toBe('1,000.00')
      expect(formatEmissionsValue(0.1)).toBe('0.10')
    })

    it('should handle large numbers', () => {
      expect(formatEmissionsValue(1234567.89)).toBe('1,234,567.89')
    })

    it('should handle zero', () => {
      expect(formatEmissionsValue(0)).toBe('0.00')
    })
  })
})
