'use client'

import { CreateOrganization } from '@clerk/nextjs'

interface CreateOrgModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateOrgModal({ isOpen, onClose }: CreateOrgModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          onClick={onClose}
        />
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
              aria-label="Close"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <CreateOrganization 
            routing="virtual"
            afterCreateOrganizationUrl="/dashboard"
            skipInvitationScreen={false}
          />
        </div>
      </div>
    </div>
  )
}