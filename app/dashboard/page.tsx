'use client'

import { 
  ArrowDown, 
  ArrowUp, 
  BarChart3, 
  Calendar,
  Download,
  FileText, 
  Leaf,
  TrendingUp,
  Upload,
  Users
} from 'lucide-react'
import Link from 'next/link'
import { useOrganization, useUser } from '@clerk/nextjs'

const stats = [
  { 
    title: 'Total Emissions', 
    value: '2,847', 
    unit: 'tCO2e',
    change: -12.5,
    icon: <Leaf className="h-5 w-5" />
  },
  { 
    title: 'Energy Consumption', 
    value: '1,234', 
    unit: 'MWh',
    change: -8.2,
    icon: <TrendingUp className="h-5 w-5" />
  },
  { 
    title: 'Water Usage', 
    value: '456', 
    unit: 'm³',
    change: 5.4,
    icon: <BarChart3 className="h-5 w-5" />
  },
  { 
    title: 'Reports Generated', 
    value: '23', 
    unit: 'this month',
    change: 15.3,
    icon: <FileText className="h-5 w-5" />
  },
]

const recentActivities = [
  { id: 1, action: 'Data entry completed', detail: 'Q3 2024 emissions data', time: '2 hours ago', user: 'Sarah Chen' },
  { id: 2, action: 'Report generated', detail: 'Annual sustainability report', time: '5 hours ago', user: 'Mike Johnson' },
  { id: 3, action: 'Target updated', detail: 'Net zero by 2030 goal', time: '1 day ago', user: 'Emma Wilson' },
  { id: 4, action: 'Data verified', detail: 'Scope 2 emissions Q2 2024', time: '2 days ago', user: 'Alex Brown' },
]

const upcomingDeadlines = [
  { id: 1, title: 'CDP Climate Disclosure', date: 'Jul 31, 2025', daysLeft: 7, status: 'urgent' },
  { id: 2, title: 'GRI Report Submission', date: 'Aug 15, 2025', daysLeft: 22, status: 'upcoming' },
  { id: 3, title: 'TCFD Quarterly Update', date: 'Sep 30, 2025', daysLeft: 68, status: 'normal' },
]

export default function DashboardPage() {
  const { organization, isLoaded: orgLoaded } = useOrganization()
  const { user, isLoaded: userLoaded } = useUser()

  if (!orgLoaded || !userLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-64"></div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user?.firstName ?? 'there'}! 
          {organization && ` Here's the ESG performance overview for ${organization.name}.`}
          {!organization && ' Please select an organization to view ESG data.'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-gray-50 rounded-lg">
                {stat.icon}
              </div>
              <div className={`flex items-center text-sm font-medium ${
                stat.change < 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change < 0 ? <ArrowDown className="h-4 w-4 mr-1" /> : <ArrowUp className="h-4 w-4 mr-1" />}
                {Math.abs(stat.change)}%
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.unit}</div>
            </div>
            <div className="text-xs text-gray-500 mt-2">{stat.title}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.detail} • by {activity.user}
                      </p>
                    </div>
                    <div className="text-xs text-gray-400">
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
              <Link 
                href="/dashboard/activity"
                className="mt-6 inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View all activity →
              </Link>
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div>
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {upcomingDeadlines.map((deadline) => (
                  <div key={deadline.id} className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {deadline.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {deadline.date}
                      </p>
                      <span className={`
                        inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full
                        ${deadline.status === 'urgent' ? 'bg-red-100 text-red-700' : 
                          deadline.status === 'upcoming' ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-gray-100 text-gray-700'}
                      `}>
                        {deadline.daysLeft} days left
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Link 
                href="/dashboard/compliance"
                className="mt-6 inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View all deadlines →
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm mt-6">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-3">
              <Link 
                href="/dashboard/data"
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Upload className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Enter Data</span>
                </div>
                <ArrowUp className="h-4 w-4 text-gray-400 rotate-45" />
              </Link>
              
              <Link 
                href="/dashboard/reports/new"
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Generate Report</span>
                </div>
                <ArrowUp className="h-4 w-4 text-gray-400 rotate-45" />
              </Link>
              
              <Link 
                href="/dashboard/analytics"
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">View Analytics</span>
                </div>
                <ArrowUp className="h-4 w-4 text-gray-400 rotate-45" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Emissions Trend</h2>
          <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-400">
            <BarChart3 className="h-12 w-12 mx-auto mb-3" />
            <p className="text-sm">Chart will be rendered here</p>
          </div>
        </div>
      </div>
    </div>
  )
}