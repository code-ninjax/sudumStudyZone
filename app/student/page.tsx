'use client'

import { useState, useEffect } from 'react'
import { Award, TrendingUp, BookOpen, FileText, Calendar, Target, Flame, Trophy } from 'lucide-react'
import Link from 'next/link'
import CountingAnimation from '@/components/CountingAnimation'
import { DashboardSkeleton } from '@/components/SkeletonLoader'

export default function StudentDashboardPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500)
  }, [])

  const stats = [
    { icon: Award, label: 'Total Points', value: 1250, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
    { icon: Flame, label: 'Day Streak', value: 7, suffix: ' days', color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
    { icon: BookOpen, label: 'Courses Enrolled', value: 5, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { icon: FileText, label: 'Assignments', value: 3, suffix: ' pending', color: 'text-red-500', bgColor: 'bg-red-500/10' },
  ]

  const recentCourses = [
    { id: 1, name: 'Introduction to Computer Science', progress: 75, instructor: 'Dr. Smith', lastAccessed: '2 hours ago' },
    { id: 2, name: 'Data Structures & Algorithms', progress: 60, instructor: 'Dr. Johnson', lastAccessed: '1 day ago' },
    { id: 3, name: 'Web Development Fundamentals', progress: 90, instructor: 'Prof. Williams', lastAccessed: '3 hours ago' },
  ]

  const upcomingAssignments = [
    { id: 1, title: 'Algorithm Analysis Report', course: 'Data Structures', dueDate: '2024-01-15', status: 'pending', priority: 'high' },
    { id: 2, title: 'Web Project Submission', course: 'Web Development', dueDate: '2024-01-18', status: 'pending', priority: 'medium' },
    { id: 3, title: 'Research Paper', course: 'Computer Science', dueDate: '2024-01-20', status: 'pending', priority: 'low' },
  ]

  const achievements = [
    { icon: Trophy, title: 'First Week', description: 'Completed your first week', unlocked: true },
    { icon: Flame, title: 'On Fire!', description: '7 day streak achieved', unlocked: true },
    { icon: Target, title: 'Goal Getter', description: 'Completed 5 assignments', unlocked: false },
  ]

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="animate-fade-in">
      {/* Welcome Header with Profile */}
      <div className="mb-8 bg-gradient-to-r from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark rounded-2xl p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold border-4 border-white/30">
            JD
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-1">Welcome back, John!</h1>
            <p className="opacity-90">Ready to continue your learning journey?</p>
          </div>
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
            <div className="space-y-4">
              {recentCourses.map((course) => (
                <div key={course.id} className="p-4 bg-subtle-light dark:bg-gray-800 rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-text-light dark:text-text-dark mb-1">{course.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{course.instructor}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Last accessed: {course.lastAccessed}</p>
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
          </div>

          {/* Achievements */}
          <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-6">Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {achievements.map((achievement, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg text-center transition-all duration-200 ${
                    achievement.unlocked 
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
            <div className="space-y-3">
              {upcomingAssignments.map((assignment) => (
                <div key={assignment.id} className="p-3 bg-subtle-light dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm text-text-light dark:text-text-dark flex-1">
                      {assignment.title}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      assignment.priority === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
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
                      Due: {assignment.dueDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
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
