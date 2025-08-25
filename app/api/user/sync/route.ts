import { auth, currentUser } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/service'
import { NextResponse } from 'next/server'

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
    
    // Sync with Supabase
    const supabase = createClient()
    
    // Sync user profile
    const { error: profileError } = await supabase.rpc('ensure_profile_exists', {
      p_user_id: user.id,
      p_email: email,
      p_full_name: fullName || null
    })
    
    if (profileError) {
      console.error('Error syncing user profile:', profileError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
    
    // If user has an active organization, sync organization membership
    if (authContext.orgId && authContext.orgRole) {
      const { error: orgError } = await supabase
        .from('organization_members')
        .upsert({
          user_id: user.id,
          organization_id: authContext.orgId,
          role: authContext.orgRole,
        }, {
          onConflict: 'user_id,organization_id'
        })
      
      if (orgError && orgError.code !== '23505') { // Ignore duplicate key errors
        console.error('Error syncing organization membership:', orgError)
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