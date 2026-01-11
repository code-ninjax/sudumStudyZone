'use client'

import { useState, useEffect } from 'react'
import { Users, BookOpen, FileText, TrendingUp, Upload, Plus, DollarSign, Eye, Clock, UserPlus } from 'lucide-react'
import Link from 'next/link'
import CountingAnimation from '@/components/CountingAnimation'
import { DashboardSkeleton } from '@/components/SkeletonLoader'
import { getAdminStatistics, getRecentActivities, getNewlyEnrolledStudents, getRecentEnrollments } from '@/packages/supabase/src/admin'
import { getAllCourses } from '@/packages/supabase/src/helpers'
import type { Profile } from '@/packages/supabase/src/types'

export default function AdminPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalMaterials: 0,
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
        setStats({
          totalStudents: statistics.totalStudents,
          totalCourses: statistics.totalCourses,
          totalMaterials: statistics.totalMaterials,
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
    { icon: BookOpen, label: 'Active Courses', value: stats.totalCourses, prefix: '', suffix: '', color: 'text-green-500', bgColor: 'bg-green-500/10' },
    { icon: FileText, label: 'Total Materials', value: stats.totalMaterials, prefix: '', suffix: '', color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
    { icon: TrendingUp, label: 'Engagement Rate', value: stats.engagementRate, prefix: '', suffix: '%', color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
  ]

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-text-light dark:text-text-dark">
              <CountingAnimation 
                end={stat.value} 
                prefix={stat.prefix || ''}
                suffix={stat.suffix || ''}
              />
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/admin/courses" className="p-6 bg-primary-light/10 dark:bg-primary-dark/10 rounded-lg hover:bg-primary-light/20 dark:hover:bg-primary-dark/20 transition-all duration-200 text-left hover:scale-105 block">
                <Upload className="w-8 h-8 text-primary-light dark:text-primary-dark mb-3" />
                <h3 className="font-semibold text-text-light dark:text-text-dark mb-1">Upload Materials</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Add lecture notes, past questions</p>
              </Link>
              
              <button className="p-6 bg-accent-light/10 dark:bg-accent-dark/10 rounded-lg hover:bg-accent-light/20 dark:hover:bg-accent-dark/20 transition-all duration-200 text-left hover:scale-105">
                <Plus className="w-8 h-8 text-accent-light dark:text-accent-dark mb-3" />
                <h3 className="font-semibold text-text-light dark:text-text-dark mb-1">Create Assignment</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Set up new assignments for students</p>
                </button>
              
              <Link href="/admin/blog" className="p-6 bg-blue-500/10 rounded-lg hover:bg-blue-500/20 transition-all duration-200 text-left hover:scale-105 block">
                <FileText className="w-8 h-8 text-blue-500 mb-3" />
                <h3 className="font-semibold text-text-light dark:text-text-dark mb-1">Write Blog Post</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Share insights and updates</p>
              </Link>
              
              <button className="p-6 bg-purple-500/10 rounded-lg hover:bg-purple-500/20 transition-all duration-200 text-left hover:scale-105">
                <BookOpen className="w-8 h-8 text-purple-500 mb-3" />
                <h3 className="font-semibold text-text-light dark:text-text-dark mb-1">Manage Courses</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Edit course details and content</p>
              </button>
            </div>
          </div>

          {/* Course Management */}
          <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">Course Management</h2>
              <Link href="/admin/courses" className="text-primary-light dark:text-primary-dark hover:underline text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {courses.length > 0 ? (
                courses.map((course) => (
                  <div key={course.id} className="p-4 bg-subtle-light dark:bg-gray-800 rounded-lg flex items-center justify-between hover:shadow-md transition-shadow duration-200">
                    <div>
                      <h3 className="font-semibold text-text-light dark:text-text-dark">{course.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Active • {course.enrollment_count || 0} students
                      </p>
                    </div>
                    <Link href={`/admin/courses/${course.id}`} className="text-primary-light dark:text-primary-dark hover:underline text-sm">
                      Edit
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 dark:text-gray-400 text-center py-4">No courses yet. Create your first course!</p>
              )}
            </div>
          </div>

          {/* Newly Enrolled Students */}
          <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">Newly Enrolled Students</h2>
              <Link href="/admin/students" className="text-primary-light dark:text-primary-dark hover:underline text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {newlyEnrolledStudents.length > 0 ? (
                newlyEnrolledStudents.map((student) => (
                  <div key={student.id} className="p-4 bg-subtle-light dark:bg-gray-800 rounded-lg flex items-center justify-between hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-primary-light/10 dark:bg-primary-dark/10 flex items-center justify-center">
                        <UserPlus className="w-5 h-5 text-primary-light dark:text-primary-dark" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-text-light dark:text-text-dark">{student.full_name || 'Student'}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {student.matric_number || student.department || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      {new Date(student.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 dark:text-gray-400 text-center py-4">No new students in the last 7 days</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div key={index} className="pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <p className="font-medium text-text-light dark:text-text-dark text-sm mb-1">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {activity.detail} • {activity.course}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">{activity.timeAgo || activity.time}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 dark:text-gray-400 text-center py-4">No recent activities</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
