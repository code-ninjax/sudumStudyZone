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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(22,163,74,0.18),_transparent_28%),linear-gradient(160deg,#f7fff8_0%,#eefcf4_42%,#ffffff_100%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.15),_transparent_32%),linear-gradient(160deg,#040d0a_0%,#050f0c_45%,#020617_100%)] px-4 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl gap-8 lg:grid-cols-[1fr,0.95fr] lg:items-center">
        <Card className="order-2 rounded-[3.5rem] border border-white/70 bg-white/88 p-7 shadow-[0_28px_90px_rgba(15,23,42,0.08)] backdrop-blur lg:order-1 lg:p-12 dark:border-white/5 dark:bg-[#060f0c]/90">
          <div className="mb-8">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-primary-light">Student Login</p>
            <h1 className="mt-3 text-3xl font-black uppercase tracking-tight text-text-light dark:text-text-dark md:text-4xl">
              Welcome Back
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-7 text-gray-600 dark:text-gray-300">
              Sign in to continue with your dashboard, filtered resources, submissions, and student profile.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.24em] text-gray-500">
                Email Address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-12 py-4 text-sm font-bold text-text-light outline-none transition focus:border-primary-light focus:ring-4 focus:ring-primary-light/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-text-dark"
                  placeholder="student@example.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className="block text-[11px] font-black uppercase tracking-[0.24em] text-gray-500">
                  Password
                </label>
                <Link href="/auth/forgot-password" className="text-[11px] font-black uppercase tracking-[0.18em] text-primary-light hover:underline">
                  Forgot Password
                </Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-12 py-4 text-sm font-bold text-text-light outline-none transition focus:border-primary-light focus:ring-4 focus:ring-primary-light/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-text-dark"
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-gray-100 bg-gray-50 px-5 py-4 text-sm leading-7 text-gray-600 dark:border-white/5 dark:bg-white/[0.03] dark:text-gray-400">
              Your student profile stays linked to the academic identity collected during signup, including faculty, department, and level.
            </div>

            <Button type="submit" variant="primary" className="w-full rounded-2xl py-4 text-[11px] font-black uppercase tracking-[0.24em]" loading={loading}>
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
            New here?{' '}
            <Link href="/auth/signup" className="font-black text-primary-light hover:underline">
              Create Account
            </Link>
          </p>
        </Card>

        <section className="order-1 relative overflow-hidden rounded-[3.5rem] bg-[#050f0c] p-8 text-white shadow-[0_28px_80px_rgba(2,6,23,0.35)] lg:order-2 lg:p-12 border border-white/5">
          <div className="absolute -top-20 right-0 h-64 w-64 rounded-full bg-green-400/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-sky-400/10 blur-3xl" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-green-300">
              <BookOpenCheck className="h-4 w-4" />
              Dashboard Access
            </div>

            <h2 className="mt-6 max-w-md text-4xl font-black uppercase leading-none tracking-tight md:text-5xl">
              Sign in to continue the semester workflow.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/75">
              Assignments, results, past questions, and marking schemes now sit inside one student dashboard flow.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <FeatureCard
                icon={TrendingUp}
                label="Progress"
                copy="Track work, submissions, and academic activity."
              />
              <FeatureCard
                icon={Sparkles}
                label="Resources"
                copy="Reach past questions and marking schemes faster."
              />
              <FeatureCard
                icon={ShieldCheck}
                label="Identity"
                copy="Use the same verified student profile everywhere."
              />
            </div>

            <Link
              href="/auth/signup"
              className="mt-10 inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-[11px] font-black uppercase tracking-[0.24em] text-white transition hover:bg-white/10"
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
    <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-green-300">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.24em] text-white/45">{label}</p>
      <p className="mt-2 text-sm font-bold leading-6 text-white/85">{copy}</p>
    </div>
  )
}
