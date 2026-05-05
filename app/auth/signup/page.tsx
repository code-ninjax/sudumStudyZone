'use client'

import type { ChangeEvent, FormEvent, InputHTMLAttributes } from 'react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/packages/supabase/src/client'
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
  const [departments, setDepartments] = useState<{id: string, name: string, faculty_id: string}[]>([])
  const [faculties, setFaculties] = useState<{id: string, name: string}[]>([])
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    department_id: '',
    faculty_id: '',
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

  useEffect(() => {
    const fetchDeps = async () => {
      const { data: depsData } = await supabase.from('departments').select('id, name, faculty_id').order('name')
      if (depsData) setDepartments(depsData)
    }
    const fetchFaculties = async () => {
      const { data: facsData } = await supabase.from('faculties').select('id, name').order('name')
      if (facsData) setFaculties(facsData)
    }
    fetchDeps()
    fetchFaculties()
  }, [])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    // If faculty changes, reset department selection
    if (name === 'faculty_id') {
      setFormData((current) => ({
        ...current,
        [name]: value,
        department_id: '', // Reset department when faculty changes
      }))
    } else {
      setFormData((current) => ({
        ...current,
        [name]: value,
      }))
    }
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
    if (!formData.department_id || !formData.faculty_id || !formData.level || !formData.matricNumber.trim()) {
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
        department_id: formData.department_id,
        faculty_id: formData.faculty_id,
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4 py-8 sm:py-12">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center">
          <Card className="w-full rounded-[2rem] sm:rounded-[3.5rem] border border-gray-200/60 bg-white/95 p-6 sm:p-8 shadow-[0_20px_60px_rgba(22,163,74,0.12)] backdrop-blur xl:p-12 dark:border-gray-800 dark:bg-gray-900/95 dark:shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
            <div className="grid gap-8 lg:gap-10 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400">
                  <CheckCircle2 className="h-4 w-4" />
                  Account Created
                </div>
                <h1 className="max-w-xl text-3xl sm:text-4xl font-black uppercase tracking-tight text-gray-900 dark:text-white md:text-5xl">
                  Verify your email to finish the signup flow.
                </h1>
                <p className="mt-5 max-w-xl text-base font-medium leading-7 text-gray-600 dark:text-gray-400">
                  We sent a verification link to <span className="font-black text-green-600 dark:text-green-400">{formData.email}</span>.
                  Your student profile has been created with your academic information.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[1.75rem] border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800/50">
                    <MailOpen className="mb-3 h-5 w-5 text-green-600 dark:text-green-400" />
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-400 dark:text-gray-500">Step 1</p>
                    <p className="mt-2 text-sm font-bold text-gray-900 dark:text-white">Open your inbox.</p>
                  </div>
                  <div className="rounded-[1.75rem] border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800/50">
                    <ShieldCheck className="mb-3 h-5 w-5 text-green-600 dark:text-green-400" />
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-400 dark:text-gray-500">Step 2</p>
                    <p className="mt-2 text-sm font-bold text-gray-900 dark:text-white">Verify the account.</p>
                  </div>
                  <div className="rounded-[1.75rem] border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800/50">
                    <ArrowRight className="mb-3 h-5 w-5 text-green-600 dark:text-green-400" />
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-400 dark:text-gray-500">Step 3</p>
                    <p className="mt-2 text-sm font-bold text-gray-900 dark:text-white">Sign in and continue.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] sm:rounded-[2.25rem] bg-gradient-to-br from-gray-900 to-gray-950 p-6 sm:p-8 text-white shadow-2xl border border-gray-800">
                <div className="mb-6 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-[1.5rem] bg-green-500/20">
                  <MailOpen className="h-7 w-7 sm:h-8 sm:w-8 text-green-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">Student Profile Created</h2>
                <div className="mt-8 rounded-[1.75rem] border border-gray-700 bg-gray-800/50 p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-400">Student Summary</p>
                  <p className="mt-3 text-sm font-bold text-white">{formData.fullName}</p>
                  <p className="mt-2 text-sm text-gray-300">Department Selected</p>
                  <p className="mt-1 text-sm text-gray-300">{formData.matricNumber}</p>
                  <p className="mt-4 inline-flex rounded-full bg-green-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-green-400">
                    {formData.level}
                  </p>
                </div>

                <Link
                  href="/auth/login"
                  className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-green-600 px-6 py-4 text-[11px] font-black uppercase tracking-[0.24em] text-white transition-transform hover:scale-[1.02] hover:bg-green-700"
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4 py-6 sm:py-10">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl gap-6 lg:gap-8 lg:grid-cols-[0.95fr,1.05fr] lg:items-center">
        <section className="relative overflow-hidden hidden rounded-[2rem] lg:rounded-[3.5rem] bg-gradient-to-br from-gray-900 to-gray-950 p-6 sm:p-8 text-white shadow-[0_20px_60px_rgba(0,0,0,0.3)] lg:block lg:p-12 border border-gray-800">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-green-500/20 blur-3xl" />
          <div className="absolute -bottom-20 left-10 h-48 w-48 rounded-full bg-orange-500/10 blur-3xl" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-green-400">
              <BookOpen className="h-4 w-4" />
              Dedicated Signup Flow
            </div>
            <h1 className="mt-6 max-w-md text-3xl sm:text-4xl font-black uppercase leading-none tracking-tight md:text-5xl">
              Create the account, then capture the academic criteria before submission.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-gray-300">
              This signup flow now gives department and level their own dedicated step so the client requirement is visible and explicit.
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
                text="Collect department and level before account creation."
              />
              <StepPreview
                index="03"
                title="Complete Signup"
                text="Submit your details and verify your email to activate your account."
              />
            </div>
          </div>
        </section>

        <Card className="rounded-[2rem] sm:rounded-[3.5rem] border border-gray-200/70 bg-white/95 p-5 sm:p-7 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur lg:p-12 dark:border-gray-800 dark:bg-gray-900/95 dark:shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
          <div className="mb-6 sm:mb-8 flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-green-600 dark:text-green-400">Student Signup</p>
              <h2 className="mt-3 text-2xl sm:text-3xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
                {step === 1 ? 'Account Details' : 'Academic Criteria'}
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-7 text-gray-600 dark:text-gray-400">
                {step === 1
                  ? 'Step 1 of 2. Create the base account details first.'
                  : 'Step 2 of 2. Add your academic information to complete your profile.'}
              </p>
            </div>
            <div className="hidden rounded-[1.5rem] bg-green-500/10 px-4 py-3 text-[11px] font-black uppercase tracking-[0.22em] text-green-600 dark:text-green-400 sm:block">
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
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
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

                <div className="rounded-[1.75rem] border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-7 text-gray-600 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400">
                  Your academic information will be collected in the next step to complete your student profile.
                </div>

                <Button
                  type="button"
                  variant="primary"
                  className="w-full rounded-2xl py-3.5 sm:py-4 text-[11px] font-black uppercase tracking-[0.24em]"
                  onClick={goToAcademicStep}
                >
                  Continue To Academic Criteria
                </Button>
              </>
            ) : (
              <>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.24em] text-gray-500">
                      Faculty
                    </label>
                    <div className="relative">
                      <Building2 className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <select
                        name="faculty_id"
                        value={formData.faculty_id}
                        onChange={handleChange}
                        disabled={loading}
                        required
                        className="w-full appearance-none rounded-2xl border border-gray-200 bg-white px-12 py-3.5 sm:py-4 text-sm font-bold text-gray-900 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-green-400 dark:focus:ring-green-400/10"
                      >
                        <option value="" disabled className="text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                          Select a faculty
                        </option>
                        {faculties.map((fac) => (
                          <option key={fac.id} value={fac.id} className="text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                            {fac.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.24em] text-gray-500">
                      Department
                    </label>
                    <div className="relative">
                      <Building2 className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <select
                        name="department_id"
                        value={formData.department_id}
                        onChange={handleChange}
                        disabled={loading || !formData.faculty_id}
                        required
                        className="w-full appearance-none rounded-2xl border border-gray-200 bg-white px-12 py-3.5 sm:py-4 text-sm font-bold text-gray-900 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-green-400 dark:focus:ring-green-400/10"
                      >
                        <option value="" disabled className="text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                          {formData.faculty_id ? 'Select a department' : 'Select a faculty first'}
                        </option>
                        {departments
                          .filter((dept) => dept.faculty_id === formData.faculty_id)
                          .map((dept) => (
                            <option key={dept.id} value={dept.id} className="text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                              {dept.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
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
                      <Layers3 className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                      <select
                        name="level"
                        value={formData.level}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full appearance-none rounded-2xl border border-gray-200 bg-white px-12 py-3.5 sm:py-4 text-sm font-bold text-gray-900 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-green-400 dark:focus:ring-green-400/10"
                      >
                        {levels.map((level) => (
                          <option key={level} value={level} className="text-gray-900 bg-white dark:text-gray-300 dark:bg-gray-800">
                            {level}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-7 text-gray-600 dark:border-gray-600 dark:bg-gray-800/50 dark:text-gray-300">
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
                    className="w-full rounded-2xl py-3.5 sm:py-4 text-[11px] font-black uppercase tracking-[0.24em]"
                    loading={loading}
                  >
                    Submit Signup
                  </Button>
                </div>
              </>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-black text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
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
      <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
        <input
          {...props}
          className="w-full rounded-2xl border border-gray-200 bg-white px-12 py-3.5 sm:py-4 text-sm font-bold text-gray-900 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-green-400 dark:focus:ring-green-400/10"
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
    <div className="rounded-[1.75rem] border border-gray-700/50 bg-gray-800/50 p-5">
      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-400">{index}</p>
      <h3 className="mt-3 text-lg font-black uppercase tracking-tight text-white">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-gray-300">{text}</p>
    </div>
  )
}
