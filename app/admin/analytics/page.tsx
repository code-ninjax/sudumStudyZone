'use client'

import { useState, useEffect } from 'react'
import { Eye, Users, BookOpen, TrendingUp, Clock, Award } from 'lucide-react'
import CountingAnimation from '@/components/CountingAnimation'
import { DashboardSkeleton } from '@/components/SkeletonLoader'

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const stats = [
    { label: 'Total Page Views', value: 15678, icon: Eye, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { label: 'Active Users', value: 1180, icon: Users, color: 'text-green-500', bgColor: 'bg-green-500/10' },
    { label: 'Course Enrollments', value: 886, icon: BookOpen, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
    { label: 'Engagement Rate', value: 87, suffix: '%', icon: TrendingUp, color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
  ]

  const topCourses = [
    { name: 'Web Development Fundamentals', students: 189, engagement: 92 },
    { name: 'Software Engineering', students: 167, engagement: 88 },
    { name: 'Introduction to Computer Science', students: 156, engagement: 85 },
    { name: 'Data Structures & Algorithms', students: 142, engagement: 90 },
    { name: 'Database Management Systems', students: 134, engagement: 82 },
  ]

  const userActivity = [
    { day: 'Mon', users: 450 },
    { day: 'Tue', users: 520 },
    { day: 'Wed', users: 480 },
    { day: 'Thu', users: 550 },
    { day: 'Fri', users: 600 },
    { day: 'Sat', users: 320 },
    { day: 'Sun', users: 280 },
  ]

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-2">
          Analytics & Insights
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor platform performance and user engagement
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
            <div className={`inline-flex p-3 rounded-lg ${stat.bgColor} mb-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-text-light dark:text-text-dark">
              <CountingAnimation end={stat.value} suffix={stat.suffix || ''} />
            </p>
          </div>
        ))}
      </div>

      {/* User Activity Chart */}
      <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-6">
          Weekly User Activity
        </h2>
        <div className="flex items-end justify-between space-x-4 h-64">
          {userActivity.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-t-lg relative" style={{ height: `${(data.users / 600) * 100}%` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg"></div>
              </div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mt-2">{data.day}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500"><CountingAnimation end={data.users} /></p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Courses */}
        <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-6">
            Top Performing Courses
          </h2>
          <div className="space-y-4">
            {topCourses.map((course, index) => (
              <div key={index} className="p-4 bg-subtle-light dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-text-light dark:text-text-dark">{course.name}</h3>
                  <span className="text-sm font-semibold text-primary-light dark:text-primary-dark">
                    #{index + 1}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span><CountingAnimation end={course.students} /> students</span>
                  <span><CountingAnimation end={course.engagement} />% engagement</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark h-2 rounded-full"
                    style={{ width: `${course.engagement}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 rounded-lg bg-yellow-500/10">
                <Clock className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <h3 className="font-semibold text-text-light dark:text-text-dark">Avg Study Time</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Per student per week</p>
              </div>
            </div>
            <p className="text-4xl font-bold text-text-light dark:text-text-dark">
              <CountingAnimation end={12} suffix="h" />
            </p>
          </div>

          <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <Award className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold text-text-light dark:text-text-dark">Completion Rate</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Course completion average</p>
              </div>
            </div>
            <p className="text-4xl font-bold text-text-light dark:text-text-dark">
              <CountingAnimation end={78} suffix="%" />
            </p>
          </div>

          <div className="bg-gradient-to-br from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark text-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold mb-2">Platform Growth</h3>
            <p className="text-3xl font-bold mb-1">
              <CountingAnimation end={24} suffix="%" />
            </p>
            <p className="text-sm opacity-90">Increase in active users this month</p>
          </div>
        </div>
      </div>
    </div>
  )
}
