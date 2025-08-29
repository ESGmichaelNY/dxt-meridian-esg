'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  BookOpen, 
  Code2, 
  FileText, 
  Home,
  KeyRound,
  Layers,
  LineChart,
  MessageSquare,
  Settings,
  Shield,
  Zap,
  ChevronRight as _ChevronRight,
  Search,
  Sun,
  Moon,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

interface NavItem {
  title: string
  href?: string
  icon?: React.ReactNode
  items?: NavItem[]
}

const navigation: NavItem[] = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', href: '/docs', icon: <Home className="h-4 w-4" /> },
      { title: 'Quickstart', href: '/docs/quickstart', icon: <Zap className="h-4 w-4" /> },
      { title: 'Installation', href: '/docs/installation', icon: <Settings className="h-4 w-4" /> },
    ]
  },
  {
    title: 'Core Concepts',
    items: [
      { title: 'Authentication', href: '/docs/authentication', icon: <KeyRound className="h-4 w-4" /> },
      { title: 'Organizations', href: '/docs/organizations', icon: <Layers className="h-4 w-4" /> },
      { title: 'Data Management', href: '/docs/data-management', icon: <LineChart className="h-4 w-4" /> },
      { title: 'Reporting', href: '/docs/reporting', icon: <FileText className="h-4 w-4" /> },
      { title: 'Security', href: '/docs/security', icon: <Shield className="h-4 w-4" /> },
    ]
  },
  {
    title: 'API Reference',
    items: [
      { title: 'Overview', href: '/docs/api', icon: <Code2 className="h-4 w-4" /> },
      { title: 'Authentication', href: '/docs/api/auth', icon: <KeyRound className="h-4 w-4" /> },
      { title: 'Organizations', href: '/docs/api/organizations', icon: <Layers className="h-4 w-4" /> },
      { title: 'Data Endpoints', href: '/docs/api/data', icon: <LineChart className="h-4 w-4" /> },
      { title: 'Reports', href: '/docs/api/reports', icon: <FileText className="h-4 w-4" /> },
      { title: 'Webhooks', href: '/docs/api/webhooks', icon: <MessageSquare className="h-4 w-4" /> },
    ]
  },
  {
    title: 'Guides',
    items: [
      { title: 'Best Practices', href: '/docs/guides/best-practices', icon: <BookOpen className="h-4 w-4" /> },
      { title: 'Framework Compliance', href: '/docs/guides/compliance', icon: <Shield className="h-4 w-4" /> },
      { title: 'Data Import', href: '/docs/guides/import', icon: <LineChart className="h-4 w-4" /> },
      { title: 'Custom Reports', href: '/docs/guides/reports', icon: <FileText className="h-4 w-4" /> },
    ]
  }
]

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
      {/* Top Navigation */}
      <header className="fixed top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
        <div className="flex h-16 items-center px-4 lg:px-8">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          
          <Link href="/" className="flex items-center space-x-2 mr-8">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <span className="font-semibold text-gray-900 dark:text-white">Meridian Docs</span>
          </Link>
          
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Find something..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                ⌘K
              </kbd>
            </div>
          </div>
          
          <nav className="ml-auto flex items-center space-x-6">
            <Link href="/docs/api" className="hidden md:block text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              API
            </Link>
            <Link href="/docs" className="hidden md:block text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Documentation
            </Link>
            <Link href="/support" className="hidden md:block text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Support
            </Link>
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              {darkMode ? 
                <Sun className="h-4 w-4 text-gray-600 dark:text-gray-300" /> : 
                <Moon className="h-4 w-4 text-gray-600" />
              }
            </button>
            
            <Link 
              href="/auth/login"
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign in
            </Link>
          </nav>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 overflow-y-auto
          border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900
          transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <nav className="p-6">
            {navigation.map((section) => (
              <div key={section.title} className="mb-8">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {section.title}
                </h3>
                <ul className="space-y-1">
                  {section.items?.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href ?? '#'}
                          className={`
                            flex items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-colors
                            ${isActive 
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium' 
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                            }
                          `}
                        >
                          {item.icon}
                          <span>{item.title}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-4 py-8 lg:px-8 lg:py-12 max-w-5xl mx-auto w-full">
          {children}
        </main>

        {/* Table of Contents (optional right sidebar) */}
        <aside className="hidden xl:block w-64 pr-8">
          <div className="sticky top-24">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
              On this page
            </h3>
            <nav>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#overview" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                    Overview
                  </a>
                </li>
                <li>
                  <a href="#getting-started" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                    Getting Started
                  </a>
                </li>
                <li>
                  <a href="#api-reference" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#examples" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                    Examples
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </aside>
      </div>
    </div>
  )
}