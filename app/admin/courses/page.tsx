'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Users } from 'lucide-react'
import CountingAnimation from '@/components/CountingAnimation'
import { DashboardSkeleton } from '@/components/SkeletonLoader'

export default function AdminCoursesPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const courses = [
    { id: 1, code: 'CSC301', name: 'Introduction to Computer Science', students: 156, materials: 24, status: 'Active' },
    { id: 2, code: 'CSC302', name: 'Data Structures & Algorithms', students: 142, materials: 20, status: 'Active' },
    { id: 3, code: 'CSC303', name: 'Web Development Fundamentals', students: 189, materials: 16, status: 'Active' },
    { id: 4, code: 'CSC304', name: 'Database Management Systems', students: 134, materials: 18, status: 'Active' },
    { id: 5, code: 'CSC305', name: 'Software Engineering', students: 167, materials: 22, status: 'Active' },
    { id: 6, code: 'CSC306', name: 'Operating Systems', students: 98, materials: 15, status: 'Draft' },
  ]

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-2">
            Courses Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create and manage course content
          </p>
        </div>
        <button className="px-6 py-3 bg-primary-light dark:bg-primary-dark text-white rounded-lg font-medium hover:opacity-90 transition-opacity duration-200 flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Course</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Courses</p>
          <p className="text-3xl font-bold text-text-light dark:text-text-dark">
            <CountingAnimation end={24} />
          </p>
        </div>
        <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Courses</p>
          <p className="text-3xl font-bold text-text-light dark:text-text-dark">
            <CountingAnimation end={20} />
          </p>
        </div>
        <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Students</p>
          <p className="text-3xl font-bold text-text-light dark:text-text-dark">
            <CountingAnimation end={886} />
          </p>
        </div>
        <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Materials</p>
          <p className="text-3xl font-bold text-text-light dark:text-text-dark">
            <CountingAnimation end={115} />
          </p>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-sm font-semibold text-primary-light dark:text-primary-dark">
                  {course.code}
                </span>
                <h3 className="text-xl font-bold text-text-light dark:text-text-dark mt-1">
                  {course.name}
                </h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                course.status === 'Active'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
              }`}>
                {course.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Students</span>
                </div>
                <p className="text-xl font-bold text-text-light dark:text-text-dark">
                  <CountingAnimation end={course.students} />
                </p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Materials</span>
                </div>
                <p className="text-xl font-bold text-text-light dark:text-text-dark">
                  <CountingAnimation end={course.materials} />
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="flex-1 py-2 bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark rounded-lg font-medium hover:bg-primary-light/20 dark:hover:bg-primary-dark/20 transition-colors duration-200 flex items-center justify-center space-x-2">
                <Edit2 className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
