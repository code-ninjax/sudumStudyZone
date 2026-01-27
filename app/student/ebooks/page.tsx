'use client'

import { useState, useEffect } from 'react'
import { Search, Download, BookOpen, Star, Filter, Library, ChevronRight } from 'lucide-react'
import CountingAnimation from '@/components/CountingAnimation'
import { BlogSkeleton } from '@/components/SkeletonLoader'
import { getAllEBooks, incrementEBookPulls, rateEBook } from '@/packages/supabase/src/ebooks'
import { EBook } from '@/packages/supabase/src/types'

export default function StudentEbooksPage() {
  const [loading, setLoading] = useState(true)
  const [ebooks, setEbooks] = useState<EBook[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const data = await getAllEBooks()
      setEbooks(data || [])
    } catch (error) {
      console.error('Error fetching ebooks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (ebook: EBook) => {
    try {
      await incrementEBookPulls(ebook.id)
      window.open(ebook.file_url, '_blank')
      // Refresh local count
      setEbooks(prev => prev.map(e => e.id === ebook.id ? { ...e, pulls: (e.pulls || 0) + 1 } : e))
    } catch (error) {
      console.error('Error downloading:', error)
    }
  }

  const handleRate = async (ebookId: string, rating: number) => {
    try {
      await rateEBook(ebookId, rating)
      // Optimistic update - in a real app you'd fetch the new average
      setEbooks(prev => prev.map(e => {
        if (e.id === ebookId) {
          const newCount = (e.rating_count || 0) + 1
          const newSum = (e.rating_sum || 0) + rating
          return { ...e, rating_count: newCount, rating_sum: newSum, rating: newSum / newCount }
        }
        return e
      }))
    } catch (error) {
       alert('Failed to submit rating')
    }
  }

  const filteredEbooks = ebooks.filter(eb => 
    eb.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    eb.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    eb.category?.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEbooks.map((ebook) => (
          <div
            key={ebook.id}
            className="bg-white dark:bg-subtle-dark rounded-[2.5rem] p-8 transition-all duration-500 hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_40px_80px_rgba(0,0,0,0.3)] hover:-translate-y-2 group border border-gray-100 dark:border-gray-800"
          >
            <div className="flex items-start justify-between mb-8">
              <div className="w-28 h-40 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform duration-500 relative overflow-hidden flex-shrink-0">
                {ebook.cover_image_url ? (
                  <img src={ebook.cover_image_url} alt={ebook.title} className="w-full h-full object-cover" />
                ) : (
                  <BookOpen className="w-10 h-10 text-gray-400" />
                )}
                <div className="absolute inset-0 bg-white/10"></div>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-400/10 rounded-full border border-yellow-400/20">
                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                <span className="text-[10px] font-black text-yellow-600">
                  {ebook.rating || 0}
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
              <span>{ebook.pulls} Pulls</span>
            </div>

            <div className="flex flex-col gap-4 mb-8">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rate this resource</p>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRate(ebook.id, star)}
                    className="p-1 hover:scale-125 transition-transform"
                  >
                    <Star 
                      className={`w-5 h-5 ${star <= Math.round(ebook.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-200 dark:text-gray-700'}`} 
                    />
                  </button>
                ))}
                <span className="ml-2 text-[10px] font-black text-gray-400">({ebook.rating_count || 0})</span>
              </div>
            </div>

            <button 
              onClick={() => handleDownload(ebook)}
              className="w-full py-4 bg-premium-gradient text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary-light/20 flex items-center justify-center gap-3 transition-transform active:scale-95"
            >
              <Download className="w-4 h-4" />
              Acquire Resource
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
