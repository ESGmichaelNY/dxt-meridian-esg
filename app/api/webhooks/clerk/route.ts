import { headers } from 'next/headers'
import { type WebhookEvent } from '@clerk/nextjs/server'
import { Webhook } from 'svix'
import { getDb } from '@/lib/db/server'
import { organizations, organizationMembers, profiles } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

// Type definitions for Clerk webhook event data
interface OrganizationEventData {
  id: string
  name: string
  slug?: string
  created_at?: number
}

interface PublicUserData {
  user_id: string
  first_name?: string
  last_name?: string
  email?: string
}

interface OrganizationMembershipEventData {
  organization: {
    id: string
    name: string
  }
  public_user_data: PublicUserData
  role?: string
}

interface UserEventData {
  id: string
  email_addresses: { email_address: string }[]
  first_name?: string
  last_name?: string
}

interface UserWebhookEvent extends Omit<WebhookEvent, 'data'> {
  data: UserEventData
}

interface OrganizationWebhookEvent extends Omit<WebhookEvent, 'data'> {
  data: OrganizationEventData
}

interface OrganizationMembershipWebhookEvent extends Omit<WebhookEvent, 'data'> {
  data: OrganizationMembershipEventData
}

type TypedWebhookEvent = UserWebhookEvent | OrganizationWebhookEvent | OrganizationMembershipWebhookEvent

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your webhook secret
  // For development, we'll use a default secret. In production, use CLERK_WEBHOOK_SECRET
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET ?? 'whsec_development_secret'
  
  // For development without webhook verification
  if (webhookSecret === 'whsec_development_secret') {
    console.log('⚠️ Running in development mode without webhook verification')
    
    // Handle the webhook event
    const evt = payload as TypedWebhookEvent
    const eventType = evt.type
    
    if (eventType === 'user.created' || eventType === 'user.updated') {
      const userEvent = evt as UserWebhookEvent
      const { id, email_addresses, first_name, last_name } = userEvent.data
      
      const email = email_addresses[0]?.email_address
      const _fullName = [first_name, last_name].filter(Boolean).join(' ')
      
      if (email) {
        // TODO: Sync user to database using Drizzle instead of RPC
        console.log(`User ${id} would be synced to database`)
      }
    }
    
    // Handle organization events
    if (eventType === 'organization.created' || eventType === 'organization.updated') {
      const orgEvent = evt as OrganizationWebhookEvent
      const { id, name, slug } = orgEvent.data
      
      const db = getDb()
      
      try {
        await db
          .insert(organizations)
          .values({
            id,  // Use Clerk org ID directly
            name,
            slug: slug ?? name.toLowerCase().replace(/\s+/g, '-'),
            // Let database handle timestamps with defaultNow()
          })
          .onConflictDoUpdate({
            target: organizations.id,
            set: {
              name,
              slug: slug ?? name.toLowerCase().replace(/\s+/g, '-'),
              // Let database handle updatedAt
            }
          })
        
        console.log(`✅ Organization ${id} synced to database`)
      } catch (error) {
        console.error('Error syncing organization:', error)
        return new Response('Database error', { status: 500 })
      }
    }
    
    // Handle organization membership
    if (eventType === 'organizationMembership.created' || eventType === 'organizationMembership.updated') {
      const membershipEvent = evt as OrganizationMembershipWebhookEvent
      const { organization, public_user_data, role } = membershipEvent.data
      
      const db = getDb()
      
      try {
        // Ensure user profile exists first
        const userId = public_user_data.user_id
        const userEmail = public_user_data.email ?? `${userId}@placeholder.local`
        
        await db
          .insert(profiles)
          .values({
            id: userId,
            email: userEmail,
            fullName: public_user_data.first_name && public_user_data.last_name 
              ? `${public_user_data.first_name} ${public_user_data.last_name}`
              : null,
            // Let database handle updatedAt
          })
          .onConflictDoNothing()
        
        // Now insert or update membership
        await db
          .insert(organizationMembers)
          .values({
            organizationId: organization.id,
            userId: userId,
            role: (role ?? 'member') as 'owner' | 'admin' | 'member' | 'viewer',
            // Let database handle joinedAt with defaultNow()
          })
          .onConflictDoUpdate({
            target: [organizationMembers.organizationId, organizationMembers.userId],
            set: {
              role: (role ?? 'member') as 'owner' | 'admin' | 'member' | 'viewer'
            }
          })
        
        console.log(`✅ Organization membership synced for user ${userId} in org ${organization.id}`)
      } catch (error) {
        console.error('Error syncing membership:', error)
        return new Response('Database error', { status: 500 })
      }
    }
    
    // Handle organization membership deletion
    if (eventType === 'organizationMembership.deleted') {
      const membershipEvent = evt as OrganizationMembershipWebhookEvent
      const { organization, public_user_data } = membershipEvent.data
      
      const db = getDb()
      
      try {
        await db
          .delete(organizationMembers)
          .where(
            and(
              eq(organizationMembers.organizationId, organization.id),
              eq(organizationMembers.userId, public_user_data.user_id)
            )
          )
        
        console.log(`✅ Organization membership removed for user ${public_user_data.user_id} from org ${organization.id}`)
      } catch (error) {
        console.error('Error removing membership:', error)
        return new Response('Database error', { status: 500 })
      }
    }
    
    return new Response('Webhook received', { status: 200 })
  }
  
  // Production webhook verification
  const wh = new Webhook(webhookSecret)
  let evt: TypedWebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as TypedWebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400
    })
  }

  // Handle the webhook
  const eventType = evt.type
  
  if (eventType === 'user.created' || eventType === 'user.updated') {
    const userEvent = evt as UserWebhookEvent
    const { id, email_addresses, first_name, last_name } = userEvent.data
    
    const email = email_addresses[0]?.email_address
    const _fullName = [first_name, last_name].filter(Boolean).join(' ')
    
    if (email) {
      // TODO: Sync user to database using Drizzle instead of RPC
      console.log(`User ${id} would be synced to database`)
    }
  }
  
  // Handle organization events
  if (eventType === 'organization.created' || eventType === 'organization.updated') {
    const orgEvent = evt as OrganizationWebhookEvent
    const { id, name, slug, created_at } = orgEvent.data
    
    const db = getDb()
    
    try {
      await db
        .insert(organizations)
        .values({
          id,  // Use Clerk org ID directly
          name,
          slug: slug ?? name.toLowerCase().replace(/\s+/g, '-'),
          createdAt: created_at ? new Date(created_at) : undefined,
          updatedAt: new Date()
        })
        .onConflictDoUpdate({
          target: organizations.id,
          set: {
            name,
            slug: slug ?? name.toLowerCase().replace(/\s+/g, '-'),
            // Let database handle updatedAt
          }
        })
      
      console.log(`✅ Organization ${id} synced to database`)
    } catch (error) {
      console.error('Error syncing organization:', error)
      return new Response('Database error', { status: 500 })
    }
  }
  
  // Handle organization membership
  if (eventType === 'organizationMembership.created' || eventType === 'organizationMembership.updated') {
    const membershipEvent = evt as OrganizationMembershipWebhookEvent
    const { organization, public_user_data, role } = membershipEvent.data
    
    const db = getDb()
    
    try {
      // Ensure user profile exists first
      const userId = public_user_data.user_id
      const userEmail = public_user_data.email ?? `${userId}@placeholder.local`
      
      await db
        .insert(profiles)
        .values({
          id: userId,
          email: userEmail,
          fullName: public_user_data.first_name && public_user_data.last_name 
            ? `${public_user_data.first_name} ${public_user_data.last_name}`
            : null,
          updatedAt: new Date()
        })
        .onConflictDoNothing()
      
      // Now insert or update membership
      await db
        .insert(organizationMembers)
        .values({
          organizationId: organization.id,
          userId: userId,
          role: (role ?? 'member') as 'owner' | 'admin' | 'member' | 'viewer',
          joinedAt: new Date()
        })
        .onConflictDoUpdate({
          target: [organizationMembers.organizationId, organizationMembers.userId],
          set: {
            role: (role ?? 'member') as 'owner' | 'admin' | 'member' | 'viewer'
          }
        })
      
      console.log(`✅ Organization membership synced for user ${userId} in org ${organization.id}`)
    } catch (error) {
      console.error('Error syncing membership:', error)
      return new Response('Database error', { status: 500 })
    }
  }
  
  // Handle organization membership deletion
  if (eventType === 'organizationMembership.deleted') {
    const membershipEvent = evt as OrganizationMembershipWebhookEvent
    const { organization, public_user_data } = membershipEvent.data
    
    const db = getDb()
    
    try {
      await db
        .delete(organizationMembers)
        .where(
          and(
            eq(organizationMembers.organizationId, organization.id),
            eq(organizationMembers.userId, public_user_data.user_id)
          )
        )
      
      console.log(`✅ Organization membership removed for user ${public_user_data.user_id} from org ${organization.id}`)
    } catch (error) {
      console.error('Error removing membership:', error)
      return new Response('Database error', { status: 500 })
    }
  }

  return new Response('Webhook received', { status: 200 })
}