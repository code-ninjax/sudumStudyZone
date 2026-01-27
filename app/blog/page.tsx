'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/Card'
import { Calendar, User, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { getAllBlogPosts } from '@/packages/supabase/src/admin'
import { DashboardSkeleton } from '@/components/SkeletonLoader'

export default function BlogPage() {
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Dummy Fallback Data
  const dummyPosts = [
    {
      id: 'd1',
      slug: 'physics-of-universe',
      title: "The Physics of the Universe",
      excerpt: "Exploring the fundamental laws that govern the cosmos from an astrophysical perspective.",
      content: "Exploring the fundamental laws that govern the cosmos from an astrophysical perspective.",
      category: "Science",
      featured_image_url: "/6035008313579212004.jpg",
      created_at: new Date().toISOString(),
      profiles: { full_name: "Dr. Esaenwi Sudum" }
    },
    {
      id: 'd2',
      slug: 'leadership-modern-missions',
      title: "Leadership in Modern Missions",
      excerpt: "How to apply biblical principles to lead effective campus ministry in a digital age.",
      content: "How to apply biblical principles to lead effective campus ministry in a digital age.",
      category: "Ministry",
      featured_image_url: "/6035008313579212003.jpg",
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      profiles: { full_name: "Dr. Esaenwi Sudum" }
    },
    {
      id: 'd3',
      slug: 'balancing-faith-research',
      title: "Balancing Faith and Research",
      excerpt: "A personal reflection on maintaining spiritual depth while pursuing rigorous academic studies.",
      content: "A personal reflection on maintaining spiritual depth while pursuing rigorous academic studies.",
      category: "Academic",
      featured_image_url: "/6035008313579212004.jpg",
      created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
      profiles: { full_name: "Dr. Esaenwi Sudum" }
    },
    {
      id: 'd4',
      slug: 'astrophysics-career',
      title: "A Career in Astrophysics",
      excerpt: "Guidance for young scientists looking to break into the world of astronomy and research.",
      content: "Guidance for young scientists looking to break into the world of astronomy and research.",
      category: "Science",
      featured_image_url: "/6035008313579212003.jpg",
      created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
      profiles: { full_name: "Dr. Esaenwi Sudum" }
    }
  ]

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await getAllBlogPosts(false)
        if (data && data.length > 0) {
          setPosts(data)
        } else {
          setPosts(dummyPosts)
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error)
        setPosts(dummyPosts)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  // Extract unique categories from posts
  const categories = ['All', ...Array.from(new Set(posts.map(post => post.category))).filter(Boolean)]

  // Filter posts by category
  const filteredPosts = selectedCategory === 'All' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory)

  // Calculate read time from content (rough estimate: 200 words per minute)
  const calculateReadTime = (content: string): string => {
    const wordCount = content.split(/\s+/).length
    const minutes = Math.ceil(wordCount / 200)
    return `${minutes} min read`
  }

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="min-h-screen bg-subtle-light dark:bg-background-dark py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-text-light dark:text-text-dark mb-4">
            Academic Blog
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Insights, tutorials, and academic discussions to enhance your learning journey
          </p>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 animate-slide-up">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                category === selectedCategory
                  ? 'bg-primary-light dark:bg-primary-dark text-white'
                  : 'bg-white dark:bg-subtle-dark text-gray-700 dark:text-gray-300 hover:bg-primary-light/10 dark:hover:bg-primary-dark/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up">
          {filteredPosts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">No blog posts available yet.</p>
            </div>
          ) : (
            filteredPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card className="h-full cursor-pointer group">
                <div className="flex flex-col h-full">
                  {/* Post Image */}
                  {post.featured_image_url ? (
                    <div className="h-48 rounded-lg mb-4 relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                      <img 
                        src={post.featured_image_url} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark h-48 rounded-lg mb-4 flex items-center justify-center text-white relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
                    </div>
                  )}

                  {/* Category Badge */}
                  <span className="inline-block text-xs px-3 py-1 bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark rounded-full mb-3 w-fit">
                    {post.category}
                  </span>

                  {/* Post Title */}
                  <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-3 group-hover:text-primary-light dark:group-hover:text-primary-dark transition-colors">
                    {post.title}
                  </h2>

                  {/* Post Excerpt */}
                  <p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow">
                    {post.excerpt || post.content.substring(0, 150) + '...'}
                  </p>

                  {/* Meta Info */}
                  <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <User className="w-4 h-4 mr-2" />
                      <span>{post.profiles?.full_name || 'Admin'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{calculateReadTime(post.content)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Read More Link */}
                  <div className="mt-4">
                    <span className="text-primary-light dark:text-primary-dark font-semibold flex items-center group-hover:gap-2 transition-all duration-200">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:ml-2 transition-all duration-200" />
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
