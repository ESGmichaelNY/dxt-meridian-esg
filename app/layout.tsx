import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import Header from '@/components/layout/Header'
import UserSync from '@/components/auth/UserSync'
import './globals.css'

export const metadata: Metadata = {
  title: 'Meridian ESG',
  description: 'ESG/Sustainability Data Management Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <UserSync />
          <Header />
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}