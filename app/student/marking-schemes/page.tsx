'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowUpRight, ClipboardCheck, FileSearch, GraduationCap, LayoutList, Sparkles } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { DashboardSkeleton } from '@/components/SkeletonLoader'
import PrintButton from '@/components/PrintButton'
import { supabase } from '@/packages/supabase/src/client'

export default function StudentMarkingSchemesPage() {
  const { loading, profile } = useAuth()
  const [resources, setResources] = useState<any[]>([])
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (!loading) fetchSchemes()
  }, [loading])

  const fetchSchemes = async () => {
    setFetching(true)
    try {
      const { data, error } = await supabase
        .from('marking_schemes')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setResources(data || [])
    } catch (err) {
      console.error('Error fetching marking schemes', err)
    } finally {
      setFetching(false)
    }
  }

  if (loading || fetching) {
    return <DashboardSkeleton />
  }

  return (
    <div className="mx-auto max-w-6xl animate-fade-in px-4 py-8">
      <section className="rounded-[2.75rem] border border-gray-100 bg-white p-8 shadow-sm dark:border-white/5 dark:bg-subtle-dark sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr] lg:items-end">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-primary-light">Exam Support</p>
            <h1 className="mt-3 text-4xl font-black uppercase tracking-tight text-text-light dark:text-text-dark sm:text-5xl">
              Marking Schemes
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-gray-600 dark:text-gray-300">
              Review how marks are allocated for your current level{profile?.level ? `, ${profile.level}` : ''}. These guides help you understand what lecturers expect in high-scoring answers.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.75rem] bg-black p-5 text-white dark:bg-white dark:text-black">
              <ClipboardCheck className="h-5 w-5" />
              <p className="mt-4 text-[10px] font-black uppercase tracking-[0.24em] opacity-50">Schemes</p>
              <p className="mt-2 text-3xl font-black">{resources.length}</p>
            </div>
            <div className="rounded-[1.75rem] border border-gray-100 bg-gray-50 p-5 dark:border-white/5 dark:bg-white/5">
              <Sparkles className="h-5 w-5 text-primary-light" />
              <p className="mt-4 text-[10px] font-black uppercase tracking-[0.24em] text-gray-400">Focus</p>
              <p className="mt-2 text-sm font-bold text-text-light dark:text-text-dark">Answer structure, keywords, and score distribution.</p>
            </div>
          </div>
        </div>
        <div className="no-print mt-6">
          <PrintButton />
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1fr,0.34fr]">
        <div className="space-y-6">
          {resources.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-gray-200 bg-gray-50 px-6 py-14 text-center dark:border-white/10 dark:bg-white/5">
              <FileSearch className="mx-auto h-10 w-10 text-gray-300" />
              <p className="mt-4 text-sm font-bold text-gray-500 dark:text-gray-400">
                No marking schemes match the current level yet.
              </p>
            </div>
          ) : (
            resources.map((resource) => (
              <article
                key={resource.id}
                className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-white/5 dark:bg-subtle-dark"
              >
                <div className="flex flex-wrap items-center gap-3">
                  {resource.course_code && (
                    <span className="rounded-full bg-primary-light/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-primary-light">
                      {resource.course_code}
                    </span>
                  )}
                  <span className="rounded-full bg-black/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-gray-500 dark:bg-white/10 dark:text-gray-300">
                    {new Date(resource.created_at).getFullYear()}
                  </span>
                </div>

                <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-2xl">
                    <h2 className="text-2xl font-black uppercase tracking-tight text-text-light dark:text-text-dark">
                      {resource.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-300">
                      Official marking scheme and grading rubric.
                    </p>
                  </div>

                  <div className="min-w-56 rounded-[1.75rem] bg-gray-50 p-5 dark:bg-white/5">
                    <div className="space-y-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-400">Context</p>
                      <p className="text-sm font-bold text-text-light dark:text-text-dark">Global Marking Standards</p>
                    </div>
                    <a
                      href={resource.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-5 py-4 text-[11px] font-black uppercase tracking-[0.24em] text-white dark:bg-white dark:text-black transition-transform hover:scale-105 active:scale-95"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                      View Scheme
                    </a>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        <aside className="rounded-[2rem] bg-[linear-gradient(180deg,#09150d_0%,#12311e_100%)] p-6 text-white shadow-[0_24px_60px_rgba(2,6,23,0.2)]">
          <LayoutList className="h-6 w-6 text-green-300" />
          <h3 className="mt-5 text-2xl font-black uppercase tracking-tight">How to use</h3>
          <div className="mt-6 space-y-5 text-sm leading-7 text-white/78">
            <p>Read the marking guide beside the past question before attempting the paper.</p>
            <p>Note the keywords, scoring splits, and the kind of working lecturers want to see.</p>
            <p>Use the same approach in your timed practice and assignment answers.</p>
          </div>

          <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-green-300" />
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">Next Stop</p>
            </div>
            <Link
              href="/student/past-questions"
              className="mt-4 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-white"
            >
              Open Past Questions
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </aside>
      </section>
    </div>
  )
}
