'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Mail, Shield } from 'lucide-react'
import Button from '@/components/Button'
import { useAuth } from '@/lib/auth-context'

export default function AdminLoginPage() {
  const router = useRouter()
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { signIn, user, isAdmin } = useAuth()

  useEffect(() => {
    // Redirect if already logged in as admin
    if (user && isAdmin) {
      router.push('/admin')
    } else if (user && !isAdmin) {
      router.push('/student')
    }
  }, [user, isAdmin, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error } = await signIn(credentials.email, credentials.password)
      
      if (error) {
        setError(error.message || 'Failed to sign in. Please check your credentials.')
        return
      }

      // Check if user is admin after sign in
      // The useEffect will handle redirect
      setTimeout(() => {
        if (!isAdmin) {
          setError('Access denied. Admin privileges required.')
        }
      }, 1000)
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-accent-light to-primary-light dark:from-primary-dark dark:via-accent-dark dark:to-primary-dark flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo & Title */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white dark:bg-subtle-dark rounded-full mb-4 shadow-xl">
            <Shield className="w-10 h-10 text-primary-light dark:text-primary-dark" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Sudum Study</h1>
          <p className="text-white/90">Admin Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-subtle-dark rounded-2xl shadow-2xl p-8 animate-slide-up">
          <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-6">
            Admin Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  className="input-field pl-10"
                  placeholder="admin@example.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="input-field pl-10"
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In to Admin Panel'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Protected area for administrators only
            </p>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-xs text-blue-800 dark:text-blue-200">
                <strong>Demo Admin:</strong> admin@studyzone.com / admin123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
