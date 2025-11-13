'use client'

import { useState } from 'react'
import { Save, Eye, Image as ImageIcon } from 'lucide-react'

export default function AdminBlogPage() {
  const [post, setPost] = useState({
    title: '',
    category: 'Study Tips',
    content: '',
    excerpt: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Publishing post:', post)
    // TODO: Save to backend
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-2">
          Write Blog Post
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Share insights and updates with your students
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Post Title
          </label>
          <input
            type="text"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            placeholder="Enter an engaging title..."
            className="input-field text-2xl font-bold"
            required
          />
        </div>

        {/* Category & Featured Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={post.category}
              onChange={(e) => setPost({ ...post, category: e.target.value })}
              className="input-field"
            >
              <option>Study Tips</option>
              <option>Computer Science</option>
              <option>Career</option>
              <option>Algorithms</option>
              <option>Programming</option>
              <option>Announcements</option>
            </select>
          </div>

          <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Featured Image
            </label>
            <button
              type="button"
              className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-light dark:hover:border-primary-dark transition-colors duration-200 flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400"
            >
              <ImageIcon className="w-5 h-5" />
              <span>Upload Image</span>
            </button>
          </div>
        </div>

        {/* Excerpt */}
        <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Excerpt
          </label>
          <textarea
            value={post.excerpt}
            onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
            placeholder="Write a brief summary (appears in blog listing)..."
            rows={3}
            className="input-field resize-none"
            required
          />
        </div>

        {/* Content Editor */}
        <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Content
          </label>
          <textarea
            value={post.content}
            onChange={(e) => setPost({ ...post, content: e.target.value })}
            placeholder="Write your blog post content here..."
            rows={15}
            className="input-field resize-none font-mono"
            required
          />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Tip: Use Markdown for formatting (headings, lists, bold, italic, etc.)
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <Eye className="w-5 h-5" />
            <span>Preview</span>
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-primary-light dark:bg-primary-dark text-white rounded-lg font-medium hover:opacity-90 transition-opacity duration-200 flex items-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>Publish Post</span>
          </button>
        </div>
      </form>
    </div>
  )
}
