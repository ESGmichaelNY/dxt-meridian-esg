'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  BarChart3, 
  Building2,
  FileText, 
  Globe,
  Home,
  LineChart,
  LogOut,
  Menu,
  Settings,
  Shield,
  Upload,
  Users,
  X,
  Bell,
  Search,
  User
} from 'lucide-react'
import { useState } from 'react'

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
}

const navigation: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: <Home className="h-5 w-5" /> },
  { title: 'Organizations', href: '/dashboard/organizations', icon: <Building2 className="h-5 w-5" /> },
  { title: 'Data Entry', href: '/dashboard/data', icon: <Upload className="h-5 w-5" /> },
  { title: 'Analytics', href: '/dashboard/analytics', icon: <LineChart className="h-5 w-5" /> },
  { title: 'Reports', href: '/dashboard/reports', icon: <FileText className="h-5 w-5" /> },
  { title: 'Compliance', href: '/dashboard/compliance', icon: <Shield className="h-5 w-5" /> },
  { title: 'Team', href: '/dashboard/team', icon: <Users className="h-5 w-5" /> },
  { title: 'Settings', href: '/dashboard/settings', icon: <Settings className="h-5 w-5" /> },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="fixed top-0 z-40 w-full bg-white border-b border-gray-200">
        <div className="flex h-16 items-center justify-between px-4 lg:px-8">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden mr-4 p-2 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Globe className="h-7 w-7 text-blue-600" />
              <span className="font-semibold text-xl text-gray-900">Meridian ESG</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 pl-10 pr-4 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg">
                <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">John Doe</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64
          bg-white border-r border-gray-200 overflow-y-auto
          transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <nav className="p-4">
            <ul className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/dashboard' && pathname.startsWith(item.href))
                
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`
                        flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                        ${isActive 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
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

            <div className="mt-8 pt-8 border-t border-gray-200">
              <button className="flex items-center space-x-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </nav>

          {/* Organization Selector */}
          <div className="p-4 border-t border-gray-200">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Current Organization</div>
              <div className="font-medium text-sm text-gray-900">Acme Corporation</div>
              <button className="text-xs text-blue-600 hover:underline mt-1">
                Switch organization
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}