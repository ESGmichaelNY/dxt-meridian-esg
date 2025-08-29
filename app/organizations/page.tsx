'use client'

import { useState } from 'react'
import { 
  useOrganizationList,
  useOrganization,
} from '@clerk/nextjs'
import CreateOrgModal from '@/components/organizations/CreateOrgModal'

interface OrganizationMembership {
  organization: {
    id: string
    name: string
    imageUrl?: string
    membersCount?: number
  }
}

export default function OrganizationsPage() {
  const [showCreateOrg, setShowCreateOrg] = useState(false)
  const { userMemberships, isLoaded, setActive } = useOrganizationList()
  const { organization } = useOrganization()

  if (!isLoaded) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Organizations</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your organizations and team members
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <button
            onClick={() => setShowCreateOrg(true)}
            className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <svg className="-ml-0.5 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create Organization
          </button>
        </div>
      </div>

      {/* Create Organization Modal */}
      <CreateOrgModal 
        isOpen={showCreateOrg}
        onClose={() => setShowCreateOrg(false)}
      />

      {/* Current Organization */}
      {organization && (
        <div className="mb-8 bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Current Organization</h2>
          </div>
          <div className="px-6 py-4">
            <div className="flex items-center">
              {organization.imageUrl && (
                <img 
                  src={organization.imageUrl} 
                  alt={organization.name}
                  className="h-12 w-12 rounded-full mr-4"
                />
              )}
              <div>
                <h3 className="text-lg font-medium text-gray-900">{organization.name}</h3>
                <p className="text-sm text-gray-500">
                  {organization.membersCount ?? 0} member{organization.membersCount !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Organizations List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">All Organizations</h2>
        </div>
        
        {userMemberships?.data && userMemberships.data.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {userMemberships.data.map((org: OrganizationMembership) => (
              <li key={org.organization.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {org.organization.imageUrl && (
                      <img 
                        src={org.organization.imageUrl} 
                        alt={org.organization.name}
                        className="h-10 w-10 rounded-full mr-4"
                      />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {org.organization.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {org.organization.membersCount ?? 0} member{org.organization.membersCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {org.organization.id === organization?.id && (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Active
                      </span>
                    )}
                    <button
                      onClick={() => setActive({ organization: org.organization.id })}
                      disabled={org.organization.id === organization?.id}
                      className={`${
                        org.organization.id === organization?.id
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-primary-600 text-white hover:bg-primary-700'
                      } inline-flex items-center rounded-md px-3 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                    >
                      {org.organization.id === organization?.id ? 'Current' : 'Switch'}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-6 py-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No organizations</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new organization.</p>
            <div className="mt-6">
              <button
                onClick={() => setShowCreateOrg(true)}
                className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <svg className="-ml-0.5 mr-1.5 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Create Organization
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Organization Members Section */}
      {organization && (
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Organization Members</h2>
          </div>
          <div className="px-6 py-4">
            <p className="text-sm text-gray-500">
              Manage members through the organization switcher menu above.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}