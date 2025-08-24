export interface User {
  id: string
  email: string
  fullName: string | null
  avatarUrl: string | null
  role: 'owner' | 'admin' | 'member' | 'viewer'
  department: string | null
  isVerified: boolean
  createdAt: string
  updatedAt: string
}