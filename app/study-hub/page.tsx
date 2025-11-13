import Card from '@/components/Card'
import { BookOpen, FileText, Video, Download, Award, TrendingUp } from 'lucide-react'

export default function StudyHubPage() {
  const resources = [
    {
      id: 1,
      title: 'Programming Fundamentals Cheat Sheet',
      type: 'PDF',
      category: 'Programming',
      size: '2.5 MB',
      downloads: 1250,
      icon: FileText,
    },
    {
      id: 2,
      title: 'Data Structures Video Tutorial Series',
      type: 'Video',
      category: 'Data Structures',
      duration: '45 min',
      views: 3400,
      icon: Video,
    },
    {
      id: 3,
      title: 'Algorithm Design Patterns Guide',
      type: 'PDF',
      category: 'Algorithms',
      size: '3.2 MB',
      downloads: 980,
      icon: FileText,
    },
    {
      id: 4,
      title: 'Web Development Best Practices',
      type: 'Article',
      category: 'Web Development',
      readTime: '10 min',
      views: 2100,
      icon: BookOpen,
    },
    {
      id: 5,
      title: 'Database Design Workshop Recording',
      type: 'Video',
      category: 'Databases',
      duration: '60 min',
      views: 1800,
      icon: Video,
    },
    {
      id: 6,
      title: 'Machine Learning Quick Reference',
      type: 'PDF',
      category: 'Machine Learning',
      size: '4.1 MB',
      downloads: 1500,
      icon: FileText,
    },
  ]

  return (
    <div className="min-h-screen bg-subtle-light dark:bg-background-dark py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-text-light dark:text-text-dark mb-4">
            Study Hub
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Your daily destination for study resources and learning materials
          </p>
        </div>

        {/* Daily Streak Banner */}
        <Card className="mb-12 bg-gradient-to-r from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark text-white animate-slide-up">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="p-4 bg-white/20 rounded-full">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">Visit Daily to Earn Points!</h2>
                <p className="opacity-90">Build your streak and unlock rewards</p>
              </div>
            </div>
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold">7</div>
                <div className="text-sm opacity-90">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">1,250</div>
                <div className="text-sm opacity-90">Total Points</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-slide-up">
          <Card>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-500/10 rounded-full">
                <BookOpen className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Resources Available</p>
                <p className="text-2xl font-bold text-text-light dark:text-text-dark">150+</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-500/10 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Your Progress</p>
                <p className="text-2xl font-bold text-text-light dark:text-text-dark">75%</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-500/10 rounded-full">
                <Award className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Achievements</p>
                <p className="text-2xl font-bold text-text-light dark:text-text-dark">12</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Resources Grid */}
        <div>
          <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-6 animate-fade-in">
            Study Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
            {resources.map((resource) => (
              <Card key={resource.id} className="cursor-pointer group">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary-light/10 dark:bg-primary-dark/10 rounded-lg group-hover:bg-primary-light group-hover:dark:bg-primary-dark transition-colors duration-200">
                    <resource.icon className="w-6 h-6 text-primary-light dark:text-primary-dark group-hover:text-white transition-colors duration-200" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded mb-2 inline-block">
                      {resource.category}
                    </span>
                    <h3 className="font-semibold text-text-light dark:text-text-dark mb-2 group-hover:text-primary-light dark:group-hover:text-primary-dark transition-colors">
                      {resource.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium text-primary-light dark:text-primary-dark">{resource.type}</span>
                      {resource.size && <span>{resource.size}</span>}
                      {resource.duration && <span>{resource.duration}</span>}
                      {resource.readTime && <span>{resource.readTime}</span>}
                    </div>
                    {resource.downloads && (
                      <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <Download className="w-3 h-3 mr-1" />
                        <span>{resource.downloads} downloads</span>
                      </div>
                    )}
                    {resource.views && (
                      <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        <span>{resource.views} views</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Load More */}
        <div className="text-center mt-12 animate-fade-in">
          <button className="px-8 py-3 bg-primary-light dark:bg-primary-dark text-white rounded-lg font-semibold hover:opacity-90 transition-opacity duration-200">
            Load More Resources
          </button>
        </div>
      </div>
    </div>
  )
}
