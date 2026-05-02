'use client'

import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  BookOpenCheck,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import Button from '@/components/Button'
import Card from '@/components/Card'
import { useAuth } from '@/lib/auth-context'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { signIn, user, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push(isAdmin ? '/admin' : '/student')
    }
  }, [isAdmin, router, user])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error } = await signIn(email.trim(), password)

      if (error) {
        setError(error.message || 'Failed to sign in. Please check your credentials.')
        return
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4 py-6 sm:py-10">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl gap-6 lg:gap-8 lg:grid-cols-[1fr,0.95fr] lg:items-center">
        <Card className="order-2 rounded-[2rem] sm:rounded-[3.5rem] border border-gray-200/70 bg-white/95 p-5 sm:p-7 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur lg:order-1 lg:p-12 dark:border-gray-800 dark:bg-gray-900/95 dark:shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
          <div className="mb-6 sm:mb-8">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-green-600 dark:text-green-400">Student Login</p>
            <h1 className="mt-3 text-2xl sm:text-3xl font-black uppercase tracking-tight text-gray-900 dark:text-white md:text-4xl">
              Welcome Back
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-7 text-gray-600 dark:text-gray-400">
              Sign in to continue with your dashboard, filtered resources, submissions, and student profile.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
              {error}
            </div>
          )}

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

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className="block text-[11px] font-black uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
                  Password
                </label>
                <Link href="/auth/forgot-password" className="text-[11px] font-black uppercase tracking-[0.18em] text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
                  Forgot Password
                </Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-12 py-3.5 sm:py-4 text-sm font-bold text-gray-900 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-green-400 dark:focus:ring-green-400/10"
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-7 text-gray-600 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400">
              Your student profile stays linked to the academic identity collected during signup, including faculty, department, and level.
            </div>

            <Button type="submit" variant="primary" className="w-full rounded-2xl py-3.5 sm:py-4 text-[11px] font-black uppercase tracking-[0.24em]" loading={loading}>
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            New here?{' '}
            <Link href="/auth/signup" className="font-black text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
              Create Account
            </Link>
          </p>
        </Card>

        <section className="order-1 hidden relative overflow-hidden rounded-[2rem] lg:rounded-[3.5rem] bg-gradient-to-br from-gray-900 to-gray-950 p-6 sm:p-8 text-white shadow-[0_20px_60px_rgba(0,0,0,0.3)] lg:block lg:order-2 lg:p-12 border border-gray-800">
          <div className="absolute -top-20 right-0 h-64 w-64 rounded-full bg-green-500/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-green-400">
              <BookOpenCheck className="h-4 w-4" />
              Dashboard Access
            </div>

            <h2 className="mt-6 max-w-md text-3xl sm:text-4xl font-black uppercase leading-none tracking-tight md:text-5xl">
              Your Student Dashboard
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-gray-300">
              Access assignments, results, and study materials in one place.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <FeatureCard
                icon={TrendingUp}
                label="Progress"
                copy="Track your academic journey"
              />
              <FeatureCard
                icon={Sparkles}
                label="Resources"
                copy="Past questions & materials"
              />
              <FeatureCard
                icon={ShieldCheck}
                label="Secure"
                copy="Verified student profile"
              />
            </div>

            <Link
              href="/auth/signup"
              className="mt-10 inline-flex items-center gap-2 rounded-2xl border border-green-500/20 bg-green-500/10 px-6 py-4 text-[11px] font-black uppercase tracking-[0.24em] text-white transition hover:bg-green-500/20"
            >
              Create New Account
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

function FeatureCard({
  icon: Icon,
  label,
  copy,
}: {
  icon: typeof TrendingUp
  label: string
  copy: string
}) {
  return (
    <div className="rounded-[1.75rem] border border-gray-700/50 bg-gray-800/50 p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-500/20 text-green-400">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.24em] text-gray-400">{label}</p>
      <p className="mt-2 text-sm font-bold leading-6 text-gray-200">{copy}</p>
    </div>
  )
}
