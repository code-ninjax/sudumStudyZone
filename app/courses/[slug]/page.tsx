import Card from '@/components/Card'
import { BookOpen, FileText, ClipboardList, Download } from 'lucide-react'
import Link from 'next/link'

export default function CourseDetailPage({ params }: { params: { slug: string } }) {
  // Mock course data - in real app, fetch based on params.slug
  const course = {
    title: 'Introduction to Computer Science',
    instructor: 'Dr. Sarah Smith',
    description: 'A comprehensive introduction to computer science covering programming fundamentals, algorithms, data structures, and problem-solving techniques.',
    level: 'Beginner',
    duration: '12 weeks',
    students: 150,
  }

  const materials = {
    lectureNotes: [
      { id: 1, title: 'Week 1: Introduction to Programming', size: '2.5 MB', date: '2024-01-01' },
      { id: 2, title: 'Week 2: Variables and Data Types', size: '1.8 MB', date: '2024-01-08' },
      { id: 3, title: 'Week 3: Control Flow', size: '2.1 MB', date: '2024-01-15' },
      { id: 4, title: 'Week 4: Functions and Modules', size: '2.3 MB', date: '2024-01-22' },
    ],
    pastQuestions: [
      { id: 1, title: 'Midterm Exam 2023', size: '1.2 MB', year: '2023' },
      { id: 2, title: 'Final Exam 2023', size: '1.5 MB', year: '2023' },
      { id: 3, title: 'Midterm Exam 2022', size: '1.1 MB', year: '2022' },
    ],
    markingSchemes: [
      { id: 1, title: 'Midterm Marking Scheme 2023', size: '0.8 MB' },
      { id: 2, title: 'Final Marking Scheme 2023', size: '1.0 MB' },
    ],
    assignments: [
      { id: 1, title: 'Assignment 1: Basic Programming', dueDate: '2024-02-01', status: 'Open' },
      { id: 2, title: 'Assignment 2: Data Structures', dueDate: '2024-02-15', status: 'Open' },
      { id: 3, title: 'Assignment 3: Algorithm Design', dueDate: '2024-03-01', status: 'Upcoming' },
    ],
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
            <span>Instructor: <strong>{course.instructor}</strong></span>
            <span>•</span>
            <span>{course.level}</span>
            <span>•</span>
            <span>{course.duration}</span>
            <span>•</span>
            <span>{course.students} students enrolled</span>
          </div>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
            {course.description}
          </p>
        </div>

        {/* Course Materials Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lecture Notes */}
          <Card className="animate-slide-up">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-primary-light/10 dark:bg-primary-dark/10 rounded-lg">
                <BookOpen className="w-6 h-6 text-primary-light dark:text-primary-dark" />
              </div>
              <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">Lecture Notes</h2>
            </div>
            <div className="space-y-3">
              {materials.lectureNotes.map((note) => (
                <div key={note.id} className="p-4 bg-subtle-light dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-text-light dark:text-text-dark mb-1">{note.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {note.size} • {note.date}
                      </p>
                    </div>
                    <button className="p-2 hover:bg-primary-light/10 dark:hover:bg-primary-dark/10 rounded-lg transition-colors duration-200">
                      <Download className="w-5 h-5 text-primary-light dark:text-primary-dark" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Past Questions */}
          <Card className="animate-slide-up">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-accent-light/10 dark:bg-accent-dark/10 rounded-lg">
                <FileText className="w-6 h-6 text-accent-light dark:text-accent-dark" />
              </div>
              <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">Past Questions</h2>
            </div>
            <div className="space-y-3">
              {materials.pastQuestions.map((question) => (
                <div key={question.id} className="p-4 bg-subtle-light dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-text-light dark:text-text-dark mb-1">{question.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {question.size} • Year: {question.year}
                      </p>
                    </div>
                    <button className="p-2 hover:bg-accent-light/10 dark:hover:bg-accent-dark/10 rounded-lg transition-colors duration-200">
                      <Download className="w-5 h-5 text-accent-light dark:text-accent-dark" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Marking Schemes */}
          <Card className="animate-slide-up">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <ClipboardList className="w-6 h-6 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">Marking Schemes</h2>
            </div>
            <div className="space-y-3">
              {materials.markingSchemes.map((scheme) => (
                <div key={scheme.id} className="p-4 bg-subtle-light dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-text-light dark:text-text-dark mb-1">{scheme.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{scheme.size}</p>
                    </div>
                    <button className="p-2 hover:bg-blue-500/10 rounded-lg transition-colors duration-200">
                      <Download className="w-5 h-5 text-blue-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Assignments */}
          <Card className="animate-slide-up">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <ClipboardList className="w-6 h-6 text-purple-500" />
              </div>
              <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">Assignments</h2>
            </div>
            <div className="space-y-3">
              {materials.assignments.map((assignment) => (
                <div key={assignment.id} className="p-4 bg-subtle-light dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-text-light dark:text-text-dark mb-1">{assignment.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Due: {assignment.dueDate}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      assignment.status === 'Open' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
                    }`}>
                      {assignment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
