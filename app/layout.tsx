import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
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
    <html lang="en">
      <body>
        <Header />
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  )
}