'use client'

import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Lock,
  CheckCircle,
  Eye,
  EyeOff,
} from 'lucide-react'
import Button from '@/components/Button'
import Card from '@/components/Card'
import { supabase } from '@/packages/supabase/src/client'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if we have an access token in the URL (Supabase adds this)
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const accessToken = hashParams.get('access_token')
    const refreshToken = hashParams.get('refresh_token')
    
    if (accessToken && refreshToken) {
      // Set the session manually using the tokens from the URL
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      }).catch((err) => {
        console.error('Error setting session:', err)
        setError('Invalid or expired reset link. Please request a new password reset.')
      })
    } else {
      setError('Invalid or expired reset link. Please request a new password reset.')
    }
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) {
        setError(error.message || 'Failed to reset password. Please try again.')
        return
      }

      setSuccess(true)
      
      // Sign out the user after successful password reset
      await supabase.auth.signOut()
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/auth/login')
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4 py-6 sm:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-lg items-center">
        <Card className="w-full rounded-[2rem] sm:rounded-[3.5rem] border border-gray-200/70 bg-white/95 p-5 sm:p-7 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur lg:p-12 dark:border-gray-800 dark:bg-gray-900/95 dark:shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
          <div className="mb-6 sm:mb-8">
            <Link 
              href="/auth/login" 
              className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-green-700 dark:text-gray-400 dark:hover:text-green-300 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
            <p className="mt-4 text-[10px] font-black uppercase tracking-[0.28em] text-green-600 dark:text-green-400">Password Reset</p>
            <h1 className="mt-3 text-2xl sm:text-3xl font-black uppercase tracking-tight text-gray-900 dark:text-white md:text-4xl">
              Set New Password
            </h1>
            <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-400">
              Enter your new password below to complete the reset process.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
              {error}
            </div>
          )}

          {success ? (
            <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-6 text-center dark:border-green-900/50 dark:bg-green-950/30">
              <CheckCircle className="mx-auto h-12 w-12 text-green-600 dark:text-green-400" />
              <h3 className="mt-4 text-lg font-bold text-green-900 dark:text-green-100">
                Password Reset Successful
              </h3>
              <p className="mt-2 text-sm text-green-700 dark:text-green-300">
                Your password has been successfully updated. You will be redirected to the login page shortly.
              </p>
              <Link
                href="/auth/login"
                className="mt-6 inline-block font-black text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
              >
                Go to Login Now
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-12 py-3.5 sm:py-4 pr-12 text-sm font-bold text-gray-900 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-green-400 dark:focus:ring-green-400/10"
                    placeholder="Enter new password"
                    required
                    disabled={loading}
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-12 py-3.5 sm:py-4 pr-12 text-sm font-bold text-gray-900 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-green-400 dark:focus:ring-green-400/10"
                    placeholder="Confirm new password"
                    required
                    disabled={loading}
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-7 text-gray-600 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400">
                Password must be at least 6 characters long. Make sure it's something secure that you'll remember.
              </div>

              <Button type="submit" variant="primary" className="w-full rounded-2xl py-3.5 sm:py-4 text-[11px] font-black uppercase tracking-[0.24em]" loading={loading}>
                Reset Password
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Remember your password?{' '}
            <Link href="/auth/login" className="font-black text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
              Sign In
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
