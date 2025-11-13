'use client'

import { useState, useEffect } from 'react'
import { Search, Download, BookOpen, Star } from 'lucide-react'
import CountingAnimation from '@/components/CountingAnimation'
import { BlogSkeleton } from '@/components/SkeletonLoader'

export default function StudentEbooksPage() {
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const ebooks = [
    { id: 1, title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', category: 'Computer Science', pages: 1312, rating: 4.8, downloads: 1250 },
    { id: 2, title: 'Clean Code', author: 'Robert C. Martin', category: 'Software Engineering', pages: 464, rating: 4.9, downloads: 2100 },
    { id: 3, title: 'Design Patterns', author: 'Gang of Four', category: 'Software Engineering', pages: 395, rating: 4.7, downloads: 980 },
    { id: 4, title: 'Database System Concepts', author: 'Abraham Silberschatz', category: 'Database', pages: 1376, rating: 4.6, downloads: 750 },
    { id: 5, title: 'Computer Networks', author: 'Andrew S. Tanenbaum', category: 'Networking', pages: 960, rating: 4.8, downloads: 1450 },
    { id: 6, title: 'Operating System Concepts', author: 'Abraham Silberschatz', category: 'Operating Systems', pages: 976, rating: 4.7, downloads: 1100 },
  ]

  if (loading) {
    return <BlogSkeleton />
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-2">
          eBooks Library
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Access your digital textbooks and study materials
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for eBooks..."
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-subtle-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark shadow-lg"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <BookOpen className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total eBooks</p>
          <p className="text-3xl font-bold text-text-light dark:text-text-dark">
            <CountingAnimation end={ebooks.length} />
          </p>
        </div>

        <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Download className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Your Downloads</p>
          <p className="text-3xl font-bold text-text-light dark:text-text-dark">
            <CountingAnimation end={12} />
          </p>
        </div>

        <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Rating</p>
          <p className="text-3xl font-bold text-text-light dark:text-text-dark">4.8</p>
        </div>
      </div>

      {/* eBooks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ebooks.map((ebook) => (
          <div
            key={ebook.id}
            className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-16 h-20 bg-gradient-to-br from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark rounded-lg flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {ebook.rating}
                </span>
              </div>
            </div>

            <h3 className="text-lg font-bold text-text-light dark:text-text-dark mb-2">
              {ebook.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{ebook.author}</p>
            <span className="inline-block px-2 py-1 bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark rounded text-xs font-semibold mb-4">
              {ebook.category}
            </span>

            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
              <span><CountingAnimation end={ebook.pages} /> pages</span>
              <span><CountingAnimation end={ebook.downloads} /> downloads</span>
            </div>

            <button className="w-full py-2 bg-primary-light dark:bg-primary-dark text-white rounded-lg font-medium hover:opacity-90 transition-opacity duration-200 flex items-center justify-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
