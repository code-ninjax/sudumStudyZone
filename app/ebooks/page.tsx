import Card from '@/components/Card'
import { Search, BookOpen, Download, Eye } from 'lucide-react'

export default function EbooksPage() {
  const ebooks = [
    {
      id: 1,
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen',
      subject: 'Computer Science',
      description: 'Comprehensive guide to algorithms and data structures',
      pages: 1312,
      year: 2022,
      cover: 'bg-gradient-to-br from-blue-500 to-blue-700',
    },
    {
      id: 2,
      title: 'Clean Code',
      author: 'Robert C. Martin',
      subject: 'Software Engineering',
      description: 'A handbook of agile software craftsmanship',
      pages: 464,
      year: 2008,
      cover: 'bg-gradient-to-br from-green-500 to-green-700',
    },
    {
      id: 3,
      title: 'Design Patterns',
      author: 'Gang of Four',
      subject: 'Software Design',
      description: 'Elements of reusable object-oriented software',
      pages: 395,
      year: 1994,
      cover: 'bg-gradient-to-br from-purple-500 to-purple-700',
    },
    {
      id: 4,
      title: 'The Pragmatic Programmer',
      author: 'Andrew Hunt',
      subject: 'Programming',
      description: 'Your journey to mastery in software development',
      pages: 352,
      year: 2019,
      cover: 'bg-gradient-to-br from-orange-500 to-orange-700',
    },
    {
      id: 5,
      title: 'Database System Concepts',
      author: 'Abraham Silberschatz',
      subject: 'Databases',
      description: 'Comprehensive database management systems guide',
      pages: 1376,
      year: 2020,
      cover: 'bg-gradient-to-br from-red-500 to-red-700',
    },
    {
      id: 6,
      title: 'Artificial Intelligence: A Modern Approach',
      author: 'Stuart Russell',
      subject: 'AI & Machine Learning',
      description: 'The leading textbook in artificial intelligence',
      pages: 1136,
      year: 2021,
      cover: 'bg-gradient-to-br from-indigo-500 to-indigo-700',
    },
  ]

  return (
    <div className="min-h-screen bg-subtle-light dark:bg-background-dark py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-text-light dark:text-text-dark mb-4">
            eBooks Library
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Browse and download educational eBooks across various subjects
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for eBooks by title, author, or subject..."
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-subtle-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
              />
            </div>
          </div>
        </div>

        {/* eBooks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up">
          {ebooks.map((ebook) => (
            <Card key={ebook.id} className="group cursor-pointer">
              <div className="flex flex-col h-full">
                {/* Book Cover */}
                <div className={`${ebook.cover} h-64 rounded-lg mb-4 flex items-center justify-center text-white relative overflow-hidden group-hover:scale-105 transition-transform duration-300`}>
                  <BookOpen className="w-20 h-20 opacity-50" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
                </div>

                {/* Book Info */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-2 group-hover:text-primary-light dark:group-hover:text-primary-dark transition-colors">
                    {ebook.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    by {ebook.author}
                  </p>
                  <span className="inline-block text-xs px-3 py-1 bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark rounded-full mb-3">
                    {ebook.subject}
                  </span>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                    {ebook.description}
                  </p>
                </div>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700 mb-4">
                  <span>{ebook.pages} pages</span>
                  <span>Year: {ebook.year}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-lg hover:opacity-90 transition-opacity duration-200">
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-primary-light dark:border-primary-dark text-primary-light dark:text-primary-dark rounded-lg hover:bg-primary-light hover:text-white dark:hover:bg-primary-dark transition-all duration-200">
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12 animate-fade-in">
          <button className="px-8 py-3 bg-primary-light dark:bg-primary-dark text-white rounded-lg font-semibold hover:opacity-90 transition-opacity duration-200">
            Load More eBooks
          </button>
        </div>
      </div>
    </div>
  )
}
