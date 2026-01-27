'use client'

import { useState, useEffect } from 'react'
import { Users, BookOpen, FileText, TrendingUp, Upload, Plus, DollarSign, Eye, Clock, UserPlus, Library } from 'lucide-react'
import Link from 'next/link'
import CountingAnimation from '@/components/CountingAnimation'
import { DashboardSkeleton } from '@/components/SkeletonLoader'
import { getAdminStatistics, getRecentActivities, getNewlyEnrolledStudents, getRecentEnrollments } from '@/packages/supabase/src/admin'
import { getMaintenanceMode, setMaintenanceMode } from '@/packages/supabase/src/settings'
import { getAllCourses } from '@/packages/supabase/src/helpers'
import type { Profile } from '@/packages/supabase/src/types'

export default function AdminPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalAssignments: 0,
    totalSubmissions: 0,
    engagementRate: 0,
    newStudents: 0,
  })
  const [recentActivities, setRecentActivities] = useState<any[]>([])
  const [newlyEnrolledStudents, setNewlyEnrolledStudents] = useState<Profile[]>([])
  const [recentEnrollments, setRecentEnrollments] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch all statistics
        const statistics = await getAdminStatistics()
        
        // Log any errors for debugging
        console.log('Admin Statistics Result:', statistics)
        if (statistics.errors) {
          Object.entries(statistics.errors).forEach(([key, error]) => {
            if (error) {
              console.error(`Error fetching ${key}:`, error)
            }
          })
        }
        
        setStats({
          totalStudents: (statistics as any).totalStudents,
          totalAssignments: (statistics as any).totalAssignments,
          totalSubmissions: (statistics as any).totalSubmissions,
          engagementRate: statistics.engagementRate,
          newStudents: statistics.newStudents,
        })

        // Fetch recent activities
        const activities = await getRecentActivities(10)
        setRecentActivities(activities)

        // Fetch newly enrolled students
        const newStudents = await getNewlyEnrolledStudents(5)
        setNewlyEnrolledStudents(newStudents)

        // Fetch recent enrollments
        const enrollments = await getRecentEnrollments(10)
        setRecentEnrollments(enrollments)

        // Fetch courses
        const coursesData = await getAllCourses()
        setCourses(coursesData.slice(0, 3)) // Show top 3 courses
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const statsCards = [
    { icon: Users, label: 'Total Students', value: stats.totalStudents, prefix: '', suffix: '', color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { icon: BookOpen, label: 'Assignments', value: stats.totalAssignments, prefix: '', suffix: '', color: 'text-green-500', bgColor: 'bg-green-500/10' },
    { icon: FileText, label: 'Total Submissions', value: stats.totalSubmissions, prefix: '', suffix: '', color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
    { icon: TrendingUp, label: 'Engagement Rate', value: stats.engagementRate, prefix: '', suffix: '%', color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
  ]

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="animate-fade-in max-w-[1600px] mx-auto">
      {/* Sophisticated Header */}
      <div className="mb-12 bg-premium-gradient rounded-[2.5rem] p-12 sm:p-16 text-white shadow-3xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[120px] -mr-48 -mt-48 transition-transform duration-1000 group-hover:scale-110"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-[100px] -ml-40 -mb-40"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="text-center lg:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.25em] border border-white/30">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                Operations Active
              </div>
              
              {/* Maintenance Toggle */}
              <button 
                onClick={async () => {
                  const current = await getMaintenanceMode()
                  const newState = !current.enabled
                  const confirmMsg = newState 
                    ? "ARE YOU ABSOLUTELY SURE? Enabling Maintenance Mode will instantly block all student and guest access to the platform." 
                    : "Restore platform access for all users?"
                  
                  if (confirm(confirmMsg)) {
                    await setMaintenanceMode(newState, "System is undergoing scheduled maintenance.")
                    alert(`Maintenance Mode is now ${newState ? 'ACTIVE' : 'INACTIVE'}`)
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-500/20 hover:bg-red-500/40 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.25em] border border-red-500/30 transition-all text-red-200"
              >
                <TrendingUp className="w-3 h-3 rotate-180" />
                Maintenance Toggle
              </button>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black mb-6 tracking-tighter uppercase leading-none">
              Control <span className="text-yellow-300">Station</span>
            </h1>
            <p className="text-xl opacity-90 font-medium max-w-2xl leading-relaxed">
              Orchestrate the Sudum Study ecosystem with precision. Oversee student growth and curriculum evolution in real-time.
            </p>
          </div>
          
          <div className="flex gap-4">
             <div className="hidden sm:block p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 text-center min-w-[140px]">
                <p className="text-3xl font-black mb-1">{stats.totalStudents}</p>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Scholars</p>
             </div>
             <div className="hidden sm:block p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 text-center min-w-[140px]">
                <p className="text-3xl font-black mb-1">{stats.totalAssignments}</p>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Assignments</p>
             </div>
          </div>
        </div>
      </div>

      {/* Refined Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-subtle-dark border border-gray-100 dark:border-gray-800 rounded-[2rem] p-8 transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_30px_60px_rgba(0,0,0,0.2)] hover:-translate-y-2 group">
            <div className="flex items-center justify-between mb-6">
              <div className={`w-14 h-14 rounded-2xl ${stat.bgColor} flex items-center justify-center transition-transform duration-500 group-hover:rotate-6`}>
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
              <div className="h-1.5 w-12 bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className={`h-full ${stat.color.replace('text-', 'bg-')} w-2/3 animate-pulse`}></div>
              </div>
            </div>
            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-[0.2em]">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black text-text-light dark:text-text-dark tracking-tighter">
                <CountingAnimation 
                  end={stat.value} 
                  prefix={stat.prefix || ''}
                  suffix={stat.suffix || ''}
                />
              </p>
              {index === 3 && <span className="text-xs font-bold text-green-500">+2.4%</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Core Operations Area */}
        <div className="lg:col-span-8 space-y-10">
          <section className="bg-white dark:bg-subtle-dark rounded-[2.5rem] p-10 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-black text-text-light dark:text-text-dark tracking-tight uppercase">Strategic Actions</h2>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Commands</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/admin/assignments" className="group p-8 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-transparent hover:border-primary-light/30 transition-all duration-300 hover:bg-white dark:hover:bg-subtle-dark">
                <div className="w-12 h-12 bg-primary-light text-white rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-primary-light/20 group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-2">New Assignment</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">Deploy new tasks and assessment criteria to the student hub.</p>
              </Link>
              
              <Link href="/admin/assignments" className="group p-8 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-transparent hover:border-accent-light/30 transition-all duration-300 hover:bg-white dark:hover:bg-subtle-dark">
                <div className="w-12 h-12 bg-accent-light text-white rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-accent-light/20 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-2">Resource Upload</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">Distribute PDFs, lecture notes, and media files across levels.</p>
              </Link>
              
              <Link href="/admin/blog" className="group p-8 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-transparent hover:border-blue-500/30 transition-all duration-300 hover:bg-white dark:hover:bg-subtle-dark">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-2">Article Forge</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">Publish research insights, announcements, and study guides.</p>
              </Link>
              
              <button className="group p-8 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-transparent hover:border-yellow-500/30 transition-all duration-300 hover:bg-white dark:hover:bg-subtle-dark text-left">
                <div className="w-12 h-12 bg-yellow-400 text-white rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-yellow-400/20 group-hover:scale-110 transition-transform">
                  <Library className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-2">Curriculum Hub</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">Restructure course modules and manage student access permissions.</p>
              </button>
            </div>
          </section>

          {/* Active Workstreams */}
          <section className="bg-white dark:bg-subtle-dark rounded-[2.5rem] p-10 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-black text-text-light dark:text-text-dark tracking-tight uppercase">Recent Enrollments</h2>
              <Link href="/admin/students" className="text-xs font-black text-primary-light uppercase tracking-widest border-b-2 border-primary-light pb-1">Master Ledger</Link>
            </div>
            
            <div className="space-y-4">
              {newlyEnrolledStudents.length > 0 ? (
                newlyEnrolledStudents.map((student) => (
                  <div key={student.id} className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl flex items-center justify-between group hover:bg-white dark:hover:bg-subtle-dark transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-premium-gradient flex items-center justify-center text-white font-black text-xs shadow-md">
                        {student.full_name?.slice(0, 2).toUpperCase() || 'ST'}
                      </div>
                      <div>
                        <h3 className="font-bold text-text-light dark:text-text-dark tracking-tight">{student.full_name || 'Anonymous Student'}</h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{student.department || 'General Science'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] text-gray-400 font-bold uppercase mb-1 tracking-widest">Joined</p>
                       <p className="text-xs font-black text-text-light dark:text-text-dark uppercase">{new Date(student.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-3xl">
                   <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No Recent Enlistments</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Intelligence Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <section className="bg-black text-white dark:bg-white dark:text-black rounded-[2.56rem] p-10 shadow-2xl relative overflow-hidden group">
             <div className="relative z-10">
               <div className="flex items-center justify-between mb-8">
                 <h2 className="text-xl font-black uppercase tracking-tight">System Pulse</h2>
                 <div className="w-8 h-8 rounded-full bg-white/10 dark:bg-black/5 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                 </div>
               </div>
               
               <div className="space-y-8">
                 {recentActivities.slice(0, 4).map((activity, index) => (
                   <div key={index} className="flex gap-4 group/item">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary-light shrink-0 transition-transform group-hover/item:scale-150"></div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest leading-normal mb-1">{activity.action}</p>
                        <p className="text-[10px] opacity-60 font-bold leading-relaxed">{activity.detail} • {activity.course}</p>
                        <p className="text-[10px] font-black text-primary-light uppercase tracking-widest mt-2">{activity.timeAgo || activity.time}</p>
                      </div>
                   </div>
                 ))}
               </div>
               
               <button className="w-full mt-10 py-4 bg-white/10 dark:bg-black/5 border border-white/10 dark:border-black/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/20 dark:hover:bg-black/10 transition-all">Audit Logs</button>
             </div>
          </section>

          <section className="bg-white dark:bg-subtle-dark rounded-[2.5rem] p-10 border border-gray-100 dark:border-gray-800">
             <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-8 text-center">Engagement Target</h3>
             <div className="relative w-40 h-40 mx-auto mb-8">
                <svg className="w-full h-full transform -rotate-90">
                   <circle cx="80" cy="80" r="70" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-gray-50 dark:text-gray-800" />
                   <circle cx="80" cy="80" r="70" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray="440" strokeDashoffset={440 - (440 * stats.engagementRate / 100)} strokeLinecap="round" className="text-primary-light transition-all duration-1000" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <p className="text-3xl font-black tracking-tighter">{stats.engagementRate}%</p>
                   <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">Yield</p>
                </div>
             </div>
             <p className="text-[10px] text-gray-500 font-bold text-center uppercase leading-relaxed tracking-widest">Engagement is up by <span className="text-green-500">12%</span> compared to last semester so yrr.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
