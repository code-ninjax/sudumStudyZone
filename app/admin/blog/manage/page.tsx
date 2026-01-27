'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, FileText, ArrowLeft, Search, Filter, Eye, EyeOff, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { getAllBlogPosts, deleteBlogPost, updateBlogPost } from '@/packages/supabase/src/admin'
import { DashboardSkeleton } from '@/components/SkeletonLoader'

export default function AdminBlogManagePage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    setLoading(true)
    try {
      const data = await getAllBlogPosts(true) // includeDrafts = true
      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this post?')) return
    try {
      await deleteBlogPost(id)
      setPosts(posts.filter(p => p.id !== id))
    } catch (error) {
      alert('Failed to delete post')
    }
  }

  async function togglePublish(post: any) {
    try {
      await updateBlogPost(post.id, { published: !post.published })
      setPosts(posts.map(p => p.id === post.id ? { ...p, published: !p.published } : p))
    } catch (error) {
      alert('Failed to update status')
    }
  }

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) return <DashboardSkeleton />

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <Link href="/admin/blog" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">
               <ArrowLeft className="w-5 h-5 text-gray-400" />
             </Link>
             <h1 className="text-4xl font-black text-text-light dark:text-text-dark tracking-tighter uppercase">
               Blog <span className="text-primary-light">Management</span>
             </h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium italic pl-12">Review, edit, or archive your intellectual stream.</p>
        </div>
        <Link 
          href="/admin/blog"
          className="px-8 py-4 bg-premium-gradient text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3"
        >
          <Plus className="w-5 h-5" />
          Write New Post
        </Link>
      </div>

      {/* Search & Stats */}
      <div className="flex flex-col lg:flex-row gap-6 mb-10">
        <div className="relative flex-1">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            className="w-full bg-white dark:bg-subtle-dark border border-gray-100 dark:border-white/5 rounded-[1.5rem] pl-16 pr-6 py-5 font-bold text-sm focus:ring-2 focus:ring-primary-light transition-all shadow-sm"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
           <div className="px-8 py-5 bg-white dark:bg-subtle-dark border border-gray-100 dark:border-white/5 rounded-[1.5rem] flex items-center gap-4 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Posts</p>
              <p className="text-xl font-black">{posts.length}</p>
           </div>
           <div className="px-8 py-5 bg-white dark:bg-subtle-dark border border-gray-100 dark:border-white/5 rounded-[1.5rem] flex items-center gap-4 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Published</p>
              <p className="text-xl font-black text-green-500">{posts.filter(p => p.published).length}</p>
           </div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white dark:bg-subtle-dark rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-50 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Article</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Category</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Created</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-white/5">
            {filteredPosts.map((post) => (
              <tr key={post.id} className="group hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    {post.featured_image_url ? (
                      <img src={post.featured_image_url} className="w-12 h-12 rounded-xl object-cover" />
                    ) : (
                      <div className="w-12 h-12 bg-primary-light/10 text-primary-light rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-sm text-text-light dark:text-text-dark line-clamp-1">{post.title}</p>
                      <p className="text-[10px] text-gray-400 font-medium">/{post.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-[10px] font-black uppercase tracking-widest rounded-lg text-gray-500">
                    {post.category}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <button 
                    onClick={() => togglePublish(post)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                      post.published 
                        ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                        : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                    }`}
                  >
                    {post.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {post.published ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {new Date(post.created_at).toLocaleDateString()}
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all text-gray-400 hover:text-primary-light">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(post.id)}
                      className="p-3 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredPosts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No posts found</p>
          </div>
        )}
      </div>
    </div>
  )
}
