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
    // Always wait for loading to complete
    if (loading) {
      return
    }

    // No user - redirect to login
    if (!user) {
      router.push(redirectTo)
      return
    }

    // Admin required routes
    if (requireAdmin) {
      // If we have a profile, check role directly
      if (profile) {
        if (profile.role !== 'admin') {
          router.push('/student')
          return
        }
        // Profile exists and role is admin - allow access
        return
      }
      
      // No profile yet - wait a bit for it to load (but don't redirect immediately)
      // This handles the case where profile is being restored from localStorage
      const timer = setTimeout(() => {
        if (!profile || profile.role !== 'admin') {
          router.push('/student')
        }
      }, 1000)
      
      return () => clearTimeout(timer)
    }

    // If admin tries to access student area, redirect to admin
    if (!requireAdmin && isAdmin && redirectTo === '/auth/login') {
      router.push('/admin')
      return
    }
  }, [user, profile, loading, isAdmin, requireAdmin, router, redirectTo])

  // Show loading skeleton while checking auth
  if (loading) {
    return <DashboardSkeleton />
  }

  // No user - return null (redirect will happen in useEffect)
  if (!user) {
    return null
  }

  // Admin required but not admin - return null (redirect will happen in useEffect)
  if (requireAdmin) {
    // Still waiting for profile to load - show skeleton
    if (!profile) {
      return <DashboardSkeleton />
    }
    // Profile exists but not admin - return null (redirect will happen)
    if (profile.role !== 'admin') {
      return null
    }
  }

  return <>{children}</>
}

