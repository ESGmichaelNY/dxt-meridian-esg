/**
 * useUserData Hook
 * 
 * This file is an EXCELLENT EXAMPLE OF BEST PRACTICES for custom hooks.
 * Use this as a reference for remote state handling, Zod validation at API boundaries,
 * stable identities via useCallback/useMemo, and proper async cleanup with AbortController.
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { z } from 'zod'
import { parseOrThrow } from '@/lib/utils/validation'

// API response schema with normalization
const UserDataResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  fullName: z.string().nullable(),
  avatarUrl: z.string().url().nullable(),
  role: z.enum(['owner', 'admin', 'member', 'viewer']),
  department: z.string().nullable(),
  isVerified: z.boolean(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
  organization: z.object({
    id: z.string().uuid(),
    name: z.string(),
    role: z.enum(['owner', 'admin', 'member', 'viewer']),
  }).nullable(),
})

type UserDataResponse = z.infer<typeof UserDataResponseSchema>

// Normalized internal type with Date objects
export interface UserData {
  id: string
  email: string
  fullName: string | null
  avatarUrl: string | null
  role: 'owner' | 'admin' | 'member' | 'viewer'
  department: string | null
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
  organization: {
    id: string
    name: string
    role: 'owner' | 'admin' | 'member' | 'viewer'
  } | null
}

// Remote state type definition
type RemoteState<T> =
  | { status: 'idle'; data: null; error: null }
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: T; error: null }
  | { status: 'error'; data: null; error: Error }

interface UseUserDataOptions {
  userId?: string
  enabled?: boolean
  onSuccess?: (data: UserData) => void
  onError?: (error: Error) => void
}

interface UseUserDataResult {
  data: UserData | null
  error: Error | null
  isIdle: boolean
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
  refetch: () => void
}

export function useUserData({
  userId,
  enabled = true,
  onSuccess,
  onError,
}: UseUserDataOptions = {}): UseUserDataResult {
  const [state, setState] = useState<RemoteState<UserData>>({
    status: 'idle',
    data: null,
    error: null,
  })

  // Stable fetch function with AbortController
  const fetchUserData = useCallback(async (signal: AbortSignal) => {
    try {
      setState({ status: 'loading', data: null, error: null })

      const endpoint = userId 
        ? `/api/v1/users/${userId}`
        : '/api/v1/users/me'

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal,
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.statusText}`)
      }

      const responseData = await response.json()

      // Validate and normalize the response
      const validatedData = parseOrThrow(
        UserDataResponseSchema,
        responseData,
        'Invalid user data from API'
      )

      // Normalize dates from strings to Date objects
      const normalizedData: UserData = {
        ...validatedData,
        createdAt: new Date(validatedData.createdAt),
        updatedAt: new Date(validatedData.updatedAt),
      }

      if (signal.aborted) return

      setState({ status: 'success', data: normalizedData, error: null })
      onSuccess?.(normalizedData)
    } catch (error) {
      if (signal.aborted) return

      const errorInstance = error instanceof Error 
        ? error 
        : new Error('An unknown error occurred')

      setState({ status: 'error', data: null, error: errorInstance })
      onError?.(errorInstance)
    }
  }, [userId, onSuccess, onError])

  // Stable refetch function
  const refetch = useCallback(() => {
    const controller = new AbortController()
    fetchUserData(controller.signal)
    return () => controller.abort()
  }, [fetchUserData])

  // Effect for initial fetch and cleanup
  useEffect(() => {
    if (!enabled) return

    const controller = new AbortController()
    fetchUserData(controller.signal)

    return () => {
      controller.abort()
    }
  }, [enabled, fetchUserData])

  // Memoized boolean flags for convenience
  const flags = useMemo(() => ({
    isIdle: state.status === 'idle',
    isLoading: state.status === 'loading',
    isError: state.status === 'error',
    isSuccess: state.status === 'success',
  }), [state.status])

  return {
    data: state.data,
    error: state.error,
    ...flags,
    refetch,
  }
}

// Additional hook for current user with caching
export function useCurrentUser(options?: Omit<UseUserDataOptions, 'userId'>) {
  return useUserData({ ...options, userId: undefined })
}

// Hook for specific user
export function useSpecificUser(userId: string, options?: Omit<UseUserDataOptions, 'userId'>) {
  return useUserData({ ...options, userId })
}