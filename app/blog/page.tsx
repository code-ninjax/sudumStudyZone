'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Calendar, Clock, FileText, Search, User } from 'lucide-react'
import { getAllBlogPosts } from '@/packages/supabase/src/admin'
import { DashboardSkeleton } from '@/components/SkeletonLoader'

export default function BlogPage() {
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [query, setQuery] = useState('')

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await getAllBlogPosts(false)
        setPosts(data || [])
      } catch (error) {
        console.error('Error fetching blog posts:', error)
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const categories = ['All', ...Array.from(new Set(posts.map((post) => post.category))).filter(Boolean)]
  const normalizedQuery = query.trim().toLowerCase()

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
      const matchesQuery =
        !normalizedQuery ||
        [post.title, post.excerpt, post.content, post.category]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalizedQuery))

      return matchesCategory && matchesQuery
    })
  }, [normalizedQuery, posts, selectedCategory])

  const calculateReadTime = (content: string): string => {
    const wordCount = content.split(/\s+/).length
    return `${Math.ceil(wordCount / 200)} min read`
  }

  const formatDate = (dateString: string): string =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="min-h-screen bg-subtle-light px-4 py-10 dark:bg-background-dark">
      <div className="container-custom">
        <div className="overflow-hidden rounded-[2.75rem] bg-[linear-gradient(135deg,#0b1720_0%,#12311e_100%)] p-8 text-white shadow-[0_28px_80px_rgba(2,6,23,0.24)] sm:p-12">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-green-300">Blog Responsiveness</p>
          <h1 className="mt-3 text-4xl font-black uppercase tracking-tight sm:text-5xl">
            Academic Blog
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-white/75">
            Search articles, filter by category, and read comfortably across mobile and desktop layouts.
          </p>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1fr,auto] lg:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/45" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search article titles, categories, or topics"
                className="w-full rounded-[1.75rem] border border-white/10 bg-white/10 py-5 pl-14 pr-5 text-sm font-bold text-white outline-none backdrop-blur placeholder:text-white/45 focus:border-white/25"
              />
            </div>

            <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-2xl px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition ${
                    category === selectedCategory
                      ? 'bg-white text-black'
                      : 'border border-white/10 bg-white/5 text-white/75'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10">
          {filteredPosts.length === 0 ? (
            <div className="rounded-[2.25rem] border border-dashed border-gray-200 bg-white px-6 py-16 text-center dark:border-white/10 dark:bg-subtle-dark">
              <FileText className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-4 text-sm font-bold text-gray-500 dark:text-gray-400">
                No blog posts match the selected filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[2.25rem] border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-white/5 dark:bg-subtle-dark"
                >
                  <div className="relative h-56 overflow-hidden">
                    {post.featured_image_url ? (
                      <img
                        src={post.featured_image_url}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-premium-gradient/20">
                        <FileText className="h-10 w-10 text-primary-light" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="rounded-full bg-primary-light/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-primary-light">
                        {post.category || 'General'}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">
                        <Clock className="h-3.5 w-3.5" />
                        {calculateReadTime(post.content)}
                      </span>
                    </div>

                    <h2 className="mt-5 text-xl font-black uppercase tracking-tight text-text-light transition-colors group-hover:text-primary-light dark:text-text-dark">
                      {post.title}
                    </h2>

                    <p className="mt-3 line-clamp-3 text-sm leading-7 text-gray-600 dark:text-gray-300">
                      {post.excerpt || post.content.substring(0, 160) + '...'}
                    </p>

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-6 dark:border-white/5">
                      <span className="inline-flex items-center gap-2 text-[11px] font-bold text-gray-500 dark:text-gray-300">
                        <User className="h-4 w-4" />
                        {post.profiles?.full_name || 'Admin'}
                      </span>
                      <span className="inline-flex items-center gap-2 text-[11px] font-bold text-gray-400">
                        <Calendar className="h-4 w-4" />
                        {formatDate(post.created_at)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
