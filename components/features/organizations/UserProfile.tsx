/**
 * UserProfile Component
 * 
 * This file is an EXCELLENT EXAMPLE OF BEST PRACTICES for React components.
 * Use this as a reference for component structure, prop typing, accessibility,
 * state management, and naming conventions.
 */

import { memo, useMemo } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { clsx } from 'clsx'
import type { User } from '@/types/database/user'

interface UserProfileProps {
  user: User
  showFullDetails?: boolean
  onEdit?: () => void
  className?: string
}

export const UserProfile = memo(function UserProfile({
  user,
  showFullDetails = false,
  onEdit,
  className
}: UserProfileProps) {
  const memberSince = useMemo(() => {
    if (!user.createdAt) return null
    return formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })
  }, [user.createdAt])

  const initials = useMemo(() => {
    const names = user.fullName?.split(' ') || []
    if (names.length === 0) return user.email.charAt(0).toUpperCase()
    return names
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }, [user.fullName, user.email])

  return (
    <div className={clsx('rounded-lg border border-gray-200 bg-white p-6', className)}>
      <div className="flex items-start space-x-4">
        {/* Avatar with proper alt text for accessibility */}
        <div className="relative">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={`${user.fullName || user.email}'s avatar`}
              className="h-16 w-16 rounded-full object-cover"
              loading="lazy"
            />
          ) : (
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-700"
              role="img"
              aria-label={`${user.fullName || user.email}'s avatar placeholder`}
            >
              <span className="text-xl font-semibold">{initials}</span>
            </div>
          )}
          {user.isVerified && (
            <div
              className="absolute -bottom-1 -right-1 rounded-full bg-success-500 p-1"
              title="Verified user"
            >
              <svg
                className="h-3 w-3 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>

        {/* User information */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {user.fullName || 'Unnamed User'}
              </h3>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            {onEdit && (
              <button
                onClick={onEdit}
                className="rounded-md bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-700 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                aria-label="Edit profile"
              >
                Edit
              </button>
            )}
          </div>

          {showFullDetails && (
            <div className="mt-4 space-y-2">
              {user.role && (
                <div className="flex items-center text-sm">
                  <span className="font-medium text-gray-700">Role:</span>
                  <span className="ml-2 text-gray-600">{user.role}</span>
                </div>
              )}
              {user.department && (
                <div className="flex items-center text-sm">
                  <span className="font-medium text-gray-700">Department:</span>
                  <span className="ml-2 text-gray-600">{user.department}</span>
                </div>
              )}
              {memberSince && (
                <div className="flex items-center text-sm">
                  <span className="font-medium text-gray-700">Member since:</span>
                  <span className="ml-2 text-gray-600">{memberSince}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

UserProfile.displayName = 'UserProfile'