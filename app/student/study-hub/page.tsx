'use client'

import { useState, useEffect } from 'react'
import { FileText, Video, BookOpen, Download, Flame, Trophy } from 'lucide-react'
import CountingAnimation from '@/components/CountingAnimation'
import { DashboardSkeleton } from '@/components/SkeletonLoader'

export default function StudentStudyHubPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const todayResources = [
    { id: 1, type: 'Lecture Notes', title: 'Data Structures - Trees', course: 'CSC302', points: 10, icon: FileText, color: 'blue' },
    { id: 2, type: 'Video Tutorial', title: 'React Hooks Explained', course: 'CSC303', points: 15, icon: Video, color: 'red' },
    { id: 3, type: 'Past Question', title: 'Database Midterm 2023', course: 'CSC304', points: 20, icon: BookOpen, color: 'green' },
    { id: 4, type: 'Assignment', title: 'Algorithm Analysis', course: 'CSC302', points: 25, icon: FileText, color: 'purple' },
  ]

  const weeklyStats = [
    { label: 'Resources Accessed', value: 24, icon: BookOpen, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { label: 'Points Earned', value: 180, icon: Trophy, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
    { label: 'Study Streak', value: 7, suffix: ' days', icon: Flame, color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
  ]

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-2">
          Study Hub
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Your daily learning resources and study materials
        </p>
      </div>

      {/* Streak Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl p-6 mb-8 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Flame className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">
                <CountingAnimation end={7} /> Day Streak! 🔥
              </h2>
              <p className="opacity-90">Keep it up! You're on fire!</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">
              <CountingAnimation end={180} />
            </p>
            <p className="text-sm opacity-90">Points This Week</p>
          </div>
        </div>
      </div>

      {/* Weekly Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {weeklyStats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-text-light dark:text-text-dark">
              <CountingAnimation end={stat.value} suffix={stat.suffix || ''} />
            </p>
          </div>
        ))}
      </div>

      {/* Today's Resources */}
      <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-6">
          Today's Resources
        </h2>
        <div className="space-y-4">
          {todayResources.map((resource) => (
            <div
              key={resource.id}
              className="p-4 bg-subtle-light dark:bg-gray-800 rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg bg-${resource.color}-500/10`}>
                  <resource.icon className={`w-6 h-6 text-${resource.color}-500`} />
                </div>
                <div>
                  <span className="text-xs font-semibold text-primary-light dark:text-primary-dark">
                    {resource.type}
                  </span>
                  <h3 className="font-semibold text-text-light dark:text-text-dark">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{resource.course}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <span className="inline-flex items-center px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-sm font-semibold">
                    <Trophy className="w-4 h-4 mr-1" />
                    +{resource.points} pts
                  </span>
                </div>
                <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
                  <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
