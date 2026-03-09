'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Award, TrendingUp, BookOpen, FileText, Calendar, Target, Flame, Trophy, LogOut, Clock, ChevronRight, ClipboardList, CheckSquare } from 'lucide-react'
import Link from 'next/link'
import CountingAnimation from '@/components/CountingAnimation'
import { DashboardSkeleton } from '@/components/SkeletonLoader'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/packages/supabase/src/client'
import { getAllBlogPosts } from '@/packages/supabase/src/admin'
import { getAllCourses } from '@/packages/supabase/src/helpers'

export default function StudentDashboardPage() {
  const router = useRouter()
  const { profile, user, loading, signOut } = useAuth()
  const [courses, setCourses] = useState<any[]>([])
  const [assignments, setAssignments] = useState<any[]>([])
  const [submissions, setSubmissions] = useState<any[]>([])
  const [recentPosts, setRecentPosts] = useState<any[]>([])
  const [coursesLoading, setCoursesLoading] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (user?.id) {
        // Run everything in parallel
        Promise.all([
          fetchEnrolledCourses(), 
          fetchAssignments(),
          fetchRecentBlogPosts()
        ])
      } else {
        // No user ID - set loading to false to show content
        setCoursesLoading(false)
      }
    }
  }, [loading, user?.id])

  const fetchEnrolledCourses = async () => {
    try {
      // Fetch enrollments for the student
      const { data: enrollments, error: enrollError } = await supabase
        .from('enrollments')
        .select('course_id, enrolled_at')
        .eq('student_id', user?.id)

      if (enrollError) {
        console.error('Error fetching enrollments:', enrollError)
        setCoursesLoading(false)
        return
      }

      if (!enrollments || enrollments.length === 0) {
        console.log('No enrollments found')
        setCourses([])
        setCoursesLoading(false)
        return
      }

      // Fetch course details in parallel
      const courseIds = enrollments.map((e) => e.course_id)
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('id, title, description, slug, instructor_id, created_at, profiles:instructor_id(full_name)')
        .in('id', courseIds)

      if (coursesError) {
        console.error('Error fetching courses:', coursesError)
        setCoursesLoading(false)
        return
      }

      const coursesWithProgress = coursesData?.map((course: any) => ({
        id: course.id,
        name: course.title,
        progress: 0,
        instructor: 'Sir Sudum',
        lastAccessed: new Date(course.created_at).toLocaleDateString(),
      })) || []

      setCourses(coursesWithProgress)
      setCoursesLoading(false)
    } catch (err: any) {
      console.error('Error loading courses:', err)
      setCoursesLoading(false)
    }
  }

  const fetchAssignments = async () => {
    try {
      // 1. Fetch ALL assignments for student's level
      const { data: allAssignments, error: assignmentsError } = await supabase
        .from('assignments')
        .select('*')
        .eq('level', profile?.level || '100L')
        .order('due_date', { ascending: true });

      if (assignmentsError) throw assignmentsError;

      // 2. Fetch student's submissions
      const { data: studentSubmissions, error: submissionsError } = await supabase
        .from('assignment_submissions')
        .select('assignment_id')
        .eq('student_id', user?.id);

      if (submissionsError) throw submissionsError;

      setAssignments(allAssignments || []);
      setSubmissions(studentSubmissions || []);
    } catch (err: any) {
      console.error('Error loading assignments data:', err);
      setAssignments([]);
      setSubmissions([]);
    }
  }

  const fetchRecentBlogPosts = async () => {
    try {
      const posts = await getAllBlogPosts(false)
      setRecentPosts(posts || [])
    } catch (err) {
      console.error('Error loading blog posts:', err)
    }
  }

  // Calculate real stats
  const submittedIds = new Set(submissions.map((s: any) => s.assignment_id));
  const pendingAssignments = assignments.filter(a => !submittedIds.has(a.id));
  const totalPoints = submissions.reduce((sum: number, s: any) => sum + (s.score || 0), 0);

  const stats = [
    { icon: Award, label: 'Total Points', value: totalPoints, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
    { icon: Flame, label: 'Day Streak', value: 0, suffix: ' days', color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
    { icon: FileText, label: 'Submitted Tasks', value: submissions.length, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { icon: FileText, label: 'Assignments', value: pendingAssignments.length, suffix: ' pending', color: 'text-red-500', bgColor: 'bg-red-500/10' },
  ]

  const achievements = [
    { icon: Trophy, title: 'First Week', description: 'Completed your first week', unlocked: true },
    { icon: Flame, title: 'On Fire!', description: '7 day streak achieved', unlocked: true },
    { icon: Target, title: 'Goal Getter', description: 'Completed 5 assignments', unlocked: false },
  ]

  const resourceLinks = [
    {
      href: '/student/past-questions',
      icon: ClipboardList,
      title: 'Past Questions',
      description: 'Rehearse previous exam patterns with level-aware revision packs.',
    },
    {
      href: '/student/marking-schemes',
      icon: CheckSquare,
      title: 'Marking Scheme',
      description: 'Study score allocation, lecturer expectations, and answer structure.',
    },
  ]

  if (loading || coursesLoading) {
    return <DashboardSkeleton />
  }

  // Prefer the auth user's metadata name (if present), then profile.full_name, then email, then id
  const authName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email
  const displayName = authName ?? profile?.full_name ?? profile?.id ?? 'Student'
  const firstName = displayName.split(' ')[0]
  const initials = (displayName || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n: string) => n[0]?.toUpperCase())
    .join('') || (displayName || 'ST').slice(0, 2).toUpperCase()

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      {/* Premium Welcome Hero */}
      <div className="mb-12 bg-premium-gradient rounded-[2.5rem] p-10 sm:p-14 text-white shadow-3xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px] -mr-64 -mt-64 transition-transform duration-1000 group-hover:scale-110"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-[100px] -ml-40 -mb-40"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-8">
            <div className="relative">
              <div className="w-28 h-28 rounded-3xl overflow-hidden bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl font-black border-2 border-white/30 text-white shadow-inner transform transition-transform duration-700 hover:rotate-6">
                {initials}
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-yellow-400 rounded-2xl flex items-center justify-center text-black shadow-lg border-4 border-primary-light">
                < Award className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-white/30">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                Student Dynamic
              </div>
              <h1 className="text-3xl sm:text-4xl font-black mb-3 tracking-tighter uppercase leading-none">
                Salute, <span className="text-yellow-300">{firstName}!</span>
              </h1>
              <p className="text-lg opacity-90 font-medium max-w-xl leading-relaxed">
                Your intellectual trajectory is climbing. Ready to conquer your <span className="text-yellow-200 font-black">assignments</span> today?
              </p>
            </div>
          </div>
          
          <button
            onClick={async () => {
              await signOut()
              router.push('/auth/login')
            }}
            className="group px-8 py-4 bg-white/10 hover:bg-white text-white hover:text-primary-light font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl transition-all duration-300 flex items-center gap-3 backdrop-blur-md border border-white/20 hover:scale-105 active:scale-95 shadow-xl"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* High-End Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-subtle-dark border border-gray-100 dark:border-gray-800 rounded-[2rem] p-8 transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_30px_60px_rgba(0,0,0,0.2)] hover:-translate-y-2 group">
            <div className="flex items-center justify-between mb-6">
              <div className={`p-4 rounded-2xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
              <div className="flex gap-1">
                 <div className="w-1 h-3 bg-gray-100 dark:bg-gray-800 rounded-full"></div>
                 <div className="w-1 h-5 bg-gray-100 dark:bg-gray-800 rounded-full"></div>
                 <div className="w-1 h-3 bg-gray-100 dark:bg-gray-800 rounded-full"></div>
              </div>
            </div>
            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-[0.25em]">{stat.label}</p>
            <p className="text-3xl font-black text-text-light dark:text-text-dark tracking-tighter">
              <CountingAnimation
                end={stat.value}
                suffix={stat.suffix || ''}
              />
            </p>
          </div>
        ))}
      </div>

      <section className="mb-16 rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-subtle-dark">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-text-light dark:text-text-dark">
              Exam Resources
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Quick access to revision materials curated for the student dashboard.
            </p>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-primary-light">
            {profile?.level || 'All Levels'}
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {resourceLinks.map((resource) => (
            <Link
              key={resource.href}
              href={resource.href}
              className="group rounded-[2rem] border border-gray-100 bg-gray-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary-light/30 hover:shadow-lg dark:border-white/5 dark:bg-white/5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-[1.5rem] bg-primary-light/10 text-primary-light dark:bg-primary-dark/10 dark:text-primary-dark">
                  <resource.icon className="h-6 w-6" />
                </div>
                <ChevronRight className="h-5 w-5 text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-primary-light" />
              </div>
              <h3 className="mt-6 text-xl font-black uppercase tracking-tight text-text-light dark:text-text-dark">
                {resource.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-300">
                {resource.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Active Assignments Command Area */}
        <div className="lg:col-span-8 space-y-10">
          <section className="bg-white dark:bg-subtle-dark rounded-[2.5rem] p-10 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl font-black text-text-light dark:text-text-dark tracking-tight uppercase">Mission Briefing</h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Pending Assignments Overview</p>
              </div>
              <Link href="/student/assignments" className="text-[10px] font-black text-primary-light uppercase tracking-[0.25em] border-b-2 border-primary-light pb-1 hover:text-accent-light hover:border-accent-light transition-colors">
                Deployment Hub
              </Link>
            </div>

            {courses.length === 0 ? (
              <div className="text-center py-20 bg-gray-50/50 dark:bg-gray-800/10 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No active assignments logged so yrr</p>
              </div>
            ) : (
              <div className="space-y-6">
                {courses.map((course) => (
                  <div key={course.id} className="p-8 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-transparent hover:border-primary-light/30 transition-all duration-300 group">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                           <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                           <h3 className="text-lg font-black text-text-light dark:text-text-dark tracking-tight leading-tight group-hover:text-primary-light transition-colors">{course.name}</h3>
                        </div>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 font-black uppercase tracking-widest flex items-center gap-2">
                          Commanded by <span className="text-text-light dark:text-text-dark">{course.instructor}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-primary-light dark:text-primary-dark tracking-tighter">
                          <CountingAnimation end={course.progress} suffix="%" />
                        </p>
                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">Completion</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700/50 rounded-full h-3.5 overflow-hidden p-1">
                      <div
                        className="bg-premium-gradient h-full rounded-full transition-all duration-1000 ease-out shadow-lg"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recent Intelligence (Blog) Section */}
          <section className="bg-white dark:bg-subtle-dark rounded-[2.5rem] p-10 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl font-black text-text-light dark:text-text-dark tracking-tight uppercase">Recent Intelligence</h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Global Research & Updates</p>
              </div>
              <Link href="/blog" className="text-[10px] font-black text-primary-light uppercase tracking-[0.25em] border-b-2 border-primary-light pb-1 hover:text-accent-light hover:border-accent-light transition-colors">
                Internal Chronicles
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentPosts.length > 0 ? (
                recentPosts.slice(0, 2).map((post) => (
                  <Link 
                    key={post.id} 
                    href={`/blog/${post.slug}`}
                    className="group bg-gray-50 dark:bg-gray-800/30 rounded-3xl overflow-hidden border border-transparent hover:border-primary-light/20 transition-all flex flex-col"
                  >
                    <div className="h-32 relative overflow-hidden">
                      {post.featured_image_url ? (
                        <img src={post.featured_image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full bg-premium-gradient opacity-10 flex items-center justify-center">
                           <FileText className="w-8 h-8 text-primary-light" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3 px-2 py-0.5 bg-white/90 dark:bg-black/80 rounded-full text-[8px] font-black uppercase tracking-widest text-primary-light">
                        {post.category}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-black text-text-light dark:text-text-dark text-sm mb-2 line-clamp-1 group-hover:text-primary-light transition-colors uppercase tracking-tight">{post.title}</h3>
                      <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed font-medium">
                        {post.excerpt || post.content.substring(0, 100) + '...'}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full py-12 text-center bg-gray-50/30 dark:bg-gray-800/10 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800">
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No recent intelligence logged</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Intelligence Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          {/* Tactical Schedule */}
          <section className="bg-black text-white dark:bg-white dark:text-black rounded-[2.5rem] p-10 shadow-2xl overflow-hidden relative group">
            <div className="relative z-10">
              <h2 className="text-xl font-black uppercase tracking-tight mb-8">Tactical Schedule</h2>
              {assignments.length === 0 ? (
                <div className="py-10 text-center opacity-50">
                  <Calendar className="w-10 h-10 mx-auto mb-4 opacity-20" />
                  <p className="text-[10px] uppercase font-black tracking-widest">No immediate deadlines</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <div key={assignment.id} className="p-5 bg-white/5 dark:bg-black/5 rounded-2xl border border-white/10 dark:border-black/10 hover:bg-white/10 dark:hover:bg-black/10 transition-all group/item">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="font-black text-[10px] uppercase tracking-[0.15em] flex-1 leading-relaxed">
                          {assignment.title}
                        </h3>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-widest border ${assignment.priority === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                             'bg-primary-light/20 text-primary-light border-primary-light/30'
                          }`}>
                          {assignment.priority}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-primary-light" /> {assignment.due_date}</span>
                        <ChevronRight className="w-3 h-3 group-hover/item:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Cognitive Performance */}
          <section className="bg-white dark:bg-subtle-dark rounded-[2.5rem] p-10 border border-gray-100 dark:border-gray-800 text-center">
             <div className="w-16 h-16 bg-premium-gradient rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-primary-light/20 rotate-3">
                <Target className="w-8 h-8" />
             </div>
             <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-6">Cognitive Load</h3>
             <div className="relative w-32 h-32 mx-auto mb-8">
                <svg className="w-full h-full transform -rotate-90">
                   <circle cx="64" cy="64" r="58" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-gray-50 dark:text-gray-800" />
                   <circle cx="64" cy="64" r="58" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray="364" strokeDashoffset="91" strokeLinecap="round" className="text-primary-light" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <p className="text-2xl font-black tracking-tighter">75%</p>
                </div>
             </div>
             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">Optimization required so yrr. Complete pending modules.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
