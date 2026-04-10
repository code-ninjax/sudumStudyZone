'use client'

import { useState, useEffect } from 'react'
import { Video, Calendar, Clock, BookOpen, ArrowRight, Loader2, Sparkles, Filter } from 'lucide-react'
import { supabase } from '@/packages/supabase/src/client'
import { useAuth } from '@/lib/auth-context'
import { DashboardSkeleton } from '@/components/SkeletonLoader'

export default function StudentOnlineClassesPage() {
  const { loading, profile } = useAuth()
  const [fetching, setFetching] = useState(true)
  const [classes, setClasses] = useState<any[]>([])
  const [filter, setFilter] = useState('all') // 'all', 'today', 'upcoming'

  useEffect(() => {
    if (!loading) fetchClasses()
  }, [loading])

  const fetchClasses = async () => {
    setFetching(true)
    try {
      const { data, error } = await supabase
        .from('online_classes')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true })

      if (error) throw error
      setClasses(data || [])
    } catch (err: any) {
      console.error('Error fetching online classes:', err)
    } finally {
      setFetching(false)
    }
  }

  if (loading || fetching) return <DashboardSkeleton />

  const now = new Date()
  
  // Tag each class with an active status
  const classesWithStatus = classes.map(cls => {
    const classDate = new Date(`${cls.date}T${cls.time}`)
    const diffMs = now.getTime() - classDate.getTime()
    const diffMins = diffMs / (1000 * 60)
    const isActive = diffMins >= -15 && diffMins <= 120 // Live if -15 to +120 minutes 
    const isPast = diffMins > 120
    const isToday = classDate.toDateString() === now.toDateString()
    
    return { ...cls, isActive, isPast, isToday, classDate }
  })

  // Filter the classes
  let filteredClasses = classesWithStatus
  if (filter === 'today') {
    filteredClasses = filteredClasses.filter(cls => cls.isToday)
  }

  // Sort: Active classes first, then chronologically
  filteredClasses.sort((a, b) => {
    if (a.isActive && !b.isActive) return -1
    if (!a.isActive && b.isActive) return 1
    return a.classDate.getTime() - b.classDate.getTime()
  })

  return (
    <div className="animate-fade-in max-w-6xl mx-auto px-4 py-8">
      <section className="bg-premium-gradient rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden mb-10 group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr,0.6fr]">
          <div>
            <div className="flex items-center gap-2 mb-4">
               <Video className="w-5 h-5 text-yellow-400" />
               <p className="text-[10px] font-black uppercase tracking-[0.28em] text-yellow-400">Live Mission Control</p>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight mb-4 leading-none">
              Online Classes
            </h1>
            <p className="max-w-xl text-lg font-medium opacity-90 leading-relaxed text-yellow-50">
              Join tactical briefing sessions and live lectures. Your scheduled transmissions will appear below dynamically.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-[2rem] p-6 border border-white/20 flex flex-col justify-center">
             <div className="flex items-start gap-4">
                <Sparkles className="w-8 h-8 text-yellow-300 flex-shrink-0" />
                <div>
                   <h3 className="font-black text-lg uppercase tracking-tight mb-2">Priority Deployments</h3>
                   <p className="text-sm opacity-80 leading-relaxed font-medium">Classes become "Live" 15 minutes before their scheduled deployment. Have your intelligence materials ready.</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black text-text-light dark:text-text-dark uppercase tracking-tight">Mission Board</h2>
        
        <div className="flex items-center gap-2 bg-white dark:bg-subtle-dark border border-gray-100 dark:border-gray-800 rounded-xl p-1 shadow-sm">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-primary-light text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
          >
            All Upcoming
          </button>
          <button 
            onClick={() => setFilter('today')}
             className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'today' ? 'bg-primary-light text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
          >
            Today's Briefings
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {filteredClasses.length === 0 ? (
          <div className="py-20 bg-white dark:bg-subtle-dark rounded-[2.5rem] border-2 border-dashed border-gray-100 dark:border-gray-800 text-center">
            <Video className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No active classes found for this criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredClasses.map((cls) => (
              <div 
                key={cls.id} 
                className={`group relative overflow-hidden bg-white dark:bg-subtle-dark border rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${
                  cls.isActive 
                    ? 'border-yellow-400/50 shadow-[0_10px_40px_rgba(250,204,21,0.1)]' 
                    : 'border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:border-primary-light/30'
                }`}
              >
                {cls.isActive && (
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-500"></div>
                )}
                
                <div className="mb-8">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-md ${
                      cls.isActive ? 'text-yellow-600 bg-yellow-500/10' : 'text-primary-light bg-primary-light/10'
                    }`}>
                      {cls.isActive ? 'Live Priority' : 'Incoming Transmission'}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-md">
                      Level {cls.level}
                    </span>
                  </div>
                  
                  <h3 className="font-black text-text-light dark:text-text-dark text-xl sm:text-2xl uppercase tracking-tight leading-tight mb-2 group-hover:text-primary-light transition-colors">
                    {cls.title}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-3 mt-4 text-[10px] font-black uppercase tracking-widest text-gray-500 bg-gray-50 dark:bg-gray-800/30 w-fit px-4 py-2 rounded-xl">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-primary-light" /> {new Date(cls.date).toLocaleDateString()}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary-light" /> {cls.time.substring(0, 5)}</span>
                    {cls.course_code && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-primary-light" /> {cls.course_code}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-auto">
                  {cls.isActive ? (
                    <a 
                      href={cls.meet_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full py-4 bg-yellow-400 text-black font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group/btn"
                    >
                      Join Mission Now
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </a>
                  ) : (
                    <div className="w-full py-4 bg-gray-50 dark:bg-gray-800/50 text-gray-400 font-black uppercase text-xs tracking-[0.2em] rounded-2xl border border-gray-100 dark:border-gray-700 text-center cursor-not-allowed">
                      Deploying Soon
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
