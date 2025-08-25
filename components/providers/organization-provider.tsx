'use client'

import { useOrganizationSync } from '@/hooks/use-organization-sync'

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
  // This component uses the hook to sync organization data with the database
  // whenever the organization context changes in Clerk
  useOrganizationSync()
  
  return <>{children}</>
}