'use client'

import { useState, useRef } from 'react'
import { Save, Image as ImageIcon, Upload, X, FileText } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { createBlogPost } from '@/packages/supabase/src/admin'
import { uploadMaterial, getMaterialUrl } from '@/packages/supabase/src/storage'

export default function AdminBlogPage() {
  const { user, profile } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  
  const [loading, setLoading] = useState(false)
  const [post, setPost] = useState({
    title: '',
    category: 'Study Tips',
    content: '',
    excerpt: '',
  })
  const [featuredImage, setFeaturedImage] = useState<File | null>(null)
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string | null>(null)
  const [attachment, setAttachment] = useState<File | null>(null)
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null)

  // Generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFeaturedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setFeaturedImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAttachmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAttachment(file)
      setAttachmentPreview(file.name)
    }
  }

  const removeFeaturedImage = () => {
    setFeaturedImage(null)
    setFeaturedImagePreview(null)
    if (imageInputRef.current) {
      imageInputRef.current.value = ''
    }
  }

  const removeAttachment = () => {
    setAttachment(null)
    setAttachmentPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !profile || profile.role !== 'admin') {
      alert('You must be an admin to create blog posts')
      return
    }

    setLoading(true)

    try {
      const slug = generateSlug(post.title)
      let featuredImageUrl: string | undefined = undefined
      let attachmentUrl: string | undefined = undefined
      let attachmentName: string | undefined = undefined

      // Upload featured image if provided
      if (featuredImage) {
        const timestamp = Date.now()
        const imagePath = `blog-images/${timestamp}-${featuredImage.name}`
        await uploadMaterial('MATERIALS', imagePath, featuredImage)
        featuredImageUrl = getMaterialUrl('MATERIALS', imagePath)
      }

      // Upload attachment if provided
      if (attachment) {
        const timestamp = Date.now()
        const attachmentPath = `blog-attachments/${timestamp}-${attachment.name}`
        await uploadMaterial('MATERIALS', attachmentPath, attachment)
        attachmentUrl = getMaterialUrl('MATERIALS', attachmentPath)
        attachmentName = attachment.name
      }

      // Create blog post
      await createBlogPost(user.id, {
        title: post.title,
        slug,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        featured_image_url: featuredImageUrl,
        attachment_url: attachmentUrl,
        attachment_name: attachmentName,
        published: true,
      })

      alert('Blog post published successfully!')
      
      // Reset form
      setPost({
        title: '',
        category: 'Study Tips',
        content: '',
        excerpt: '',
      })
      setFeaturedImage(null)
      setFeaturedImagePreview(null)
      setAttachment(null)
      setAttachmentPreview(null)
    } catch (error: any) {
      console.error('Error creating blog post:', error)
      alert(`Error creating blog post: ${error.message || 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
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
            {featuredImagePreview ? (
              <div className="relative">
                <img 
                  src={featuredImagePreview} 
                  alt="Featured preview" 
                  className="w-full h-48 object-cover rounded-lg mb-2"
                />
                <button
                  type="button"
                  onClick={removeFeaturedImage}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-light dark:hover:border-primary-dark transition-colors duration-200 flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400"
              >
                <ImageIcon className="w-5 h-5" />
                <span>Upload Image</span>
              </button>
            )}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
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

        {/* Attachment Upload */}
        <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Attachment File (Optional)
          </label>
          {attachmentPreview ? (
            <div className="flex items-center justify-between p-4 bg-subtle-light dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-primary-light dark:text-primary-dark" />
                <span className="text-text-light dark:text-text-dark">{attachmentPreview}</span>
              </div>
              <button
                type="button"
                onClick={removeAttachment}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-light dark:hover:border-primary-dark transition-colors duration-200 flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400"
            >
              <Upload className="w-5 h-5" />
              <span>Upload Attachment</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleAttachmentUpload}
            className="hidden"
          />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Attach PDF, documents, or other files to your blog post
          </p>
        </div>

        {/* Publish Button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-primary-light dark:bg-primary-dark text-white rounded-lg font-medium hover:opacity-90 transition-opacity duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            <span>{loading ? 'Publishing...' : 'Publish Post'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
