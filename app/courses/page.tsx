'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/Card'
import { BookOpen, Clock, Users, Star } from 'lucide-react'
import Link from 'next/link'
import { getAllCourses } from '@/packages/supabase/src/helpers'
import { DashboardSkeleton } from '@/components/SkeletonLoader'

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCourses() {
      try {
        const data = await getAllCourses()
        setCourses(data || [])
      } catch (error) {
        console.error('Error fetching courses:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  if (loading) {
    return <DashboardSkeleton />
  }

  const mockCourses = [
    {
      id: 'intro-cs',
      title: 'Introduction to Computer Science',
      instructor: 'Dr. Sarah Smith',
      description: 'Learn the fundamentals of computer science including programming, algorithms, and data structures.',
      duration: '12 weeks',
      students: 150,
      rating: 4.8,
      level: 'Beginner',
      topics: ['Programming Basics', 'Algorithms', 'Data Structures', 'Problem Solving'],
    },
    {
      id: 'data-structures',
      title: 'Data Structures & Algorithms',
      instructor: 'Prof. Michael Johnson',
      description: 'Master essential data structures and algorithms for efficient problem-solving.',
      duration: '10 weeks',
      students: 120,
      rating: 4.9,
      level: 'Intermediate',
      topics: ['Arrays', 'Linked Lists', 'Trees', 'Graphs', 'Sorting', 'Searching'],
    },
    {
      id: 'web-dev',
      title: 'Web Development Fundamentals',
      instructor: 'Dr. Emily Williams',
      description: 'Build modern web applications using HTML, CSS, JavaScript, and popular frameworks.',
      duration: '14 weeks',
      students: 200,
      rating: 4.7,
      level: 'Beginner',
      topics: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'Databases'],
    },
    {
      id: 'database-systems',
      title: 'Database Management Systems',
      instructor: 'Prof. David Brown',
      description: 'Understand database design, SQL, and modern database technologies.',
      duration: '8 weeks',
      students: 90,
      rating: 4.6,
      level: 'Intermediate',
      topics: ['SQL', 'Database Design', 'Normalization', 'Transactions', 'NoSQL'],
    },
    {
      id: 'machine-learning',
      title: 'Introduction to Machine Learning',
      instructor: 'Dr. Lisa Anderson',
      description: 'Explore machine learning algorithms and their applications in real-world problems.',
      duration: '16 weeks',
      students: 180,
      rating: 4.9,
      level: 'Advanced',
      topics: ['Supervised Learning', 'Neural Networks', 'Deep Learning', 'Model Evaluation'],
    },
    {
      id: 'software-engineering',
      title: 'Software Engineering Principles',
      instructor: 'Prof. James Wilson',
      description: 'Learn software development methodologies, design patterns, and best practices.',
      duration: '12 weeks',
      students: 110,
      rating: 4.7,
      level: 'Intermediate',
      topics: ['Agile', 'Design Patterns', 'Testing', 'Version Control', 'CI/CD'],
    },
  ]

  return (
    <div className="min-h-screen bg-subtle-light dark:bg-background-dark py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-text-light dark:text-text-dark mb-4">
            Available Courses
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore our comprehensive collection of courses designed to help you excel in your academic journey
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up">
          {courses.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No courses available yet.</p>
            </div>
          ) : (
            courses.map((course) => (
              <Link key={course.id} href={`/courses/${course.slug}`}>
                <Card className="h-full cursor-pointer group">
                  <div className="flex flex-col h-full">
                    {/* Course Title */}
                    <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-2 group-hover:text-primary-light dark:group-hover:text-primary-dark transition-colors">
                      {course.title}
                    </h2>

                    {/* Instructor */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {course.profiles?.full_name || 'Instructor'}
                    </p>

                    {/* Description */}
                    <p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow">
                      {course.description || 'No description available.'}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(course.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center animate-fade-in">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark text-white">
            <BookOpen className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Can't find what you're looking for?</h2>
            <p className="mb-6 opacity-90">
              Contact us to request new courses or suggest topics you'd like to learn
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-primary-light dark:text-primary-dark px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
            >
              Contact Us
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
