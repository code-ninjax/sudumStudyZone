'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, User, ArrowRight, CheckCircle2, MailOpen } from 'lucide-react'
import Input from '@/components/Input'
import Button from '@/components/Button'
import Card from '@/components/Card'
import { useAuth } from '@/lib/auth-context'

export const dynamic = 'force-dynamic'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { signUp, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      router.push('/student')
    }
  }, [user, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const { error } = await signUp(
        formData.email,
        formData.password,
        formData.fullName
      )

      if (error) {
        setError(error.message || 'Failed to create account. Please try again.')
        return
      }

      setSuccess(true)
      // Don't redirect - show email verification screen instead
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Show email verification screen if signup was successful
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white dark:from-background-dark dark:via-emerald-950/20 dark:to-background-dark flex items-center justify-center py-12 px-4">
        <div className="max-w-2xl w-full">
          <Card className="text-center animate-fade-in">
            <div className="py-12 px-6">
              {/* Animated Checkmark */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 rounded-full flex items-center justify-center animate-scale-in shadow-lg">
                    <CheckCircle2 className="w-14 h-14 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="absolute inset-0 w-24 h-24 bg-green-500/30 dark:bg-green-600/30 rounded-full animate-ping" />
                </div>
              </div>

              {/* Success Message */}
              <h1 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-3">
                Check Your Email!
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                We've sent a verification link to{' '}
                <span className="font-semibold text-primary-light dark:text-primary-dark break-all">
                  {formData.email}
                </span>
              </p>

              {/* Email Icon Card */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-8 mb-8 max-w-lg mx-auto">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md">
                    <MailOpen className="w-8 h-8 text-primary-light dark:text-primary-dark" />
                  </div>
                </div>
                <h3 className="font-bold text-lg text-text-light dark:text-text-dark mb-3">
                  Next Steps
                </h3>
                <ol className="text-left text-sm text-gray-700 dark:text-gray-300 space-y-2">
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-light dark:bg-primary-dark text-white text-xs font-bold mr-3 flex-shrink-0 mt-0.5">
                      1
                    </span>
                    <span>Open your email inbox and find our verification email</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-light dark:bg-primary-dark text-white text-xs font-bold mr-3 flex-shrink-0 mt-0.5">
                      2
                    </span>
                    <span>Click the verification link in the email</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-light dark:bg-primary-dark text-white text-xs font-bold mr-3 flex-shrink-0 mt-0.5">
                      3
                    </span>
                    <span>Return here and sign in to access your dashboard</span>
                  </li>
                </ol>
              </div>

              {/* Additional Info */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Didn't receive the email? Check your spam folder or{' '}
                  <button className="text-primary-light dark:text-primary-dark font-semibold hover:underline">
                    resend verification email
                  </button>
                </p>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-light dark:bg-primary-dark text-white rounded-lg font-medium hover:opacity-90 transition-opacity duration-200"
                >
                  Go to Login
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // Show signup form by default
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white dark:from-background-dark dark:via-emerald-950/20 dark:to-background-dark py-12 px-4">
      <div className="container-custom">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-2">
              Create Account
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Join our academic community today
            </p>
          </div>

          <Card className="animate-slide-up">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-6">
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="John Doe"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="your.email@example.com"
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
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="Create a strong password (min. 6 characters)"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="Confirm your password"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  className="w-4 h-4 mt-1 text-primary-light dark:text-primary-dark border-gray-300 rounded focus:ring-primary-light dark:focus:ring-primary-dark"
                  required
                />
                <label className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  I agree to the{' '}
                  <Link href="/terms" className="text-primary-light dark:text-primary-dark hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-primary-light dark:text-primary-dark hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link
                  href="/auth/login"
                  className="text-primary-light dark:text-primary-dark font-semibold hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
