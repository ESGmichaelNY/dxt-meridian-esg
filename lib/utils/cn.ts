/**
 * cn.ts
 * 
 * Utility for merging Tailwind CSS classes with proper precedence.
 * Uses clsx for conditional classes and tailwind-merge for deduplication.
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes with proper precedence.
 * Later classes override earlier ones when they affect the same CSS property.
 * 
 * @example
 * ```ts
 * cn('px-4 py-2', 'p-3') // Returns: 'p-3'
 * cn('text-red-500', condition && 'text-blue-500') // Conditional classes
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
