'use client'

import { useState, useRef } from 'react'
import { Save, Image as ImageIcon, Upload, X, FileText } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { createBlogPost, getBlogCategories } from '@/packages/supabase/src/admin'
import { uploadMaterial, getMaterialUrl } from '@/packages/supabase/src/storage'
import { useEffect } from 'react'
import Link from 'next/link'
import Button from '@/components/Button'

export default function AdminBlogPage() {
  const { user, profile } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [fetchingCategories, setFetchingCategories] = useState(true)
  const [post, setPost] = useState({
    title: '',
    category: 'General',
    category_id: '',
    content: '',
    excerpt: '',
  })
  const [featuredImage, setFeaturedImage] = useState<File | null>(null)
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string | null>(null)
  const [attachment, setAttachment] = useState<File | null>(null)
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getBlogCategories()
        setCategories(data || [])
        if (data && data.length > 0) {
          setPost(prev => ({ 
            ...prev, 
            category: data[0].name,
            category_id: data[0].id 
          }))
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setFetchingCategories(false)
      }
    }
    fetchCategories()
  }, [])

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
        category_id: post.category_id,
        featured_image_url: featuredImageUrl,
        attachment_url: attachmentUrl,
        attachment_name: attachmentName,
        published: true,
      })

      alert('Blog post published successfully!')
      
      // Reset form
      setPost({
        title: '',
        category: categories[0]?.name || 'General',
        category_id: categories[0]?.id || '',
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
    <div className="animate-fade-in max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-text-light dark:text-text-dark mb-2 tracking-tight">
            Write Blog Post
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Share insights and updates with your students
          </p>
        </div>
        <Link 
          href="/admin/blog/manage"
          className="px-6 py-3 bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 rounded-xl font-black uppercase tracking-widest text-[10px] border border-gray-100 dark:border-white/5 hover:bg-gray-100 transition-all flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Manage Posts
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Title Card */}
        <div className="glass-card rounded-[2rem] p-8 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-light/30 to-transparent dark:via-primary-dark/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 block">
            Post Title
          </label>
          <input
            type="text"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            placeholder="Enter an engaging title..."
            className="w-full text-2xl md:text-3xl font-black text-text-light dark:text-text-dark bg-transparent border-none focus:outline-none focus:ring-0 placeholder-gray-300 dark:placeholder-gray-600"
            required
          />
        </div>

        {/* Category & Featured Image Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category */}
          <div className="glass-card rounded-[2rem] p-8">
            <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 block">
              Category
            </label>
            <select
              value={post.category_id}
              onChange={(e) => {
                const selectedCat = categories.find(c => c.id === e.target.value)
                setPost({ 
                  ...post, 
                  category_id: e.target.value,
                  category: selectedCat?.name || 'General'
                })
              }}
              className="w-full py-3 px-4 rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-light/20 dark:focus:ring-primary-dark/20 transition-all duration-300 font-medium"
            >
              {fetchingCategories ? (
                <option value="" className="bg-white dark:bg-gray-800 text-text-light dark:text-text-dark">Loading categories...</option>
              ) : (
                categories.map(cat => (
                  <option 
                    key={cat.id} 
                    value={cat.id}
                    className="bg-white dark:bg-gray-800 text-text-light dark:text-text-dark"
                  >
                    {cat.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Featured Image */}
          <div className="glass-card rounded-[2rem] p-8">
            <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 block">
              Featured Image
            </label>
            {featuredImagePreview ? (
              <div className="relative group/img">
                <img 
                  src={featuredImagePreview} 
                  alt="Featured preview" 
                  className="w-full h-40 object-cover rounded-2xl"
                />
                <button
                  type="button"
                  onClick={removeFeaturedImage}
                  className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover/img:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl hover:border-primary-light dark:hover:border-primary-dark transition-all duration-300 flex items-center justify-center gap-3 text-gray-400 hover:text-primary-light dark:hover:text-primary-dark group/btn"
              >
                <ImageIcon className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                <span className="font-bold">Upload Image</span>
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
        <div className="glass-card rounded-[2rem] p-8">
          <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 block">
            Excerpt
          </label>
          <textarea
            value={post.excerpt}
            onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
            placeholder="Write a brief summary (appears in blog listing)..."
            rows={3}
            className="w-full py-3 px-4 rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-light/20 dark:focus:ring-primary-dark/20 transition-all duration-300 resize-none"
            required
          />
        </div>

        {/* Content Editor */}
        <div className="glass-card rounded-[2rem] p-8">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              Content
            </label>
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Supports Markdown</span>
          </div>
          <textarea
            value={post.content}
            onChange={(e) => setPost({ ...post, content: e.target.value })}
            placeholder="Write your blog post content here..."
            rows={18}
            className="w-full py-4 px-5 rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-light/20 dark:focus:ring-primary-dark/20 transition-all duration-300 resize-none font-mono text-sm leading-relaxed"
            required
          />
        </div>

        {/* Attachment Upload */}
        <div className="glass-card rounded-[2rem] p-8">
          <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 block">
            Attachment (Optional)
          </label>
          {attachmentPreview ? (
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-light/10 dark:bg-primary-dark/10 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary-light dark:text-primary-dark" />
                </div>
                <span className="text-text-light dark:text-text-dark font-medium truncate">{attachmentPreview}</span>
              </div>
              <button
                type="button"
                onClick={removeAttachment}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl hover:border-primary-light dark:hover:border-primary-dark transition-all duration-300 flex items-center justify-center gap-3 text-gray-400 hover:text-primary-light dark:hover:text-primary-dark group/btn"
            >
              <Upload className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
              <span className="font-bold">Upload File</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleAttachmentUpload}
            className="hidden"
          />
        </div>

        {/* Publish Button */}
        <div className="flex items-center justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-10 py-4 bg-primary-light dark:bg-primary-dark text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary-light/25 dark:shadow-primary-dark/10 hover:shadow-primary-light/40 dark:hover:shadow-primary-dark/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center gap-3 disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Publish Post</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
