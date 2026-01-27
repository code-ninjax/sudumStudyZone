'use client'

import { useState, useEffect } from 'react'
import { Search, Download, BookOpen, Star, Filter, Library, ChevronRight } from 'lucide-react'
import CountingAnimation from '@/components/CountingAnimation'
import { BlogSkeleton } from '@/components/SkeletonLoader'

export default function StudentEbooksPage() {
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const ebooks = [
    { id: 1, title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', category: 'Computer Science', pages: 1312, rating: 4.8, downloads: 1250, cover: 'bg-blue-500' },
    { id: 2, title: 'Clean Code', author: 'Robert C. Martin', category: 'Software Engineering', pages: 464, rating: 4.9, downloads: 2100, cover: 'bg-green-500' },
    { id: 3, title: 'Design Patterns', author: 'Gang of Four', category: 'Software Engineering', pages: 395, rating: 4.7, downloads: 980, cover: 'bg-purple-500' },
    { id: 4, title: 'Database System Concepts', author: 'Abraham Silberschatz', category: 'Database', pages: 1376, rating: 4.6, downloads: 750, cover: 'bg-red-500' },
    { id: 5, title: 'Computer Networks', author: 'Andrew S. Tanenbaum', category: 'Networking', pages: 960, rating: 4.8, downloads: 1450, cover: 'bg-yellow-500' },
    { id: 6, title: 'Operating System Concepts', author: 'Abraham Silberschatz', category: 'Operating Systems', pages: 976, rating: 4.7, downloads: 1100, cover: 'bg-emerald-500' },
  ]

  if (loading) {
    return <BlogSkeleton />
  }

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Sophisticated Header */}
      <div className="mb-14 bg-premium-gradient rounded-[2.5rem] p-10 sm:p-14 text-white shadow-3xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[100px] -mr-40 -mt-40 transition-transform duration-1000 group-hover:scale-110"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-[80px] -ml-32 -mb-32"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-white/30">
              <Library className="w-3 h-3" />
              Digital Archive
            </div>
            <h1 className="text-3xl sm:text-4xl font-black mb-4 tracking-tighter uppercase leading-none">
              Scholar's <span className="text-yellow-300">Vault</span>
            </h1>
            <p className="text-lg opacity-90 font-medium max-w-xl leading-relaxed">
              Unlock a world of collective knowledge. Curated textbooks, research papers, and technical guides.
            </p>
          </div>

          <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">
             <div className="px-8 py-4 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 text-center min-w-[140px]">
                <p className="text-2xl font-black mb-0.5">12k+</p>
                <p className="text-[8px] font-black uppercase tracking-widest opacity-60">Pages Indexed</p>
             </div>
             <div className="px-8 py-4 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 text-center min-w-[140px]">
                <p className="text-2xl font-black mb-0.5">250</p>
                <p className="text-[8px] font-black uppercase tracking-widest opacity-60">Volumes</p>
             </div>
          </div>
        </div>
      </div>

      {/* Advanced Search & Filter */}
      <div className="flex flex-col md:flex-row gap-6 mb-12">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-light transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search the vault for titles, authors, or categories..."
            className="w-full pl-16 pr-6 py-5 rounded-[2rem] border border-gray-100 dark:border-gray-800 bg-white dark:bg-subtle-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-light/20 shadow-xl transition-all"
          />
        </div>
        <button className="px-8 py-5 bg-white dark:bg-subtle-dark rounded-[2rem] border border-gray-100 dark:border-gray-800 text-gray-500 font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 shadow-xl hover:bg-gray-50 transition-all">
          <Filter className="w-4 h-4" />
          Refine Library
        </button>
      </div>

      {/* eBooks High-End Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {ebooks.map((ebook) => (
          <div
            key={ebook.id}
            className="bg-white dark:bg-subtle-dark rounded-[2.5rem] p-8 transition-all duration-500 hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_40px_80px_rgba(0,0,0,0.3)] hover:-translate-y-2 group border border-gray-100 dark:border-gray-800"
          >
            <div className="flex items-start justify-between mb-8">
              <div className={`w-24 h-32 ${ebook.cover} rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform duration-500 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-white/10"></div>
                <BookOpen className="w-10 h-10 text-white relative z-10" />
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-400/10 rounded-full border border-yellow-400/20">
                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                <span className="text-[10px] font-black text-yellow-600">
                  {ebook.rating}
                </span>
              </div>
            </div>

            <h3 className="text-xl font-black text-text-light dark:text-text-dark mb-2 tracking-tight line-clamp-2">
              {ebook.title}
            </h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">{ebook.author}</p>
            
            <div className="inline-block px-3 py-1 bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 rounded-lg text-[9px] font-black uppercase tracking-widest mb-8 border border-gray-100 dark:border-gray-700">
              {ebook.category}
            </div>

            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8 pt-6 border-t border-gray-50 dark:border-gray-800/50">
              <span>{ebook.pages} Pages</span>
              <span>{ebook.downloads} Pulls</span>
            </div>

            <button className="w-full py-4 bg-premium-gradient text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary-light/20 flex items-center justify-center gap-3 transition-transform active:scale-95">
              <Download className="w-4 h-4" />
              Acquire Resource
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
