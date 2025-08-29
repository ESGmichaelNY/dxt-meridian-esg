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
            await response.json() // Consume the response
            // User synced successfully
          } else {
            const errorText = await response.text()
            console.error('Failed to sync user:', response.status, errorText)
          }
        } catch (error) {
          console.error('Error syncing user:', error)
        }
      }
    }
    
    void syncUser()
  }, [user, isLoaded])

  return null // This component doesn't render anything
}