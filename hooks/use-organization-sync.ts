'use client'

import { useOrganization } from '@clerk/nextjs'
import { useEffect } from 'react'

export function useOrganizationSync() {
  const { organization, isLoaded } = useOrganization()
  
  useEffect(() => {
    async function syncOrganization() {
      if (!organization) return
      
      try {
        const response = await fetch('/api/organizations/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: organization.id,
            name: organization.name,
            slug: organization.slug,
            createdAt: organization.createdAt,
            updatedAt: organization.updatedAt,
            membersCount: organization.membersCount,
            maxAllowedMemberships: organization.maxAllowedMemberships,
          })
        })
        
        if (response.ok) {
          // Organization synced successfully
        } else {
          const error = await response.text()
          console.error('Failed to sync organization:', error)
        }
      } catch (error) {
        console.error('Failed to sync organization:', error)
      }
    }
    
    if (isLoaded && organization) {
      void syncOrganization()
    }
  }, [organization, isLoaded])
  
  return { organization, isLoaded }
}