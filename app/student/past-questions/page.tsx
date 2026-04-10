'use client'

import Link from 'next/link'
import { BookCopy, ChevronRight, Clock3, Download, FileBadge2, SearchCheck } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { DashboardSkeleton } from '@/components/SkeletonLoader'
import { filterResourcesByProfileLevel, pastQuestions } from '@/lib/student-resources'
import PrintButton from '@/components/PrintButton'

export default function StudentPastQuestionsPage() {
  const { loading, profile } = useAuth()

  if (loading) {
    return <DashboardSkeleton />
  }

  const resources = filterResourcesByProfileLevel(pastQuestions, profile?.level)

  return (
    <div className="mx-auto max-w-6xl animate-fade-in px-4 py-8">
      <section className="relative overflow-hidden rounded-[2.75rem] bg-[#0b1720] p-8 text-white shadow-[0_28px_80px_rgba(2,6,23,0.22)] sm:p-10">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-green-400/10 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-300">Student Dashboard</p>
            <h1 className="mt-3 text-4xl font-black uppercase tracking-tight sm:text-5xl">
              Past Questions
            </h1>
            <p className="mt-4 text-base leading-8 text-white/75">
              Revision papers filtered to your current level{profile?.level ? `, ${profile.level}` : ''}. Use them to rehearse likely exam patterns before assessment week.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
              <SearchCheck className="h-5 w-5 text-cyan-300" />
              <p className="mt-4 text-[10px] font-black uppercase tracking-[0.24em] text-white/45">Resource Count</p>
              <p className="mt-2 text-3xl font-black">{resources.length}</p>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
              <Clock3 className="h-5 w-5 text-green-300" />
              <p className="mt-4 text-[10px] font-black uppercase tracking-[0.24em] text-white/45">Recommended Use</p>
              <p className="mt-2 text-sm font-bold leading-6 text-white/85">Practice one timed paper per study cycle.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 rounded-[2.5rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-subtle-dark sm:p-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-text-light dark:text-text-dark">
              Available Packs
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Showing resources for {profile?.level || 'all levels'}.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <PrintButton />
            <Link
              href="/student/marking-schemes"
              className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 px-5 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-text-light transition hover:border-primary-light hover:text-primary-light dark:border-white/10 dark:text-text-dark"
            >
              Marking Scheme
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="rounded-[2rem] border border-dashed border-gray-200 bg-gray-50 px-6 py-20 text-center dark:border-white/10 dark:bg-white/5">
            <Clock3 className="mx-auto h-12 w-12 text-gray-300 animate-pulse" />
            <h3 className="mt-6 text-xl font-black uppercase tracking-tight text-text-light dark:text-text-dark">Coming Soon</h3>
            <p className="mt-3 max-w-md mx-auto text-sm font-medium leading-relaxed text-gray-500 dark:text-gray-400">
              We are actively porting all localized examination past questions into the new system. Check back later!
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
