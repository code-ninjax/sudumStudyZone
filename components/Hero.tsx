import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-white via-green-50 to-white dark:from-background-dark dark:via-emerald-950/20 dark:to-background-dark py-20 md:py-32">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-text-light dark:text-text-dark mb-6 leading-tight">
            Welcome to <span className="text-primary-light dark:text-primary-dark">AcademicHub</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
            Where Learning Meets Growth
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            An academic space curated by dedicated educators, sharing educational materials, resources, and insights to help you excel in your academic journey.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <Link href="/auth/signup" className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center">
              Create Account
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/auth/login" className="btn-outline w-full sm:w-auto text-center">
              Login
            </Link>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-light dark:text-primary-dark mb-2">50+</div>
              <div className="text-gray-600 dark:text-gray-400">Courses Available</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-light dark:text-primary-dark mb-2">100+</div>
              <div className="text-gray-600 dark:text-gray-400">Study Resources</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-light dark:text-primary-dark mb-2">1000+</div>
              <div className="text-gray-600 dark:text-gray-400">Active Students</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
