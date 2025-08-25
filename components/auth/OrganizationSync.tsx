'use client'

import { useOrganizationSync } from '@/hooks/use-organization-sync'

export default function OrganizationSync() {
  // This component uses the hook to sync organization data
  // It doesn't render anything visible
  useOrganizationSync()
  
  return null
}