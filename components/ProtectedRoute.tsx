'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { DashboardSkeleton } from './SkeletonLoader'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
  redirectTo?: string
}

export default function ProtectedRoute({
  children,
  requireAdmin = false,
  redirectTo = '/auth/login',
}: ProtectedRouteProps) {
  const { user, profile, loading, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(redirectTo)
        return
      }

      if (requireAdmin && !isAdmin) {
        router.push('/student')
        return
      }

      if (!requireAdmin && isAdmin && redirectTo === '/auth/login') {
        // If admin tries to access student area, redirect to admin
        router.push('/admin')
        return
      }
    }
  }, [user, loading, isAdmin, requireAdmin, router, redirectTo])

  if (loading) {
    return <DashboardSkeleton />
  }

  if (!user) {
    return null
  }

  if (requireAdmin && !isAdmin) {
    return null
  }

  return <>{children}</>
}

