import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db/server'
import { profiles, organizationMembers } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function POST() {
  try {
    // Get the current user and auth context from Clerk
    const [user, authContext] = await Promise.all([
      currentUser(),
      auth()
    ])
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    const email = user.emailAddresses[0]?.emailAddress
    const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ')
    
    if (!email) {
      return NextResponse.json({ error: 'No email found' }, { status: 400 })
    }
    
    // Get Drizzle database instance
    const db = getDb()
    
    // Upsert user profile using Drizzle
    await db
      .insert(profiles)
      .values({
        id: user.id,
        email,
        fullName: fullName ?? null,
        // Don't set dates - let database handle them with defaultNow()
      })
      .onConflictDoUpdate({
        target: profiles.id,
        set: {
          email,
          fullName: fullName ?? null,
          // Don't set updatedAt - let database handle it
        }
      })
    
    // If user has an active organization, sync organization membership
    if (authContext.orgId && authContext.orgRole) {
      // Check if membership already exists
      const existingMembership = await db
        .select()
        .from(organizationMembers)
        .where(
          and(
            eq(organizationMembers.userId, user.id),
            eq(organizationMembers.organizationId, authContext.orgId)
          )
        )
        .limit(1)
      
      if (existingMembership.length === 0) {
        // Create new membership
        await db
          .insert(organizationMembers)
          .values({
            userId: user.id,
            organizationId: authContext.orgId,
            role: (authContext.orgRole?.replace('org:', '') ?? 'member') as 'owner' | 'admin' | 'member' | 'viewer',
          })
      } else if (existingMembership[0].role !== authContext.orgRole?.replace('org:', '')) {
        // Update role if changed
        await db
          .update(organizationMembers)
          .set({ role: (authContext.orgRole?.replace('org:', '') ?? 'member') as 'owner' | 'admin' | 'member' | 'viewer' })
          .where(
            and(
              eq(organizationMembers.userId, user.id),
              eq(organizationMembers.organizationId, authContext.orgId)
            )
          )
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        email,
        fullName,
        orgId: authContext.orgId,
        orgRole: authContext.orgRole
      }
    })
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}