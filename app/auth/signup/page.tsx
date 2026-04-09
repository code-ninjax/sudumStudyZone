'use client'

import type { ChangeEvent, FormEvent, InputHTMLAttributes } from 'react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  GraduationCap,
  Hash,
  Layers3,
  Lock,
  Mail,
  MailOpen,
  ShieldCheck,
  User,
} from 'lucide-react'
import Button from '@/components/Button'
import Card from '@/components/Card'
import { useAuth } from '@/lib/auth-context'

export const dynamic = 'force-dynamic'

const levels = ['100L', '200L', '300L', '400L', '500L']

export default function SignupPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    faculty: '',
    department: '',
    level: '100L',
    matricNumber: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { signUp, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/student')
    }
  }, [router, user])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }))
    setError(null)
  }

  const validateAccountStep = () => {
    if (!formData.fullName.trim() || !formData.email.trim()) {
      setError('Full name and email are required.')
      return false
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return false
    }

    return true
  }

  const validateAcademicStep = () => {
    if (!formData.faculty.trim() || !formData.department.trim() || !formData.level || !formData.matricNumber.trim()) {
      setError('Faculty, department, level, and matric number are required.')
      return false
    }

    return true
  }

  const goToAcademicStep = () => {
    setError(null)
    if (!validateAccountStep()) {
      return
    }
    setStep(2)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateAccountStep() || !validateAcademicStep()) {
      return
    }

    setLoading(true)

    try {
      const { error } = await signUp({
        email: formData.email.trim(),
        password: formData.password,
        fullName: formData.fullName.trim(),
        faculty: formData.faculty.trim(),
        department: formData.department.trim(),
        level: formData.level,
        matricNumber: formData.matricNumber.trim(),
        redirectTo: `${window.location.origin}/auth/verify`,
      })

      if (error) {
        setError(error.message || 'Failed to create account. Please try again.')
        return
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(22,163,74,0.18),_transparent_32%),linear-gradient(160deg,#f8fff8_0%,#eefcf2_45%,#ffffff_100%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.15),_transparent_32%),linear-gradient(160deg,#040d0a_0%,#050f0c_45%,#020617_100%)] px-4 py-12">
        <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-5xl items-center">
          <Card className="w-full rounded-[3.5rem] border border-white/60 bg-white/85 p-8 shadow-[0_32px_90px_rgba(22,163,74,0.12)] backdrop-blur xl:p-12 dark:border-white/5 dark:bg-[#060f0c]/90">
            <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-green-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Account Created
                </div>
                <h1 className="max-w-xl text-4xl font-black uppercase tracking-tight text-text-light dark:text-text-dark md:text-5xl">
                  Verify your email to finish the signup flow.
                </h1>
                <p className="mt-5 max-w-xl text-base font-medium leading-7 text-gray-600 dark:text-gray-300">
                  We sent a verification link to <span className="font-black text-primary-light">{formData.email}</span>.
                  Your academic criteria were included in the signup request.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[1.75rem] border border-gray-100 bg-gray-50 p-5 dark:border-white/5 dark:bg-white/[0.03]">
                    <MailOpen className="mb-3 h-5 w-5 text-primary-light" />
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-400">Step 1</p>
                    <p className="mt-2 text-sm font-bold text-text-light dark:text-text-dark">Open your inbox.</p>
                  </div>
                  <div className="rounded-[1.75rem] border border-gray-100 bg-gray-50 p-5 dark:border-white/5 dark:bg-white/[0.03]">
                    <ShieldCheck className="mb-3 h-5 w-5 text-primary-light" />
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-400">Step 2</p>
                    <p className="mt-2 text-sm font-bold text-text-light dark:text-text-dark">Verify the account.</p>
                  </div>
                  <div className="rounded-[1.75rem] border border-gray-100 bg-gray-50 p-5 dark:border-white/5 dark:bg-white/[0.03]">
                    <ArrowRight className="mb-3 h-5 w-5 text-primary-light" />
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-400">Step 3</p>
                    <p className="mt-2 text-sm font-bold text-text-light dark:text-text-dark">Sign in and continue.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[2.25rem] bg-black p-8 text-white shadow-2xl">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-white/10">
                  <MailOpen className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tight">Academic Criteria Sent</h2>
                <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">Student Summary</p>
                  <p className="mt-3 text-sm font-bold">{formData.fullName}</p>
                  <p className="mt-2 text-sm text-white/70">{formData.faculty}</p>
                  <p className="mt-1 text-sm text-white/70">{formData.department}</p>
                  <p className="mt-1 text-sm text-white/70">{formData.matricNumber}</p>
                  <p className="mt-4 inline-flex rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-green-300">
                    {formData.level}
                  </p>
                </div>

                <Link
                  href="/auth/login"
                  className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-4 text-[11px] font-black uppercase tracking-[0.24em] text-black transition-transform hover:scale-[1.02]"
                >
                  Go To Login
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(22,163,74,0.2),_transparent_30%),linear-gradient(160deg,#f6fff7_0%,#eefcf2_45%,#ffffff_100%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.15),_transparent_32%),linear-gradient(160deg,#040d0a_0%,#050f0c_45%,#020617_100%)] px-4 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl gap-8 lg:grid-cols-[0.95fr,1.05fr] lg:items-center">
        <section className="relative overflow-hidden rounded-[3.5rem] bg-[#050f0c] p-8 text-white shadow-[0_28px_80px_rgba(2,6,23,0.35)] lg:p-12 border border-white/5">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-green-400/20 blur-3xl" />
          <div className="absolute -bottom-20 left-10 h-48 w-48 rounded-full bg-orange-400/10 blur-3xl" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-green-300">
              <BookOpen className="h-4 w-4" />
              Dedicated Signup Flow
            </div>
            <h1 className="mt-6 max-w-md text-4xl font-black uppercase leading-none tracking-tight md:text-5xl">
              Create the account, then capture the academic criteria before submission.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/75">
              This signup flow now gives faculty, department, and level their own dedicated step so the client requirement is visible and explicit.
            </p>

            <div className="mt-10 space-y-4">
              <StepPreview
                index="01"
                title="Account Identity"
                text="Collect full name, email, and password first."
              />
              <StepPreview
                index="02"
                title="Academic Criteria"
                text="Collect faculty, department, and level before account creation."
              />
              <StepPreview
                index="03"
                title="Supabase Signup"
                text="Send all fields together in the signup request metadata."
              />
            </div>
          </div>
        </section>

        <Card className="rounded-[3.5rem] border border-white/70 bg-white/88 p-7 shadow-[0_28px_90px_rgba(15,23,42,0.08)] backdrop-blur lg:p-12 dark:border-white/5 dark:bg-[#060f0c]/90">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-primary-light">Student Signup</p>
              <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-text-light dark:text-text-dark">
                {step === 1 ? 'Account Details' : 'Academic Criteria'}
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-7 text-gray-600 dark:text-gray-300">
                {step === 1
                  ? 'Step 1 of 2. Create the base account details first.'
                  : 'Step 2 of 2. These fields are sent to Supabase during signup.'}
              </p>
            </div>
            <div className="hidden rounded-[1.5rem] bg-primary-light/10 px-4 py-3 text-[11px] font-black uppercase tracking-[0.22em] text-primary-light sm:block">
              Step {step} / 2
            </div>
          </div>

          <div className="mb-8 grid grid-cols-2 gap-3">
            <div className={`rounded-2xl px-4 py-3 text-center text-[11px] font-black uppercase tracking-[0.2em] ${step === 1 ? 'bg-primary-light text-white' : 'bg-gray-100 text-gray-400'}`}>
              Account
            </div>
            <div className={`rounded-2xl px-4 py-3 text-center text-[11px] font-black uppercase tracking-[0.2em] ${step === 2 ? 'bg-primary-light text-white' : 'bg-gray-100 text-gray-400'}`}>
              Academic
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 1 ? (
              <>
                <div className="grid gap-5 md:grid-cols-2">
                  <AuthField
                    icon={User}
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Tokunbo Adeyemi"
                    disabled={loading}
                  />
                  <AuthField
                    icon={Mail}
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="student@example.com"
                    disabled={loading}
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <AuthField
                    icon={Lock}
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimum 6 characters"
                    disabled={loading}
                  />
                  <AuthField
                    icon={Lock}
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    disabled={loading}
                  />
                </div>

                <div className="rounded-[1.75rem] border border-gray-100 bg-gray-50 px-5 py-4 text-sm leading-7 text-gray-600 dark:border-white/5 dark:bg-white/[0.03] dark:text-gray-400">
                  Your academic data will be collected in the next step before the account is submitted.
                </div>

                <Button
                  type="button"
                  variant="primary"
                  className="w-full rounded-2xl py-4 text-[11px] font-black uppercase tracking-[0.24em]"
                  onClick={goToAcademicStep}
                >
                  Continue To Academic Criteria
                </Button>
              </>
            ) : (
              <>
                <div className="grid gap-5 md:grid-cols-2">
                  <AuthField
                    icon={Building2}
                    label="Faculty"
                    name="faculty"
                    value={formData.faculty}
                    onChange={handleChange}
                    placeholder="Faculty of Science"
                    disabled={loading}
                  />
                  <AuthField
                    icon={GraduationCap}
                    label="Department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Computer Science"
                    disabled={loading}
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <AuthField
                    icon={Hash}
                    label="Matric Number"
                    name="matricNumber"
                    value={formData.matricNumber}
                    onChange={handleChange}
                    placeholder="DE.2024/1234"
                    disabled={loading}
                  />

                  <div>
                    <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.24em] text-gray-500">
                      Level
                    </label>
                    <div className="relative">
                      <Layers3 className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <select
                        name="level"
                        value={formData.level}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full appearance-none rounded-2xl border border-gray-200 bg-white px-12 py-4 text-sm font-bold text-text-light outline-none transition focus:border-primary-light focus:ring-4 focus:ring-primary-light/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-text-dark"
                      >
                        {levels.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-gray-100 bg-gray-50 px-5 py-4 text-sm leading-7 text-gray-600 dark:border-white/5 dark:bg-white/[0.03] dark:text-gray-400">
                 
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full rounded-2xl py-4 text-[11px] font-black uppercase tracking-[0.24em]"
                    onClick={() => {
                      setError(null)
                      setStep(1)
                    }}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full rounded-2xl py-4 text-[11px] font-black uppercase tracking-[0.24em]"
                    loading={loading}
                  >
                    Submit Signup
                  </Button>
                </div>
              </>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-black text-primary-light hover:underline">
              Sign In
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}

function AuthField({
  icon: Icon,
  label,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  icon: typeof User
  label: string
}) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.24em] text-gray-500">
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          {...props}
          className="w-full rounded-2xl border border-gray-200 bg-white px-12 py-4 text-sm font-bold text-text-light outline-none transition focus:border-primary-light focus:ring-4 focus:ring-primary-light/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-text-dark"
        />
      </div>
    </div>
  )
}

function StepPreview({
  index,
  title,
  text,
}: {
  index: string
  title: string
  text: string
}) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">{index}</p>
      <h3 className="mt-3 text-lg font-black uppercase tracking-tight">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-white/75">{text}</p>
    </div>
  )
}
