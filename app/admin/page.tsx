'use client'

import { useState, useEffect } from 'react'
import { Users, BookOpen, FileText, TrendingUp, Upload, Plus, DollarSign, Eye } from 'lucide-react'
import Link from 'next/link'
import CountingAnimation from '@/components/CountingAnimation'
import { DashboardSkeleton } from '@/components/SkeletonLoader'

export default function AdminPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => setLoading(false), 1500)
  }, [])

  const stats = [
    { icon: Users, label: 'Total Students', value: 1234, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { icon: BookOpen, label: 'Active Courses', value: 24, color: 'text-green-500', bgColor: 'bg-green-500/10' },
    { icon: DollarSign, label: 'Total Revenue', value: 45678, prefix: '$', color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
    { icon: TrendingUp, label: 'Engagement Rate', value: 87, suffix: '%', color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
  ]

  const recentActivities = [
    { action: 'New student enrolled', course: 'Web Development', time: '2 hours ago' },
    { action: 'Assignment submitted', course: 'Data Structures', time: '3 hours ago' },
    { action: 'Material uploaded', course: 'Algorithms', time: '5 hours ago' },
    { action: 'New blog post published', course: 'Study Tips', time: '1 day ago' },
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
        {stats.map((stat, index) => (
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
              <button className="p-6 bg-primary-light/10 dark:bg-primary-dark/10 rounded-lg hover:bg-primary-light/20 dark:hover:bg-primary-dark/20 transition-all duration-200 text-left hover:scale-105">
                <Upload className="w-8 h-8 text-primary-light dark:text-primary-dark mb-3" />
                <h3 className="font-semibold text-text-light dark:text-text-dark mb-1">Upload Materials</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Add lecture notes, past questions</p>
                </button>
              
              <button className="p-6 bg-accent-light/10 dark:bg-accent-dark/10 rounded-lg hover:bg-accent-light/20 dark:hover:bg-accent-dark/20 transition-all duration-200 text-left hover:scale-105">
                <Plus className="w-8 h-8 text-accent-light dark:text-accent-dark mb-3" />
                <h3 className="font-semibold text-text-light dark:text-text-dark mb-1">Create Assignment</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Set up new assignments for students</p>
                </button>
              
              <button className="p-6 bg-blue-500/10 rounded-lg hover:bg-blue-500/20 transition-all duration-200 text-left hover:scale-105">
                <FileText className="w-8 h-8 text-blue-500 mb-3" />
                <h3 className="font-semibold text-text-light dark:text-text-dark mb-1">Write Blog Post</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Share insights and updates</p>
                </button>
              
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
              {['Introduction to Computer Science', 'Data Structures & Algorithms', 'Web Development'].map((course, index) => (
                <div key={index} className="p-4 bg-subtle-light dark:bg-gray-800 rounded-lg flex items-center justify-between hover:shadow-md transition-shadow duration-200">
                  <div>
                    <h3 className="font-semibold text-text-light dark:text-text-dark">{course}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active • <CountingAnimation end={Math.floor(Math.random() * 100) + 50} /> students</p>
                  </div>
                  <button className="text-primary-light dark:text-primary-dark hover:underline text-sm">
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                  <p className="font-medium text-text-light dark:text-text-dark text-sm mb-1">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{activity.course}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">{activity.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
