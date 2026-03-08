'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, BookOpen, FileText, Search } from 'lucide-react'
import { DashboardSkeleton } from '@/components/SkeletonLoader'
import { getAllBlogPosts } from '@/packages/supabase/src/admin'
import { getAllCourses } from '@/packages/supabase/src/helpers'

export default function SearchPage() {
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [posts, setPosts] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])

  useEffect(() => {
    async function loadData() {
      try {
        const [postData, courseData] = await Promise.all([
          getAllBlogPosts(false),
          getAllCourses(),
        ])
        setPosts(postData || [])
        setCourses(courseData || [])
      } catch (error) {
        console.error('Error loading search data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const normalizedQuery = query.trim().toLowerCase()

  const filteredPosts = useMemo(() => {
    if (!normalizedQuery) return posts.slice(0, 6)
    return posts.filter((post) =>
      [post.title, post.excerpt, post.content, post.category]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery))
    )
  }, [normalizedQuery, posts])

  const filteredCourses = useMemo(() => {
    if (!normalizedQuery) return courses.slice(0, 6)
    return courses.filter((course) =>
      [course.title, course.description, course.slug, course.profiles?.full_name]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery))
    )
  }, [courses, normalizedQuery])

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="min-h-screen bg-subtle-light px-4 py-10 dark:bg-background-dark">
      <div className="container-custom">
        <section className="rounded-[2.75rem] bg-[linear-gradient(135deg,#0b1720_0%,#12311e_100%)] p-8 text-white shadow-[0_28px_80px_rgba(2,6,23,0.24)] sm:p-12">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-green-300">Search Functionality</p>
          <h1 className="mt-3 text-4xl font-black uppercase tracking-tight sm:text-5xl">
            Search Courses And Articles
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-white/75">
            Find blog posts, course pages, and study content from one search screen.
          </p>

          <div className="relative mt-8 max-w-3xl">
            <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/45" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, topic, category, or lecturer"
              className="w-full rounded-[1.75rem] border border-white/10 bg-white/10 py-5 pl-14 pr-5 text-sm font-bold text-white outline-none backdrop-blur placeholder:text-white/45 focus:border-white/25"
            />
          </div>
        </section>

        <div className="mt-10 grid gap-8 xl:grid-cols-2">
          <section className="rounded-[2.5rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-subtle-dark sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-primary-light">Courses</p>
                <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-text-light dark:text-text-dark">
                  Matching Courses
                </h2>
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-400">
                {filteredCourses.length} results
              </span>
            </div>

            <div className="grid gap-4">
              {filteredCourses.length === 0 ? (
                <EmptyResults label="No course matches your search." />
              ) : (
                filteredCourses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.slug}`}
                    className="group rounded-[1.75rem] border border-gray-100 bg-gray-50 p-5 transition hover:-translate-y-1 hover:border-primary-light/25 hover:shadow-lg dark:border-white/5 dark:bg-white/5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light/10 text-primary-light">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-primary-light" />
                    </div>
                    <h3 className="mt-5 text-lg font-black uppercase tracking-tight text-text-light dark:text-text-dark">
                      {course.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-7 text-gray-600 dark:text-gray-300">
                      {course.description || 'Open this course to view materials, structure, and enrolled content.'}
                    </p>
                  </Link>
                ))
              )}
            </div>
          </section>

          <section className="rounded-[2.5rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-subtle-dark sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-primary-light">Blog</p>
                <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-text-light dark:text-text-dark">
                  Matching Articles
                </h2>
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-400">
                {filteredPosts.length} results
              </span>
            </div>

            <div className="grid gap-4">
              {filteredPosts.length === 0 ? (
                <EmptyResults label="No article matches your search." />
              ) : (
                filteredPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group rounded-[1.75rem] border border-gray-100 bg-gray-50 p-5 transition hover:-translate-y-1 hover:border-primary-light/25 hover:shadow-lg dark:border-white/5 dark:bg-white/5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light/10 text-primary-light">
                        <FileText className="h-5 w-5" />
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-primary-light" />
                    </div>
                    <h3 className="mt-5 text-lg font-black uppercase tracking-tight text-text-light dark:text-text-dark">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-7 text-gray-600 dark:text-gray-300">
                      {post.excerpt || post.content?.substring(0, 150) + '...'}
                    </p>
                  </Link>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function EmptyResults({ label }: { label: string }) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center dark:border-white/10 dark:bg-white/5">
      <p className="text-sm font-bold text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  )
}
