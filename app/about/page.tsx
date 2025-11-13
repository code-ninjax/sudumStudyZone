import Card from '@/components/Card'
import { Users, Target, Heart, Award } from 'lucide-react'

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To provide accessible, quality education and resources that empower students to achieve academic excellence.',
    },
    {
      icon: Heart,
      title: 'Our Values',
      description: 'We believe in integrity, innovation, and inclusivity in education, fostering a supportive learning community.',
    },
    {
      icon: Award,
      title: 'Our Commitment',
      description: 'Dedicated to continuous improvement and staying at the forefront of educational technology and pedagogy.',
    },
  ]

  return (
    <div className="min-h-screen bg-subtle-light dark:bg-background-dark py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-text-light dark:text-text-dark mb-4">
            About Sudum Study
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Bridging the gap between traditional classroom learning and modern digital education
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto mb-16 animate-slide-up">
          <Card>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4">Our Story</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Sudum Study was founded with a simple yet powerful vision: to create a comprehensive digital platform that enhances the educational experience for students and educators alike. We recognized the need for a centralized space where students could access course materials, submit assignments, and engage with academic content beyond the traditional classroom setting.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Our platform serves as a bridge between traditional teaching methods and modern educational technology. We believe that quality education should be accessible to all students, regardless of their location or circumstances. Through Sudum Study, we've created an ecosystem that supports learning, collaboration, and academic growth.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Today, Sudum Study serves thousands of students across multiple disciplines, providing them with the tools and resources they need to succeed in their academic journey. We continue to evolve and improve, always keeping student success at the heart of everything we do.
              </p>
            </div>
          </Card>
        </div>

        {/* Values Section */}
        <div className="mb-16 animate-slide-up">
          <h2 className="text-3xl font-bold text-text-light dark:text-text-dark text-center mb-12">
            What Drives Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index}>
                <div className="text-center">
                  <div className="inline-flex p-4 bg-primary-light/10 dark:bg-primary-dark/10 rounded-full mb-4">
                    <value.icon className="w-8 h-8 text-primary-light dark:text-primary-dark" />
                  </div>
                  <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {value.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Lecturer Section */}
        <div className="max-w-4xl mx-auto animate-fade-in">
          <Card className="bg-gradient-to-br from-primary-light/5 to-accent-light/5 dark:from-primary-dark/5 dark:to-accent-dark/5">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="aspect-square bg-gradient-to-br from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark rounded-2xl flex items-center justify-center">
                  <Users className="w-32 h-32 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4">
                  Meet the Founder
                </h2>
                <h3 className="text-xl font-semibold text-primary-light dark:text-primary-dark mb-2">
                  Dr. [Lecturer Name]
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Ph.D. in [Field of Study] | [X]+ Years of Teaching Experience
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  With a passion for education and technology, Dr. [Name] created Sudum Study to revolutionize how students access and engage with educational content. Their vision combines decades of teaching experience with modern pedagogical approaches.
                </p>
                <div className="space-y-2">
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Specializations:</strong>
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                    <li>[Subject Area 1]</li>
                    <li>[Subject Area 2]</li>
                    <li>[Subject Area 3]</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
