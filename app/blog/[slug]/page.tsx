'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/Card'
import { Calendar, User, Clock, ArrowLeft, Share2, Download, FileText } from 'lucide-react'
import Link from 'next/link'
import { getBlogPostBySlug, getAllBlogPosts } from '@/packages/supabase/src/admin'
import { DashboardSkeleton } from '@/components/SkeletonLoader'
import PrintButton from '@/components/PrintButton'

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [loading, setLoading] = useState(true)
  const [post, setPost] = useState<any>(null)
  const [relatedPosts, setRelatedPosts] = useState<any[]>([])

  useEffect(() => {
    async function fetchPost() {
      try {
        const postData = await getBlogPostBySlug(params.slug)
        if (postData) {
          setPost(postData)
          
          // Fetch related posts (same category, exclude current post)
          const allPosts = await getAllBlogPosts(false)
          const related = allPosts
            .filter(p => p.category === postData.category && p.id !== postData.id)
            .slice(0, 3)
          setRelatedPosts(related)
        }
      } catch (error) {
        console.error('Error fetching blog post:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [params.slug])

  // Calculate read time from content (rough estimate: 200 words per minute)
  const calculateReadTime = (content: string): string => {
    const wordCount = content.split(/\s+/).length
    const minutes = Math.ceil(wordCount / 200)
    return `${minutes} min read`
  }

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  // Convert content to HTML (support markdown-like formatting)
  const formatContent = (content: string): string => {
    // Simple markdown-like formatting
    return content
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/### (.*?)(?=\n|$)/g, '<h3>$1</h3>')
      .replace(/## (.*?)(?=\n|$)/g, '<h2>$1</h2>')
      .replace(/# (.*?)(?=\n|$)/g, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^(.+)$/gm, '<p>$1</p>')
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-subtle-light dark:bg-background-dark py-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-4">
              Post Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Link 
              href="/blog" 
              className="inline-flex items-center text-primary-light dark:text-primary-dark hover:underline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-subtle-light dark:bg-background-dark py-12">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/blog" className="no-print inline-flex items-center text-primary-light dark:text-primary-dark hover:underline mb-8 animate-fade-in">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>

          {/* Featured Image */}
          {post.featured_image_url && (
            <div className="mb-8 rounded-xl overflow-hidden animate-slide-up">
              <img 
                src={post.featured_image_url} 
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          )}

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
                <span>{post.profiles?.full_name || 'Admin'}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <span>{formatDate(post.created_at)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <span>{calculateReadTime(post.content)}</span>
              </div>
            </div>

            {/* Share Button and Attachment */}
            <div className="no-print flex flex-wrap items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark rounded-lg hover:bg-primary-light/20 dark:hover:bg-primary-dark/20 transition-colors duration-200">
                <Share2 className="w-4 h-4" />
                <span>Share Article</span>
              </button>
              <PrintButton />
              {post.attachment_url && (
                <a
                  href={post.attachment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-accent-light/10 dark:bg-accent-dark/10 text-accent-light dark:text-accent-dark rounded-lg hover:bg-accent-light/20 dark:hover:bg-accent-dark/20 transition-colors duration-200"
                >
                  <Download className="w-4 h-4" />
                  <span>Download {post.attachment_name || 'Attachment'}</span>
                </a>
              )}
            </div>
          </Card>

          {/* Article Content */}
          <Card className="prose prose-lg dark:prose-invert max-w-none mb-8 animate-slide-up">
            <div 
              className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
            />
          </Card>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {relatedPosts.map((related) => (
                  <Link key={related.id} href={`/blog/${related.slug}`}>
                    <Card className="h-full cursor-pointer group hover:shadow-xl transition-shadow duration-200">
                      <span className="text-xs px-2 py-1 bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark rounded mb-3 inline-block">
                        {related.category}
                      </span>
                      <h3 className="font-semibold text-text-light dark:text-text-dark group-hover:text-primary-light dark:group-hover:text-primary-dark transition-colors">
                        {related.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {related.excerpt || related.content.substring(0, 100) + '...'}
                      </p>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
