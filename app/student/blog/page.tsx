'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, User, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { BlogSkeleton } from '@/components/SkeletonLoader'
import { getAllBlogPosts } from '@/packages/supabase/src/admin'

export default function StudentBlogPage() {
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await getAllBlogPosts(false) // Only published posts
        setPosts(data || [])
      } catch (error) {
        console.error('Error fetching blog posts:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
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

  if (loading) {
    return <BlogSkeleton />
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-2">
          Blog & Articles
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Read insights, tips, and updates from your instructors
        </p>
      </div>

      {/* Blog Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No blog posts available yet. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              {post.featured_image_url ? (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.featured_image_url} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark"></div>
              )}
              
              <div className="p-6">
                <span className="inline-block px-3 py-1 bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark rounded-full text-sm font-semibold mb-3">
                  {post.category}
                </span>

                <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-3 hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200">
                  {post.title}
                </h2>

                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {post.excerpt || post.content.substring(0, 150) + '...'}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    <span>{post.profiles?.full_name || 'Admin'}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{formatDate(post.created_at)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{calculateReadTime(post.content)}</span>
                  </div>
                </div>

                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center text-primary-light dark:text-primary-dark font-medium hover:underline"
                >
                  Read More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
