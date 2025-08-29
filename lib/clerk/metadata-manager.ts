// Utility functions for managing Clerk metadata for ESG features
// File: lib/clerk/metadata-manager.ts

import { clerkClient } from '@clerk/nextjs/server'
import { auth } from '@clerk/nextjs/server'

// ==========================================
// USER METADATA MANAGEMENT
// ==========================================

interface UserESGMetadata {
  // Public metadata (visible to user)
  public: {
    department?: string
    jobTitle?: string
    timezone?: string
    locale?: string
    preferences?: {
      dashboardLayout?: 'grid' | 'list'
      emailNotifications?: boolean
      reportFrequency?: 'weekly' | 'monthly' | 'quarterly'
      defaultMetrics?: string[]
    }
  }
  // Private metadata (backend only)
  private: {
    dataAccessLevel?: 'viewer' | 'contributor' | 'manager' | 'admin'
    permissions?: string[]
    certifications?: string[]
    trainingCompleted?: string[]
    lastDataEntry?: string
    apiQuota?: number
    subscriptionTier?: 'free' | 'starter' | 'professional' | 'enterprise'
  }
  // Unsafe metadata (user can modify)
  unsafe: {
    displayName?: string
    bio?: string
    linkedIn?: string
    personalGoals?: string[]
  }
}

export async function updateUserESGMetadata(
  userId: string,
  metadata: Partial<UserESGMetadata>
) {
  try {
    const updates: any = {}
    
    if (metadata.public) {
      updates.publicMetadata = metadata.public
    }
    
    if (metadata.private) {
      // Only admins can update private metadata
      const { orgRole } = await auth()
      if (orgRole !== 'org:admin' && orgRole !== 'org:owner') {
        throw new Error('Insufficient permissions to update private metadata')
      }
      updates.privateMetadata = metadata.private
    }
    
    if (metadata.unsafe) {
      updates.unsafeMetadata = metadata.unsafe
    }
    
    const client = await clerkClient()
    const user = await client.users.updateUserMetadata(userId, updates)
    return user
  } catch (error) {
    console.error('Error updating user metadata:', error)
    throw error
  }
}

// Get complete user profile with all metadata
export async function getUserCompleteProfile(userId: string) {
  const client = await clerkClient()
  const user = await client.users.getUser(userId)
  
  return {
    // Basic info
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress,
    name: `${user.firstName} ${user.lastName}`.trim(),
    username: user.username,
    imageUrl: user.imageUrl,
    
    // Contact
    phoneNumber: user.phoneNumbers[0]?.phoneNumber,
    
    // Security
    twoFactorEnabled: user.twoFactorEnabled,
    lastSignInAt: user.lastSignInAt,
    
    // ESG-specific from metadata
    department: user.publicMetadata?.department,
    jobTitle: user.publicMetadata?.jobTitle,
    timezone: user.publicMetadata?.timezone || 'UTC',
    preferences: user.publicMetadata?.preferences || {},
    
    // Permissions (private)
    dataAccessLevel: user.privateMetadata?.dataAccessLevel || 'viewer',
    permissions: user.privateMetadata?.permissions || [],
    
    // Profile completeness
    profileCompleteness: calculateProfileCompleteness(user)
  }
}

// ==========================================
// ORGANIZATION METADATA MANAGEMENT
// ==========================================

interface OrganizationESGMetadata {
  // Public metadata (visible to members)
  public: {
    // Company info
    industry?: string
    sector?: string
    size?: 'small' | 'medium' | 'large' | 'enterprise'
    country?: string
    headquartersLocation?: string
    website?: string
    
    // ESG specific
    reportingFrameworks?: ('GRI' | 'TCFD' | 'SASB' | 'CDP' | 'ISSB')[]
    certifications?: string[]
    sustainabilityGoals?: {
      netZeroTarget?: string
      carbonNeutralTarget?: string
      renewableEnergyTarget?: string
      wasteReductionTarget?: string
    }
    fiscalYearEnd?: string // MM-DD format
    reportingPeriod?: 'monthly' | 'quarterly' | 'annually'
    
    // Metrics
    employeeCount?: number
    annualRevenue?: number
    operatingCountries?: string[]
  }
  
  // Private metadata (backend only)
  private: {
    // Subscription
    subscriptionTier?: 'free' | 'starter' | 'professional' | 'enterprise'
    subscriptionExpiry?: string
    billingEmail?: string
    
    // Limits
    maxUsers?: number
    maxDataPoints?: number
    apiRateLimit?: number
    storageQuotaGB?: number
    
    // Features
    enabledFeatures?: string[]
    customBranding?: boolean
    whiteLabel?: boolean
    
    // Compliance
    dataRetentionDays?: number
    auditLogEnabled?: boolean
    encryptionEnabled?: boolean
    
    // Internal
    accountManager?: string
    contractValue?: number
    renewalDate?: string
    notes?: string
  }
}

