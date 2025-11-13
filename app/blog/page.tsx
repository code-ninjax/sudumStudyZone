import Card from '@/components/Card'
import { Calendar, User, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function BlogPage() {
  const posts = [
    {
      id: 'effective-study-techniques',
      title: 'Effective Study Techniques for Computer Science Students',
      excerpt: 'Discover proven methods to enhance your learning and retention in technical subjects.',
      author: 'Dr. Sarah Smith',
      date: '2024-01-15',
      readTime: '5 min read',
      category: 'Study Tips',
      image: 'bg-gradient-to-br from-blue-500 to-blue-700',
    },
    {
      id: 'mastering-algorithms',
      title: 'Mastering Algorithms: A Step-by-Step Guide',
      excerpt: 'Learn how to approach algorithm problems systematically and build strong problem-solving skills.',
      author: 'Prof. Michael Johnson',
      date: '2024-01-12',
      readTime: '8 min read',
      category: 'Algorithms',
      image: 'bg-gradient-to-br from-green-500 to-green-700',
    },
    {
      id: 'career-in-tech',
      title: 'Building a Successful Career in Technology',
      excerpt: 'Essential advice for students preparing to enter the tech industry.',
      author: 'Dr. Emily Williams',
      date: '2024-01-10',
      readTime: '6 min read',
      category: 'Career',
      image: 'bg-gradient-to-br from-purple-500 to-purple-700',
    },
    {
      id: 'web-development-trends',
      title: 'Web Development Trends in 2024',
      excerpt: 'Stay updated with the latest technologies and frameworks shaping modern web development.',
      author: 'Prof. David Brown',
      date: '2024-01-08',
      readTime: '7 min read',
      category: 'Web Development',
      image: 'bg-gradient-to-br from-orange-500 to-orange-700',
    },
    {
      id: 'data-structures-guide',
      title: 'Understanding Data Structures: A Comprehensive Guide',
      excerpt: 'Deep dive into fundamental data structures and their real-world applications.',
      author: 'Dr. Lisa Anderson',
      date: '2024-01-05',
      readTime: '10 min read',
      category: 'Data Structures',
      image: 'bg-gradient-to-br from-red-500 to-red-700',
    },
    {
      id: 'ai-machine-learning',
      title: 'Introduction to AI and Machine Learning',
      excerpt: 'Explore the fascinating world of artificial intelligence and its transformative potential.',
      author: 'Prof. James Wilson',
      date: '2024-01-03',
      readTime: '9 min read',
      category: 'AI & ML',
      image: 'bg-gradient-to-br from-indigo-500 to-indigo-700',
    },
  ]

  const categories = ['All', 'Study Tips', 'Algorithms', 'Career', 'Web Development', 'Data Structures', 'AI & ML']

  return (
    <div className="min-h-screen bg-subtle-light dark:bg-background-dark py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-text-light dark:text-text-dark mb-4">
            Academic Blog
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Insights, tutorials, and academic discussions to enhance your learning journey
          </p>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 animate-slide-up">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                category === 'All'
                  ? 'bg-primary-light dark:bg-primary-dark text-white'
                  : 'bg-white dark:bg-subtle-dark text-gray-700 dark:text-gray-300 hover:bg-primary-light/10 dark:hover:bg-primary-dark/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`}>
              <Card className="h-full cursor-pointer group">
                <div className="flex flex-col h-full">
                  {/* Post Image */}
                  <div className={`${post.image} h-48 rounded-lg mb-4 flex items-center justify-center text-white relative overflow-hidden group-hover:scale-105 transition-transform duration-300`}>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
                  </div>

                  {/* Category Badge */}
                  <span className="inline-block text-xs px-3 py-1 bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark rounded-full mb-3 w-fit">
                    {post.category}
                  </span>

                  {/* Post Title */}
                  <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-3 group-hover:text-primary-light dark:group-hover:text-primary-dark transition-colors">
                    {post.title}
                  </h2>

                  {/* Post Excerpt */}
                  <p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow">
                    {post.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <User className="w-4 h-4 mr-2" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Read More Link */}
                  <div className="mt-4">
                    <span className="text-primary-light dark:text-primary-dark font-semibold flex items-center group-hover:gap-2 transition-all duration-200">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:ml-2 transition-all duration-200" />
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12 animate-fade-in">
          <button className="px-8 py-3 bg-primary-light dark:bg-primary-dark text-white rounded-lg font-semibold hover:opacity-90 transition-opacity duration-200">
            Load More Posts
          </button>
        </div>
      </div>
    </div>
  )
}
