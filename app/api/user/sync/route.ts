import { auth, currentUser } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/service'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Get the current user from Clerk
    const user = await currentUser()
    
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
    
    const { error } = await supabase.rpc('ensure_profile_exists', {
      p_user_id: user.id,
      p_email: email,
      p_full_name: fullName || null
    })
    
    if (error) {
      console.error('Error syncing user:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        email,
        fullName
      }
    })
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}