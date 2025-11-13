'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, User, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { BlogSkeleton } from '@/components/SkeletonLoader'

export default function StudentBlogPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const blogPosts = [
    {
      id: 1,
      title: '10 Study Tips for Computer Science Students',
      excerpt: 'Discover effective strategies to excel in your CS courses and manage your time better.',
      author: 'Dr. Smith',
      date: 'Jan 15, 2024',
      readTime: '5 min read',
      category: 'Study Tips',
      image: 'study',
    },
    {
      id: 2,
      title: 'Understanding Data Structures: A Beginner\'s Guide',
      excerpt: 'Learn the fundamentals of data structures and why they\'re crucial for programming.',
      author: 'Prof. Johnson',
      date: 'Jan 12, 2024',
      readTime: '8 min read',
      category: 'Computer Science',
      image: 'code',
    },
    {
      id: 3,
      title: 'Career Paths in Software Development',
      excerpt: 'Explore various career opportunities and what skills you need for each path.',
      author: 'Dr. Williams',
      date: 'Jan 10, 2024',
      readTime: '6 min read',
      category: 'Career',
      image: 'career',
    },
    {
      id: 4,
      title: 'Mastering Algorithm Design',
      excerpt: 'Tips and techniques for designing efficient algorithms and solving complex problems.',
      author: 'Dr. Brown',
      date: 'Jan 8, 2024',
      readTime: '10 min read',
      category: 'Algorithms',
      image: 'algorithm',
    },
  ]

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {blogPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="h-48 bg-gradient-to-br from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark"></div>
            
            <div className="p-6">
              <span className="inline-block px-3 py-1 bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark rounded-full text-sm font-semibold mb-3">
                {post.category}
              </span>

              <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-3 hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200">
                {post.title}
              </h2>

              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {post.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{post.readTime}</span>
                </div>
              </div>

              <Link
                href={`/blog/${post.id}`}
                className="inline-flex items-center text-primary-light dark:text-primary-dark font-medium hover:underline"
              >
                Read More
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
