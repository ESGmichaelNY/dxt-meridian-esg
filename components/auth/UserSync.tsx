'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect } from 'react'

export default function UserSync() {
  const { user, isLoaded } = useUser()

  useEffect(() => {
    async function syncUser() {
      if (isLoaded && user) {
        try {
          const response = await fetch('/api/user/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          })
          
          if (response.ok) {
            const data = await response.json()
            console.log('✅ User synced:', data)
          } else {
            console.error('Failed to sync user')
          }
        } catch (error) {
          console.error('Error syncing user:', error)
        }
      }
    }
    
    syncUser()
  }, [user, isLoaded])

  return null // This component doesn't render anything
}