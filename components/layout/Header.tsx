'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex items-center gap-x-12">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            Meridian ESG
          </Link>
          {user && (
            <div className="hidden md:flex md:gap-x-8">
              <Link href="/dashboard" className="text-sm font-medium text-gray-700 hover:text-primary-600">
                Dashboard
              </Link>
              <Link href="/organizations" className="text-sm font-medium text-gray-700 hover:text-primary-600">
                Organizations
              </Link>
              <Link href="/reports" className="text-sm font-medium text-gray-700 hover:text-primary-600">
                Reports
              </Link>
              <Link href="/settings" className="text-sm font-medium text-gray-700 hover:text-primary-600">
                Settings
              </Link>
            </div>
          )}
        </div>
        <div className="flex items-center gap-x-4">
          {user ? (
            <>
              <span className="text-sm text-gray-600">{user.email}</span>
              <button
                onClick={handleSignOut}
                className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm font-medium text-gray-700 hover:text-primary-600"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}