'use client'

import type { FormEvent } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Mail,
  CheckCircle,
} from 'lucide-react'
import Button from '@/components/Button'
import Card from '@/components/Card'
import { useAuth } from '@/lib/auth-context'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { resetPassword } = useAuth()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)

    try {
      const { error } = await resetPassword(email.trim())

      if (error) {
        setError(error.message || 'Failed to send reset email. Please try again.')
        return
      }

      setSuccess(true)
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
              Forgot Password?
            </h1>
            <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-400">
              Enter your email address and we'll send you a link to reset your password.
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
                Check your email
              </h3>
              <p className="mt-2 text-sm text-green-700 dark:text-green-300">
                We've sent a password reset link to <span className="font-semibold">{email}</span>. 
                Please check your inbox and follow the instructions.
              </p>
              <p className="mt-4 text-xs text-green-600/70 dark:text-green-400/70">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <Button
                onClick={() => setSuccess(false)}
                variant="outline"
                className="mt-6 rounded-2xl py-3 text-[11px] font-black uppercase tracking-[0.24em]"
              >
                Send Again
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-12 py-3.5 sm:py-4 text-sm font-bold text-gray-900 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-green-400 dark:focus:ring-green-400/10"
                    placeholder="student@example.com"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-7 text-gray-600 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400">
                Make sure to check your spam folder if you don't see the email within a few minutes.
              </div>

              <Button type="submit" variant="primary" className="w-full rounded-2xl py-3.5 sm:py-4 text-[11px] font-black uppercase tracking-[0.24em]" loading={loading}>
                Send Reset Link
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
