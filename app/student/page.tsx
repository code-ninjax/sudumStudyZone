'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Award, TrendingUp, BookOpen, FileText, Calendar, Target, Flame, Trophy, LogOut } from 'lucide-react'
import Link from 'next/link'
import CountingAnimation from '@/components/CountingAnimation'
import { DashboardSkeleton } from '@/components/SkeletonLoader'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/packages/supabase/src/client'

export default function StudentDashboardPage() {
  const router = useRouter()
  const { profile, user, loading, signOut } = useAuth()
  const [courses, setCourses] = useState<any[]>([])
  const [assignments, setAssignments] = useState<any[]>([])
  const [coursesLoading, setCoursesLoading] = useState(true)

  useEffect(() => {
    if (!loading && user?.id) {
      fetchEnrolledCourses()
      fetchAssignments()
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

      // Fetch course details
      const courseIds = enrollments.map((e) => e.course_id)
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('id, title, description, slug, instructor_id, created_at, profiles(full_name)')
        .in('id', courseIds)

      if (coursesError) {
        console.error('Error fetching courses:', coursesError)
        setCoursesLoading(false)
        return
      }

      const coursesWithProgress = coursesData?.map((course) => ({
        id: course.id,
        name: course.title,
        progress: 0, // Progress can be calculated from completion tracking
        instructor: course.profiles?.full_name || 'Unknown Instructor',
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
      // For now, we'll show an empty state since assignments table may not be set up yet
      // This can be updated once the assignments table is created
      const { data: assignments, error } = await supabase
        .from('assignments')
        .select('*')
        .eq('student_id', user?.id)
        .order('due_date', { ascending: true })
        .limit(5)

      if (error) {
        console.log('Assignments table not available yet:', error.message)
        setAssignments([])
        return
      }

      setAssignments(assignments || [])
    } catch (err: any) {
      console.log('Assignments not available:', err.message)
      setAssignments([])
    }
  }

  // Points and streaks start at 0 for now (will be implemented later)
  const stats = [
    { icon: Award, label: 'Total Points', value: 0, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
    { icon: Flame, label: 'Day Streak', value: 0, suffix: ' days', color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
    { icon: BookOpen, label: 'Courses Enrolled', value: courses.length, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { icon: FileText, label: 'Assignments', value: assignments.length, suffix: ' pending', color: 'text-red-500', bgColor: 'bg-red-500/10' },
  ]

  const achievements = [
    { icon: Trophy, title: 'First Week', description: 'Completed your first week', unlocked: true },
    { icon: Flame, title: 'On Fire!', description: '7 day streak achieved', unlocked: true },
    { icon: Target, title: 'Goal Getter', description: 'Completed 5 assignments', unlocked: false },
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
    .map((n) => n[0]?.toUpperCase())
    .join('') || (displayName || 'ST').slice(0, 2).toUpperCase()

  return (
    <div className="animate-fade-in">
      {/* Welcome Header with Profile */}
      <div className="mb-8 bg-gradient-to-r from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold border-4 border-white/30 text-white">
              <span className="inline-block leading-none">{initials}</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">Welcome back, {firstName}!</h1>
              <p className="opacity-90">Ready to continue your learning journey?</p>
            </div>
          </div>
          <button
            onClick={async () => {
              await signOut()
              router.push('/auth/login')
            }}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white font-medium transition-colors duration-200 flex items-center gap-2 backdrop-blur-sm border border-white/30"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-text-light dark:text-text-dark">
              <CountingAnimation
                end={stat.value}
                suffix={stat.suffix || ''}
              />
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Courses */}
          <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">Continue Learning</h2>
              <Link href="/student/courses" className="text-primary-light dark:text-primary-dark hover:underline text-sm font-medium">
                View All
              </Link>
            </div>
            {courses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-500 dark:text-slate-400">No courses enrolled yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {courses.map((course) => (
                  <div key={course.id} className="p-4 bg-subtle-light dark:bg-gray-800 rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-text-light dark:text-text-dark mb-1">{course.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{course.instructor}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Enrolled: {course.lastAccessed}</p>
                      </div>
                      <span className="text-sm font-medium text-primary-light dark:text-primary-dark">
                        <CountingAnimation end={course.progress} suffix="%" />
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Achievements */}
          <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-6">Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg text-center transition-all duration-200 ${achievement.unlocked
                      ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600'
                    }`}
                >
                  <achievement.icon className="w-10 h-10 mx-auto mb-2" />
                  <h3 className="font-bold text-sm mb-1">{achievement.title}</h3>
                  <p className="text-xs opacity-80">{achievement.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Assignments */}
          <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-4">Upcoming Assignments</h2>
            {assignments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-500 dark:text-slate-400">No assignments published yet. Check back soon!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="p-3 bg-subtle-light dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-sm text-text-light dark:text-text-dark flex-1">
                        {assignment.title}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${assignment.priority === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                          assignment.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                            'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        }`}>
                        {assignment.priority}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{assignment.course}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        Due: {assignment.due_date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Daily Motivation */}
          <div className="bg-gradient-to-br from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark text-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-2">Daily Motivation</h2>
            <p className="text-sm opacity-90 mb-4">
              "The expert in anything was once a beginner. Keep pushing forward!"
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="opacity-75">Today's Progress</span>
              <span className="font-bold"><CountingAnimation end={75} suffix="%" /></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
