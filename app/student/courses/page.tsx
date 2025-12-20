'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Clock, Award, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import CountingAnimation from '@/components/CountingAnimation'
import { DashboardSkeleton } from '@/components/SkeletonLoader'
import { getStudentEnrolledCourses } from '@/packages/supabase/src/helpers'

export default function StudentCoursesPage() {
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState<any[]>([])

  useEffect(() => {
    async function fetchCourses() {
      try {
        const data = await getStudentEnrolledCourses()
        setCourses(data || [])
      } catch (error) {
        console.error('Error fetching enrolled courses:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  const mockCourses = [
    {
      id: 1,
      code: 'CSC301',
      name: 'Introduction to Computer Science',
      instructor: 'Dr. Smith',
      progress: 75,
      totalLectures: 24,
      completedLectures: 18,
      nextClass: 'Tomorrow, 10:00 AM',
      grade: 'A',
    },
    {
      id: 2,
      code: 'CSC302',
      name: 'Data Structures & Algorithms',
      instructor: 'Dr. Johnson',
      progress: 60,
      totalLectures: 20,
      completedLectures: 12,
      nextClass: 'Friday, 2:00 PM',
      grade: 'B+',
    },
    {
      id: 3,
      code: 'CSC303',
      name: 'Web Development Fundamentals',
      instructor: 'Prof. Williams',
      progress: 90,
      totalLectures: 16,
      completedLectures: 14,
      nextClass: 'Monday, 11:00 AM',
      grade: 'A+',
    },
    {
      id: 4,
      code: 'CSC304',
      name: 'Database Management Systems',
      instructor: 'Dr. Brown',
      progress: 45,
      totalLectures: 18,
      completedLectures: 8,
      nextClass: 'Wednesday, 3:00 PM',
      grade: 'B',
    },
    {
      id: 5,
      code: 'CSC305',
      name: 'Software Engineering',
      instructor: 'Prof. Davis',
      progress: 55,
      totalLectures: 22,
      completedLectures: 12,
      nextClass: 'Thursday, 1:00 PM',
      grade: 'B+',
    },
  ]

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-2">
          My Courses
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your progress and access course materials
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-500/10">
              <BookOpen className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Enrolled Courses</p>
          <p className="text-3xl font-bold text-text-light dark:text-text-dark">
            <CountingAnimation end={courses.length} />
          </p>
        </div>

        <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-500/10">
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Progress</p>
          <p className="text-3xl font-bold text-text-light dark:text-text-dark">
            <CountingAnimation end={65} suffix="%" />
          </p>
        </div>

        <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-500/10">
              <Clock className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Study Hours</p>
          <p className="text-3xl font-bold text-text-light dark:text-text-dark">
            <CountingAnimation end={48} suffix="h" />
          </p>
        </div>

        <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-yellow-500/10">
              <Award className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Grade</p>
          <p className="text-3xl font-bold text-text-light dark:text-text-dark">B+</p>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {courses.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">You are not enrolled in any courses yet.</p>
          </div>
        ) : (
          courses.map((course) => (
            <div
              key={course.id}
              className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-text-light dark:text-text-dark mt-1">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {course.profiles?.full_name || 'Instructor'}
                  </p>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {course.description || 'No description available.'}
              </p>

              <Link
                href={`/courses/${course.slug}`}
                className="mt-4 block w-full text-center py-2 bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark rounded-lg font-medium hover:bg-primary-light/20 dark:hover:bg-primary-dark/20 transition-colors duration-200"
              >
                View Course
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
