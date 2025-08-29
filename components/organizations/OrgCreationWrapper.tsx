'use client'

import { CreateOrganization } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

interface OrgCreationWrapperProps {
  onSuccess?: () => void
}

export default function OrgCreationWrapper({ onSuccess: _onSuccess }: OrgCreationWrapperProps) {
  const _router = useRouter()

  return (
    <CreateOrganization 
      routing="virtual"
      afterCreateOrganizationUrl="/dashboard"
      skipInvitationScreen={false}
      appearance={{
        elements: {
          rootBox: "w-full",
          card: "shadow-none p-0"
        }
      }}
    />
  )
}