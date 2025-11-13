import Hero from '@/components/Hero'
import Card from '@/components/Card'
import { BookOpen, FileText, Newspaper, Award, Users, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const features = [
    {
      icon: BookOpen,
      title: 'Courses & Materials',
      description: 'Access comprehensive course materials, lecture notes, and past questions.',
      href: '/courses',
    },
    {
      icon: FileText,
      title: 'Assignments',
      description: 'Submit assignments, track progress, and receive feedback from instructors.',
      href: '/dashboard',
    },
    {
      icon: Newspaper,
      title: 'Academic Blog',
      description: 'Read insightful articles, research updates, and academic discussions.',
      href: '/blog',
    },
    {
      icon: Award,
      title: 'eBooks Library',
      description: 'Browse and download educational eBooks across various subjects.',
      href: '/ebooks',
    },
    {
      icon: TrendingUp,
      title: 'Study Hub',
      description: 'Daily study resources and earn points for consistent learning.',
      href: '/study-hub',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Connect with fellow students and collaborate on academic projects.',
      href: '/about',
    },
  ]

  return (
    <>
      <Hero />
      
      {/* About the Lecturer Section */}
      <section className="py-16 bg-white dark:bg-background-dark">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="section-title">About the Lecturer</h2>
              <p className="section-subtitle">
                Dedicated to fostering academic excellence and student success
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="animate-slide-up">
                <div className="aspect-square bg-gradient-to-br from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark rounded-2xl flex items-center justify-center">
                  <Users className="w-32 h-32 text-white" />
                </div>
              </div>
              
              <div className="space-y-4 animate-slide-up">
                <h3 className="text-2xl font-bold text-text-light dark:text-text-dark">
                  Dr. [Lecturer Name]
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Ph.D. in [Field of Study]
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  With over [X] years of teaching experience, I am passionate about making quality education accessible to all students. This platform serves as a comprehensive resource hub where you can access course materials, submit assignments, and engage with academic content.
                </p>
                <div className="space-y-2">
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Areas of Expertise:</strong>
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                    <li>[Subject Area 1]</li>
                    <li>[Subject Area 2]</li>
                    <li>[Subject Area 3]</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Platform Exists */}
      <section className="py-16 bg-subtle-light dark:bg-subtle-dark">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h2 className="section-title">Why This Platform Exists</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              This platform was created with a simple yet powerful mission: to bridge the gap between traditional classroom learning and modern digital education.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Students deserve easy access to quality educational materials, a streamlined way to submit assignments, and a space to explore academic knowledge beyond the classroom. This platform provides all of that and more, fostering a community of learners dedicated to academic excellence.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Whether you're looking for lecture notes, past exam questions, or insightful blog posts on academic topics, you'll find everything you need right here.
            </p>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-16 bg-white dark:bg-background-dark">
        <div className="container-custom">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="section-title">Platform Features</h2>
            <p className="section-subtitle">
              Everything you need for academic success in one place
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Link 
                key={index} 
                href={feature.href}
                className="group"
              >
                <Card className="h-full cursor-pointer">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="bg-primary-light/10 dark:bg-primary-dark/10 p-4 rounded-full group-hover:bg-primary-light group-hover:dark:bg-primary-dark transition-colors duration-300">
                      <feature.icon className="w-8 h-8 text-primary-light dark:text-primary-dark group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-text-light dark:text-text-dark">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Placeholder */}
      <section className="py-16 bg-subtle-light dark:bg-subtle-dark">
        <div className="container-custom">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="section-title">What Students Say</h2>
            <p className="section-subtitle">
              Hear from our community of learners
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    {[...Array(5)].map((_, j) => (
                      <span key={j} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 italic">
                    "This platform has been incredibly helpful for my studies. The materials are well-organized and easy to access."
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-light dark:bg-primary-dark rounded-full"></div>
                    <div>
                      <p className="font-semibold text-text-light dark:text-text-dark">Student {i}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">[Program Name]</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center text-white animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of students already benefiting from our comprehensive academic platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/auth/signup" 
                className="bg-white text-primary-light dark:text-primary-dark px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all duration-200"
              >
                Create Free Account
              </Link>
              <Link 
                href="/about" 
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-light transition-all duration-200"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
