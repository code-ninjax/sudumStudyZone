'use client'

import { usePathname } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  // Login page should not be protected
  if (isLoginPage) {
    return <>{children}</>
  }

  // All other admin routes require authentication
  return (
    <ProtectedRoute requireAdmin redirectTo="/admin/login">
      <div className="flex h-screen bg-subtle-light dark:bg-background-dark overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 lg:ml-64 overflow-y-auto">
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