export async function updateOrganizationESGMetadata(
  orgId: string,
  metadata: Partial<OrganizationESGMetadata>
) {
  try {
    // Check permissions
    const { orgRole } = await auth()
    if (orgRole !== 'org:admin' && orgRole !== 'org:owner') {
      throw new Error('Only organization admins can update metadata')
    }
    
    const updates: any = {}
    
    if (metadata.public) {
      updates.publicMetadata = metadata.public
    }
    
    if (metadata.private) {
      // Extra check for private metadata
      if (orgRole !== 'org:owner') {
        throw new Error('Only organization owners can update private metadata')
      }
      updates.privateMetadata = metadata.private
    }
    
    const client = await clerkClient()
    const org = await client.organizations.updateOrganizationMetadata(
      orgId,
      updates
    )
    
    return org
  } catch (error) {
    console.error('Error updating organization metadata:', error)
    throw error
  }
}

// Get organization profile with ESG context
export async function getOrganizationESGProfile(orgId: string) {
  const client = await clerkClient()
  const org = await client.organizations.getOrganization({ organizationId: orgId })
  
  return {
    // Basic info
    id: org.id,
    name: org.name,
    slug: org.slug,
    imageUrl: org.imageUrl,
    membersCount: org.membersCount,
    
    // ESG Profile
    industry: org.publicMetadata?.industry,
    reportingFrameworks: org.publicMetadata?.reportingFrameworks || [],
    certifications: org.publicMetadata?.certifications || [],
    sustainabilityGoals: org.publicMetadata?.sustainabilityGoals || {},
    
    // Subscription (only if admin)
    subscription: await getSubscriptionDetails(org),
    
    // Compliance readiness
    complianceScore: calculateComplianceReadiness(org),
    
    // Data completeness
    dataCompleteness: await calculateDataCompleteness(orgId)
  }
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function calculateProfileCompleteness(user: any): number {
  const fields = [
    user.firstName,
    user.lastName,
    user.emailAddresses?.length > 0,
    user.phoneNumbers?.length > 0,
    user.imageUrl,
    user.publicMetadata?.department,
    user.publicMetadata?.jobTitle,
    user.publicMetadata?.timezone,
    user.twoFactorEnabled
  ]
  
  const completed = fields.filter(Boolean).length
  return Math.round((completed / fields.length) * 100)
}

function calculateComplianceReadiness(org: any): number {
  const requirements = [
    org.publicMetadata?.reportingFrameworks?.length > 0,
    org.publicMetadata?.fiscalYearEnd,
    org.publicMetadata?.industry,
    org.publicMetadata?.country,
    org.publicMetadata?.sustainabilityGoals?.netZeroTarget,
    org.privateMetadata?.auditLogEnabled,
    org.privateMetadata?.dataRetentionDays > 0
  ]
  
  const met = requirements.filter(Boolean).length
  return Math.round((met / requirements.length) * 100)
}

async function getSubscriptionDetails(org: any) {
  // Only return subscription details if user is admin
  const { orgRole } = await auth()
  if (orgRole !== 'org:admin' && orgRole !== 'org:owner') {
    return null
  }
  
  return {
    tier: org.privateMetadata?.subscriptionTier || 'free',
    expiry: org.privateMetadata?.subscriptionExpiry,
    maxUsers: org.privateMetadata?.maxUsers || 5,
    features: org.privateMetadata?.enabledFeatures || []
  }
}

async function calculateDataCompleteness(orgId: string): Promise<number> {
  // This would query your database to check data completeness
  // Placeholder implementation
  return 75
}

// ==========================================
// BULK OPERATIONS
// ==========================================

export async function bulkUpdateUserDepartments(
  updates: { userId: string; department: string }[]
) {
  const results = await Promise.allSettled(
    updates.map(async ({ userId, department }) => {
      const client = await clerkClient()
      await client.users.updateUserMetadata(userId, {
        publicMetadata: { department }
      })
    })
  )
  
  const successful = results.filter(r => r.status === 'fulfilled').length
  const failed = results.filter(r => r.status === 'rejected').length
  
  return { successful, failed, total: updates.length }
}

export async function setOrganizationESGDefaults(orgId: string) {
  // Set default ESG configuration for new organizations
  return updateOrganizationESGMetadata(orgId, {
    public: {
      reportingPeriod: 'quarterly',
      reportingFrameworks: ['GRI'],
      size: 'medium'
    },
    private: {
      subscriptionTier: 'free',
      maxUsers: 5,
      maxDataPoints: 1000,
      apiRateLimit: 100,
      storageQuotaGB: 5,
      dataRetentionDays: 365,
      auditLogEnabled: true,
      enabledFeatures: ['basic_reporting', 'data_entry', 'dashboard']
    }
  })
}