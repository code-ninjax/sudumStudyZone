'use client'

import { useState, useEffect } from 'react'
import { Search, Calendar, FileText, Filter, ChevronRight, Award, Clock, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { BlogSkeleton } from '@/components/SkeletonLoader'
import { getAllAssignments } from '@/packages/supabase/src/assignments'

export default function StudentAssignmentsPage() {
  const [loading, setLoading] = useState(true)
  const [assignments, setAssignments] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('All Levels')

  const levels = ['All Levels', '100L', '200L', '300L', '400L', '500L']

  useEffect(() => {
    async function fetchAssignments() {
      try {
        const data = await getAllAssignments()
        setAssignments(data || [])
      } catch (error) {
        console.error('Error fetching assignments:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAssignments()
  }, [])

  const displayAssignments = assignments

  const filteredAssignments = displayAssignments.filter((assignment: any) => {
    const matchesSearch = assignment.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assignment.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLevel = selectedLevel === 'All Levels' || (assignment.level === selectedLevel)
    return matchesSearch && matchesLevel
  })

  if (loading) {
    return <BlogSkeleton />
  }

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Premium Header */}
      <div className="mb-10 bg-premium-gradient rounded-3xl p-10 sm:p-14 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[100px] -mr-40 -mt-40 transition-transform duration-1000 group-hover:scale-110"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-[80px] -ml-32 -mb-32"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-inner transform -rotate-3 transition-transform duration-500 group-hover:rotate-0">
            <FileText className="w-12 h-12 text-white" />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
              <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                < Award className="w-3 h-3" /> Essential Hub
              </span>
              <span className="px-4 py-1.5 bg-yellow-400/20 backdrop-blur-sm border border-yellow-400/30 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-yellow-200 flex items-center gap-2">
                < Clock className="w-3 h-3" /> New Uploads
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black mb-6 tracking-tighter uppercase leading-none">
              SIR SUDUM'S <span className="text-yellow-300 font-black">ASSIGNMENTS</span>
            </h1>
            
            <p className="text-lg sm:text-xl opacity-90 font-medium max-w-2xl leading-relaxed flex items-center justify-center md:justify-start gap-3">
              <span className="hidden sm:block p-1.5 bg-white/10 rounded-lg"><BookOpen className="w-5 h-5" /></span>
              Check out latest assignments by Sir Sudum - access materials and submit your work below.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters - Shopping Site Style */}
        <aside className="w-full lg:w-64 space-y-8">
          <div className="glass-card rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-6 text-primary-light dark:text-primary-dark">
              <Filter className="w-5 h-5" />
              <h2 className="font-bold uppercase tracking-wider text-sm">Filter by Level</h2>
            </div>
            <div className="space-y-2">
              {levels.map(level => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-bold transition-all duration-200 flex items-center justify-between group ${
                    selectedLevel === level
                      ? 'bg-primary-light text-white shadow-md'
                      : 'hover:bg-primary-light/10 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="text-sm">{level}</span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${selectedLevel === level ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="hidden lg:block glass-card rounded-xl p-6 border border-gray-50 dark:border-gray-900">
             <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Quick Stats</h3>
             <div className="space-y-4">
               <div>
                  <p className="text-2xl font-black text-text-light dark:text-text-dark">{filteredAssignments.length}</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Assignments Found</p>
               </div>
               <div className="h-[1px] bg-gray-100 dark:bg-gray-800"></div>
               <div>
                  <p className="text-xs font-bold text-gray-600 dark:text-gray-400 leading-relaxed uppercase tracking-tighter">New assignments are uploaded weekly by Sir Sudum.</p>
               </div>
             </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1">
          {/* Shorter, Boxy Search Bar */}
          <div className="mb-8 max-w-md">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-light" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="search assignments..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-subtle-dark/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark transition-all text-sm font-medium"
              />
            </div>
          </div>

          {/* Assignment Cards - Boxier & Modern */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAssignments.length === 0 ? (
              <div className="col-span-full py-20 text-center glass-card rounded-2xl border-dashed border-2 dark:border-gray-800">
                 <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                   <BookOpen className="w-8 h-8 text-gray-400" />
                 </div>
                 <p className="text-gray-400 font-black uppercase tracking-widest text-sm">No assignments matching your criteria</p>
              </div>
            ) : (
              filteredAssignments.map((assignment: any) => (
                <Link 
                  key={assignment.id}
                  href={`/student/assignments/${assignment.slug || assignment.id}`}
                  className="group relative bg-white dark:bg-subtle-dark border border-gray-100 dark:border-gray-800 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:-translate-y-1 flex flex-col justify-between overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-primary-light dark:bg-primary-dark transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark text-[10px] font-black rounded uppercase tracking-widest">
                        {assignment.level || 'General'}
                      </span>
                      <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                        <Calendar className="w-3 h-3" />
                        {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : 'No Deadline'}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-black text-text-light dark:text-text-dark group-hover:text-primary-light transition-colors duration-300 leading-tight">
                    {assignment.title}
                  </h3>
                    
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed font-medium mb-6">
                      {assignment.description ? assignment.description.replace(/<[^>]*>?/gm, '') : 'Access assignment details and submission links.'}
                    </p>

                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm">
                        <img 
                          src="/6035008313579212003.jpg" 
                          alt="Sir Sudum" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-text-light dark:text-text-dark uppercase tracking-tight">Sir Sudum</p>
                        <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Master Educator</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800/50">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary-light dark:text-primary-dark flex items-center gap-1">
                      Start Task <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-hover:bg-primary-light group-hover:text-white transition-colors duration-300">
                      <FileText className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
