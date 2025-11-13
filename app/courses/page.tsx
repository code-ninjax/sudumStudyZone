import Card from '@/components/Card'
import { BookOpen, Clock, Users, Star } from 'lucide-react'
import Link from 'next/link'

export default function CoursesPage() {
  const courses = [
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
          {courses.map((course) => (
            <Link key={course.id} href={`/courses/${course.id}`}>
              <Card className="h-full cursor-pointer group">
                <div className="flex flex-col h-full">
                  {/* Level Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      course.level === 'Beginner' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                      course.level === 'Intermediate' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                      'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                    }`}>
                      {course.level}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{course.rating}</span>
                    </div>
                  </div>

                  {/* Course Title */}
                  <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-2 group-hover:text-primary-light dark:group-hover:text-primary-dark transition-colors">
                    {course.title}
                  </h2>

                  {/* Instructor */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{course.instructor}</p>

                  {/* Description */}
                  <p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow">
                    {course.description}
                  </p>

                  {/* Topics */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {course.topics.slice(0, 3).map((topic, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark rounded"
                      >
                        {topic}
                      </span>
                    ))}
                    {course.topics.length > 3 && (
                      <span className="text-xs px-2 py-1 text-gray-600 dark:text-gray-400">
                        +{course.topics.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{course.students} students</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
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
