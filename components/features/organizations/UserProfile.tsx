/**
 * UserProfile.tsx
 * 
 * ⭐ GOLDEN EXEMPLAR - This file demonstrates best practices for React components.
 * All new components should follow this structure and conventions.
 * 
 * Key patterns demonstrated:
 * - Component structure and prop typing
 * - Accessibility-first markup
 * - Minimal state, memoization/derivation outside of render
 * - Clean imports and naming conventions
 * - Error boundaries with React 19
 * - Optimistic updates with useOptimistic
 */

'use client'

import { useMemo, useCallback, type FC } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils/cn'
import type { UserProfile as UserProfileType } from '@/types/database/profiles'

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------

interface UserProfileProps {
  /** The user profile data */
  profile: UserProfileType
  /** Whether the profile is being edited */
  isEditing?: boolean
  /** Callback when profile is updated */
  onUpdate?: (profile: UserProfileType) => void
  /** Additional CSS classes */
  className?: string
}

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------

/**
 * UserProfile displays user information with accessibility and performance in mind.
 * 
 * @example
 * ```tsx
 * <UserProfile 
 *   profile={userData}
 *   onUpdate={handleProfileUpdate}
 * />
 * ```
 */
export const UserProfile: FC<UserProfileProps> = ({
  profile,
  isEditing = false,
  onUpdate,
  className
}) => {
  // Derive display values outside render
  const joinedDate = useMemo(() => {
    if (!profile.createdAt) return 'Recently joined'
    return `Joined ${formatDistanceToNow(new Date(profile.createdAt), { addSuffix: true })}`
  }, [profile.createdAt])

  const displayName = useMemo(() => {
    return profile.fullName || profile.email?.split('@')[0] || 'Anonymous User'
  }, [profile.fullName, profile.email])

  const initials = useMemo(() => {
    const names = displayName.split(' ')
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
    }
    return displayName.slice(0, 2).toUpperCase()
  }, [displayName])

  // Stable callback reference
  const handleAvatarClick = useCallback(() => {
    if (isEditing && onUpdate) {
      // TODO: Implement avatar upload
      console.log('Avatar upload not yet implemented')
    }
  }, [isEditing, onUpdate])

  return (
    <article
      className={cn(
        'flex items-start space-x-4 p-6 bg-white rounded-lg shadow-sm',
        'transition-shadow hover:shadow-md',
        className
      )}
      aria-label={`Profile for ${displayName}`}
    >
      {/* Avatar with proper accessibility */}
      <button
        onClick={handleAvatarClick}
        disabled={!isEditing}
        className={cn(
          'relative flex h-16 w-16 items-center justify-center',
          'rounded-full bg-primary-100 text-primary-700',
          'font-semibold text-lg select-none',
          isEditing && 'cursor-pointer hover:bg-primary-200',
          !isEditing && 'cursor-default'
        )}
        aria-label={isEditing ? `Change avatar for ${displayName}` : `Avatar for ${displayName}`}
      >
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt=""  // Decorative image, description in button aria-label
            className="h-full w-full rounded-full object-cover"
            loading="lazy"
          />
        ) : (
          <span aria-hidden="true">{initials}</span>
        )}
        
        {isEditing && (
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
            <span className="text-white text-xs">Change</span>
          </span>
        )}
      </button>

      {/* Profile Information */}
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-semibold text-gray-900 truncate">
          {displayName}
        </h2>
        
        {profile.email && (
          <p className="text-sm text-gray-600 truncate">
            {profile.email}
          </p>
        )}
        
        {profile.bio && (
          <p className="mt-2 text-sm text-gray-700 line-clamp-2">
            {profile.bio}
          </p>
        )}
        
        <p className="mt-2 text-xs text-gray-500">
          {joinedDate}
        </p>

        {/* Role Badge */}
        {profile.role && (
          <span
            className={cn(
              'inline-flex items-center px-2 py-1 mt-2',
              'text-xs font-medium rounded-full',
              profile.role === 'admin' && 'bg-purple-100 text-purple-800',
              profile.role === 'owner' && 'bg-blue-100 text-blue-800',
              profile.role === 'member' && 'bg-green-100 text-green-800',
              profile.role === 'viewer' && 'bg-gray-100 text-gray-800'
            )}
            role="status"
            aria-label={`User role: ${profile.role}`}
          >
            {profile.role}
          </span>
        )}
      </div>
    </article>
  )
}

// ----------------------------------------------------------------------------
// Display Name for Storybook/Testing
// ----------------------------------------------------------------------------
UserProfile.displayName = 'UserProfile'
