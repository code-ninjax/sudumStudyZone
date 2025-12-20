'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/Card'
import { BookOpen, FileText, ClipboardList, Download } from 'lucide-react'
import Link from 'next/link'
import { getCourseBySlug, getCourseMaterials, getCourseAnnouncements, isEnrolledInCourse } from '@/packages/supabase/src/helpers'
import { getMaterialUrl, STORAGE_BUCKETS } from '@/packages/supabase/src/storage'
import { DashboardSkeleton } from '@/components/SkeletonLoader'

export default function CourseDetailPage({ params }: { params: { slug: string } }) {
  const [course, setCourse] = useState<any>(null)
  const [materials, setMaterials] = useState<any[]>([])
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCourseData() {
      try {
        const courseData = await getCourseBySlug(params.slug)
        if (courseData) {
          setCourse(courseData)
          
          // Check enrollment
          const enrolled = await isEnrolledInCourse(courseData.id)
          setIsEnrolled(enrolled)

          // Fetch materials and announcements
          const [materialsData, announcementsData] = await Promise.all([
            getCourseMaterials(courseData.id),
            getCourseAnnouncements(courseData.id)
          ])
          
          setMaterials(materialsData || [])
          setAnnouncements(announcementsData || [])
        }
      } catch (error) {
        console.error('Error fetching course data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCourseData()
  }, [params.slug])

  if (loading) {
    return <DashboardSkeleton />
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-subtle-light dark:bg-background-dark py-12">
        <div className="container-custom">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-text-light dark:text-text-dark mb-4">Course Not Found</h1>
            <Link href="/courses" className="text-primary-light dark:text-primary-dark hover:underline">
              ← Back to Courses
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleDownload = (material: any) => {
    if (material.file_path) {
      const url = getMaterialUrl(STORAGE_BUCKETS.MATERIALS, material.file_path)
      window.open(url, '_blank')
    }
  }

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size'
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="min-h-screen bg-subtle-light dark:bg-background-dark py-12">
      <div className="container-custom">
        {/* Course Header */}
        <div className="mb-8 animate-fade-in">
          <Link href="/courses" className="text-primary-light dark:text-primary-dark hover:underline mb-4 inline-block">
            ← Back to Courses
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-text-light dark:text-text-dark mb-4">
            {course.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
            <span>Instructor: <strong>{course.profiles?.full_name || 'N/A'}</strong></span>
            <span>•</span>
            <span>Created: {new Date(course.created_at).toLocaleDateString()}</span>
          </div>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
            {course.description || 'No description available.'}
          </p>
          {!isEnrolled && (
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-yellow-800 dark:text-yellow-200">
                You are not enrolled in this course. Contact your administrator to enroll.
              </p>
            </div>
          )}
        </div>

        {/* Announcements */}
        {announcements.length > 0 && (
          <div className="mb-8 animate-slide-up">
            <Card>
              <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4">Announcements</h2>
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="p-4 bg-subtle-light dark:bg-gray-800 rounded-lg">
                    <h3 className="font-semibold text-text-light dark:text-text-dark mb-2">{announcement.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{announcement.content}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {announcement.profiles?.full_name} • {new Date(announcement.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Course Materials */}
        {isEnrolled ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Materials */}
            <Card className="animate-slide-up">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-primary-light/10 dark:bg-primary-dark/10 rounded-lg">
                  <BookOpen className="w-6 h-6 text-primary-light dark:text-primary-dark" />
                </div>
                <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">Course Materials</h2>
              </div>
              {materials.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">No materials available yet.</p>
              ) : (
                <div className="space-y-3">
                  {materials.map((material) => (
                    <div key={material.id} className="p-4 bg-subtle-light dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-text-light dark:text-text-dark mb-1">{material.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatFileSize(material.file_size)} • {material.type.toUpperCase()} • {new Date(material.created_at).toLocaleDateString()}
                          </p>
                          {material.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{material.description}</p>
                          )}
                        </div>
                        {material.file_path && (
                          <button
                            onClick={() => handleDownload(material)}
                            className="p-2 hover:bg-primary-light/10 dark:hover:bg-primary-dark/10 rounded-lg transition-colors duration-200 ml-4"
                          >
                            <Download className="w-5 h-5 text-primary-light dark:text-primary-dark" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        ) : (
          <Card className="animate-slide-up">
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You need to be enrolled in this course to access materials.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
