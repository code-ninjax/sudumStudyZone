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
  const { signIn, user, isAdmin, loading: authLoading } = useAuth()

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) {
      return
    }

    // Redirect if already logged in as admin
    if (user && isAdmin) {
      router.push('/admin')
      return
    }

    // If logged in but not admin, redirect to student
    if (user && !isAdmin) {
      // Double check after a brief delay to ensure isAdmin is properly set
      const timer = setTimeout(() => {
        if (user && !isAdmin) {
          router.push('/student')
        }
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [user, isAdmin, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error } = await signIn(credentials.email, credentials.password)
      
      if (error) {
        setError(error.message || 'Failed to sign in. Please check your credentials.')
        setLoading(false)
        return
      }

      // Wait a moment for auth state to update
      // The useEffect will handle redirect once isAdmin is set
      setTimeout(() => {
        setLoading(false)
        // If still not admin after sign in, show error
        if (!isAdmin) {
          // Check again after state updates
          setTimeout(() => {
            if (!isAdmin) {
              setError('Access denied. Admin privileges required.')
            }
          }, 500)
        }
      }, 200)
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-subtle-light dark:bg-background-dark flex items-center justify-center p-4">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-light/5 dark:bg-primary-dark/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-light/5 dark:bg-accent-dark/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-md w-full relative z-10 transition-all duration-500">
        {/* Logo & Title */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white dark:bg-subtle-dark rounded-2xl mb-6 shadow-xl border border-gray-100 dark:border-white/5 group hover:scale-105 transition-transform duration-300">
            <Shield className="w-10 h-10 text-primary-light dark:text-primary-dark group-hover:rotate-12 transition-transform" />
          </div>
          <h1 className="text-4xl font-black text-text-light dark:text-text-dark mb-2 tracking-tight">
            SUDUM<span className="text-primary-light dark:text-primary-dark">STUDY</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium tracking-wide uppercase text-xs">Administrative Portal</p>
        </div>

        {/* Login Card */}
        <div className="glass-card rounded-[2rem] p-10 animate-slide-up relative overflow-hidden">
          {/* Subtle top indicator */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-light/50 to-transparent dark:via-primary-dark/50" />

          <div className="mb-8">
            <h2 className="text-2xl font-black text-text-light dark:text-text-dark mb-1">
              Welcome Back
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Please enter your administrative credentials</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-2xl animate-shake">
                <p className="text-sm text-red-600 dark:text-red-400 font-medium flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  {error}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">
                Admin Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-light dark:group-focus-within:text-primary-dark transition-colors" />
                <input
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-light/20 dark:focus:ring-primary-dark/20 focus:bg-white dark:focus:bg-subtle-dark transition-all duration-300"
                  placeholder="admin@sudumstudy.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  Password
                </label>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-light dark:group-focus-within:text-primary-dark transition-colors" />
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-light/20 dark:focus:ring-primary-dark/20 focus:bg-white dark:focus:bg-subtle-dark transition-all duration-300"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-primary-light dark:bg-primary-dark text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary-light/25 dark:shadow-primary-dark/10 hover:shadow-primary-light/40 dark:hover:shadow-primary-dark/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Access Portal</span>
                  <Lock className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/5 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium tracking-tight">
              Strictly for Authorized Personnel. All sessions are logged.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
