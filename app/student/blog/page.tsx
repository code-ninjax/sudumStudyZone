'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, User, ArrowRight, FileText } from 'lucide-react'
import Link from 'next/link'
import { BlogSkeleton } from '@/components/SkeletonLoader'
import { getAllBlogPosts, getBlogCategories } from '@/packages/supabase/src/admin'
import { Tag } from 'lucide-react'

export default function StudentBlogPage() {
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  useEffect(() => {
    async function fetchData() {
      try {
        const [postsData, catsData] = await Promise.all([
          getAllBlogPosts(false),
          getBlogCategories()
        ])
        setPosts(postsData || [])
        setCategories(catsData || [])
      } catch (error) {
        console.error('Error fetching blog data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  // Calculate read time
  const calculateReadTime = (content: string): string => {
    const wordCount = content.split(/\s+/).length
    const minutes = Math.ceil(wordCount / 200)
    return `${minutes} min read`
  }

  const filteredPosts = selectedCategory === 'All' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory || post.category_id === selectedCategory)

  if (loading) {
    return <BlogSkeleton />
  }

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Premium Header */}
      <div className="mb-14 bg-premium-gradient rounded-3xl p-10 sm:p-14 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[100px] -mr-40 -mt-40 transition-transform duration-1000 group-hover:scale-110"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-[80px] -ml-32 -mb-32"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-white/30">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
            Intellectual Stream
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-4 tracking-tighter uppercase leading-none">
            Sudum <span className="text-yellow-300">Insights</span>
          </h1>
          <p className="text-lg sm:text-xl opacity-90 font-medium max-w-2xl leading-relaxed">
            Deep dives, educational breakthroughs, and tactical updates from the Sudum Study hub. Read, absorb, and evolve.
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap items-center gap-3 mb-10 overflow-x-auto no-scrollbar pb-2">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
            selectedCategory === 'All'
              ? 'bg-primary-light text-white shadow-lg'
              : 'bg-white dark:bg-subtle-dark text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 border border-gray-100 dark:border-gray-800'
          }`}
        >
          All Articles
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              selectedCategory === cat.id
                ? 'bg-primary-light text-white shadow-lg'
                : 'bg-white dark:bg-subtle-dark text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 border border-gray-100 dark:border-gray-800'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Blog Grid */}
      {filteredPosts.length === 0 ? (
        <div className="py-24 text-center glass-card rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800">
           <FileText className="w-16 h-16 text-gray-200 mx-auto mb-6" />
           <p className="text-gray-400 font-black uppercase tracking-[0.25em] text-sm">No articles published yet so yrr</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {filteredPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group bg-white dark:bg-subtle-dark rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-500 hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_40px_80px_rgba(0,0,0,0.3)] hover:-translate-y-2 flex flex-col"
            >
              {post.featured_image_url ? (
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src={post.featured_image_url} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              ) : (
                <div className="h-64 bg-premium-gradient relative overflow-hidden">
                   <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
                </div>
              )}
              
              <div className="p-8 sm:p-10 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <span className="px-3 py-1 bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark rounded-lg text-[10px] font-black uppercase tracking-widest border border-primary-light/20">
                    {post.category || 'General'}
                  </span>
                  <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <Clock className="w-3.5 h-3.5" />
                    {calculateReadTime(post.content)}
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-text-light dark:text-text-dark mb-4 tracking-tight leading-snug group-hover:text-primary-light transition-colors">
                  {post.title}
                </h2>

                <p className="text-gray-500 dark:text-gray-400 mb-8 line-clamp-3 leading-relaxed font-medium">
                  {post.excerpt || post.content.substring(0, 150) + '...'}
                </p>

                <div className="mt-auto pt-8 border-t border-gray-50 dark:border-gray-800/50 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-premium-gradient flex items-center justify-center text-white font-black text-[10px] shadow-md">
                         {post.profiles?.full_name?.slice(0, 2).toUpperCase() || 'AD'}
                      </div>
                      <span className="text-[10px] font-black text-text-light dark:text-text-dark uppercase tracking-widest">{post.profiles?.full_name || 'Admin'}</span>
                   </div>
                   <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(post.created_at)}
                   </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
