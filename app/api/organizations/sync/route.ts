import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db/server'
import { organizations } from '@/lib/db/schema'

export async function POST(req: Request) {
  const { userId, orgId } = await auth()
  
  if (!userId || !orgId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const body = await req.json()
  const { id, name, slug } = body
  
  try {
    const db = getDb()
    
    await db
      .insert(organizations)
      .values({
        id,
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        // Don't set updatedAt - let database handle it with defaultNow()
      })
      .onConflictDoUpdate({
        target: organizations.id,
        set: {
          name,
          slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
          // Don't set updatedAt - let database handle it
        }
      })
    
    console.log(`✅ Organization ${id} synced via API`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error syncing organization:', error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}