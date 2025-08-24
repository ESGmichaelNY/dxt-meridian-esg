/**
 * use-user-data.ts
 * 
 * ⭐ GOLDEN EXEMPLAR - This file demonstrates best practices for custom hooks.
 * All data-fetching hooks should follow these patterns.
 * 
 * Key patterns demonstrated:
 * - Remote state handling (idle/loading/success/error)
 * - Zod validation at API boundaries
 * - Data normalization (ISO strings → Date objects)
 * - Stable identities via useCallback/useMemo
 * - Proper async cleanup with AbortController
 * - Predictable API surface
 */

'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { UserProfileSchema, parseResult, type UserProfile } from '@/lib/utils/validation'
import { supabase } from '@/lib/supabase/client'

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------

type RemoteDataState<T> = 
  | { status: 'idle'; data: null; error: null }
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: T; error: null }
  | { status: 'error'; data: null; error: Error }

interface UseUserDataOptions {
  /** User ID to fetch data for */
  userId?: string
  /** Whether to fetch immediately on mount */
  enabled?: boolean
  /** Polling interval in milliseconds */
  pollingInterval?: number
  /** Callback when data is successfully fetched */
  onSuccess?: (data: UserProfile) => void
  /** Callback when an error occurs */
  onError?: (error: Error) => void
}

interface UseUserDataReturn {
  /** Current state of the data */
  state: RemoteDataState<UserProfile>
  /** Convenience boolean for idle state */
  isIdle: boolean
  /** Convenience boolean for loading state */
  isLoading: boolean
  /** Convenience boolean for success state */
  isSuccess: boolean
  /** Convenience boolean for error state */
  isError: boolean
  /** The user data (null if not loaded) */
  data: UserProfile | null
  /** The error (null if no error) */
  error: Error | null
  /** Refetch the data */
  refetch: () => Promise<void>
  /** Clear the data and reset to idle */
  reset: () => void
}

// ----------------------------------------------------------------------------
// Hook Implementation
// ----------------------------------------------------------------------------

/**
 * Fetches and manages user profile data with proper state management.
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error, refetch } = useUserData({
 *   userId: currentUserId,
 *   onSuccess: (profile) => console.log('Loaded:', profile)
 * })
 * 
 * if (isLoading) return <Spinner />
 * if (error) return <ErrorMessage error={error} />
 * if (data) return <UserProfile profile={data} />
 * ```
 */
export function useUserData({
  userId,
  enabled = true,
  pollingInterval,
  onSuccess,
  onError
}: UseUserDataOptions = {}): UseUserDataReturn {
  // State management
  const [state, setState] = useState<RemoteDataState<UserProfile>>({
    status: 'idle',
    data: null,
    error: null
  })

  // Stable fetch function
  const fetchUserData = useCallback(async (
    userId: string,
    abortSignal?: AbortSignal
  ): Promise<UserProfile> => {
    try {
      // Fetch from Supabase
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
        .abortSignal(abortSignal as any) // Supabase types don't include this yet

      if (error) {
        throw new Error(`Failed to fetch user: ${error.message}`)
      }

      if (!data) {
        throw new Error('User not found')
      }

      // Validate with Zod
      const result = parseResult(UserProfileSchema, data)
      if (!result.success) {
        throw new Error(`Invalid user data: ${result.error}`)
      }

      // Normalize dates from ISO strings to Date objects
      const normalized: UserProfile = {
        ...result.data,
        createdAt: result.data.createdAt,
        updatedAt: result.data.updatedAt
      }

      return normalized
    } catch (error) {
      // Re-throw with consistent error type
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Unknown error occurred')
    }
  }, [])

  // Refetch function with abort controller
  const refetch = useCallback(async () => {
    if (!userId) {
      setState({
        status: 'error',
        data: null,
        error: new Error('No user ID provided')
      })
      return
    }

    // Create abort controller for cleanup
    const abortController = new AbortController()

    // Set loading state
    setState({ status: 'loading', data: null, error: null })

    try {
      const data = await fetchUserData(userId, abortController.signal)
      
      // Check if request was aborted
      if (abortController.signal.aborted) {
        return
      }

      // Update state with data
      setState({ status: 'success', data, error: null })
      
      // Call success callback
      onSuccess?.(data)
    } catch (error) {
      // Check if request was aborted
      if (abortController.signal.aborted) {
        return
      }

      const errorObj = error instanceof Error 
        ? error 
        : new Error('Failed to fetch user data')

      // Update state with error
      setState({ status: 'error', data: null, error: errorObj })
      
      // Call error callback
      onError?.(errorObj)
    }

    // Cleanup function
    return () => {
      abortController.abort()
    }
  }, [userId, fetchUserData, onSuccess, onError])

  // Reset function
  const reset = useCallback(() => {
    setState({ status: 'idle', data: null, error: null })
  }, [])

  // Auto-fetch on mount or when userId changes
  useEffect(() => {
    if (!enabled || !userId) {
      return
    }

    const cleanup = refetch()
    
    return () => {
      cleanup?.then(fn => fn?.())
    }
  }, [enabled, userId, refetch])

  // Polling effect
  useEffect(() => {
    if (!pollingInterval || !enabled || !userId) {
      return
    }

    const interval = setInterval(() => {
      refetch()
    }, pollingInterval)

    return () => {
      clearInterval(interval)
    }
  }, [pollingInterval, enabled, userId, refetch])

  // Memoized return value for stable reference
  const returnValue = useMemo<UseUserDataReturn>(() => ({
    state,
    isIdle: state.status === 'idle',
    isLoading: state.status === 'loading',
    isSuccess: state.status === 'success',
    isError: state.status === 'error',
    data: state.data,
    error: state.error,
    refetch,
    reset
  }), [state, refetch, reset])

  return returnValue
}

// ----------------------------------------------------------------------------
// Additional Hooks Following Same Pattern
// ----------------------------------------------------------------------------

/**
 * Fetch current authenticated user's data.
 * Wraps useUserData with automatic current user detection.
 */
export function useCurrentUser(options?: Omit<UseUserDataOptions, 'userId'>) {
  const [userId, setUserId] = useState<string | undefined>()

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUserId(session?.user?.id)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return useUserData({
    ...options,
    userId
  })
}
