import Card from '@/components/Card'
import { Calendar, User, Clock, ArrowLeft, Share2 } from 'lucide-react'
import Link from 'next/link'

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  // Mock blog post data - in real app, fetch based on params.slug
  const post = {
    title: 'Effective Study Techniques for Computer Science Students',
    author: 'Dr. Sarah Smith',
    date: '2024-01-15',
    readTime: '5 min read',
    category: 'Study Tips',
    content: `
      <p>Studying computer science requires a unique approach that combines theoretical understanding with practical application. In this article, we'll explore proven techniques that can help you maximize your learning potential.</p>
      
      <h2>1. Active Learning</h2>
      <p>Instead of passively reading textbooks, engage actively with the material. Write code, solve problems, and experiment with concepts. This hands-on approach reinforces learning and helps you understand how theoretical concepts apply in practice.</p>
      
      <h2>2. Spaced Repetition</h2>
      <p>Review material at increasing intervals. This technique, backed by cognitive science, helps transfer information from short-term to long-term memory. Use flashcards or spaced repetition software to optimize your review schedule.</p>
      
      <h2>3. Practice Problem-Solving</h2>
      <p>Computer science is fundamentally about problem-solving. Regularly practice coding challenges on platforms like LeetCode, HackerRank, or CodeForces. Start with easier problems and gradually increase difficulty.</p>
      
      <h2>4. Teach Others</h2>
      <p>One of the best ways to solidify your understanding is to explain concepts to others. Join study groups, participate in online forums, or create tutorial content. Teaching forces you to organize your thoughts and identify gaps in your knowledge.</p>
      
      <h2>5. Build Projects</h2>
      <p>Apply what you learn by building real projects. This not only reinforces your skills but also creates a portfolio that demonstrates your abilities to potential employers.</p>
      
      <h2>Conclusion</h2>
      <p>Effective studying is about quality, not just quantity. By implementing these techniques, you'll find yourself learning more efficiently and retaining information better. Remember, consistency is key – make these practices part of your daily routine.</p>
    `,
  }

  const relatedPosts = [
    { id: 'mastering-algorithms', title: 'Mastering Algorithms: A Step-by-Step Guide', category: 'Algorithms' },
    { id: 'data-structures-guide', title: 'Understanding Data Structures', category: 'Data Structures' },
    { id: 'career-in-tech', title: 'Building a Successful Career in Technology', category: 'Career' },
  ]

  return (
    <div className="min-h-screen bg-subtle-light dark:bg-background-dark py-12">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/blog" className="inline-flex items-center text-primary-light dark:text-primary-dark hover:underline mb-8 animate-fade-in">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>

          {/* Article Header */}
          <Card className="mb-8 animate-slide-up">
            <span className="inline-block text-sm px-3 py-1 bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark rounded-full mb-4">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-6">
              {post.title}
            </h1>
            
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <span>{post.readTime}</span>
              </div>
            </div>

            {/* Share Button */}
            <button className="flex items-center gap-2 px-4 py-2 bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark rounded-lg hover:bg-primary-light/20 dark:hover:bg-primary-dark/20 transition-colors duration-200">
              <Share2 className="w-4 h-4" />
              <span>Share Article</span>
            </button>
          </Card>

          {/* Article Content */}
          <Card className="prose prose-lg dark:prose-invert max-w-none mb-8 animate-slide-up">
            <div 
              className="text-gray-700 dark:text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </Card>

          {/* Related Posts */}
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <Link key={related.id} href={`/blog/${related.id}`}>
                  <Card className="h-full cursor-pointer group hover:shadow-xl transition-shadow duration-200">
                    <span className="text-xs px-2 py-1 bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark rounded mb-3 inline-block">
                      {related.category}
                    </span>
                    <h3 className="font-semibold text-text-light dark:text-text-dark group-hover:text-primary-light dark:group-hover:text-primary-dark transition-colors">
                      {related.title}
                    </h3>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
