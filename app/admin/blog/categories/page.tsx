'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Tag, ArrowLeft, RefreshCw, Edit2, X, Check } from 'lucide-react'
import Link from 'next/link'
import { getBlogCategories, createBlogCategory, deleteBlogCategory, updateBlogCategory } from '@/packages/supabase/src/admin'
import { DashboardSkeleton } from '@/components/SkeletonLoader'

export default function BlogCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newCategory, setNewCategory] = useState({ name: '' })
  const [creating, setCreating] = useState(false)
  
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    setLoading(true)
    try {
      const data = await getBlogCategories()
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newCategory.name.trim()) return
    
    setCreating(true)
    try {
      const slug = generateSlug(newCategory.name)
      await createBlogCategory(newCategory.name, slug)
      setNewCategory({ name: '' })
      fetchCategories()
    } catch (error) {
      alert('Failed to create category. It might already exist.')
    } finally {
      setCreating(false)
    }
  }

  async function handleUpdate(id: string) {
    if (!editName.trim()) return
    setUpdating(true)
    try {
      const slug = generateSlug(editName)
      await updateBlogCategory(id, editName, slug)
      setEditingId(null)
      fetchCategories()
    } catch (error) {
      alert('Failed to update category')
    } finally {
      setUpdating(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this category? This might affect blog posts using it.')) return
    
    try {
      await deleteBlogCategory(id)
      setCategories(categories.filter(c => c.id !== id))
    } catch (error) {
      alert('Failed to delete category')
    }
  }

  if (loading) return <DashboardSkeleton />

  return (
    <div className="animate-fade-in max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-text-light dark:text-text-dark tracking-tighter uppercase mb-1">
              Blog <span className="text-primary-light">Categories</span>
            </h1>
            <p className="text-xs text-gray-500 font-medium tracking-tight">Organize your insights and updates.</p>
          </div>
        </div>
        <button 
          onClick={() => fetchCategories()}
          className="p-3 text-gray-400 hover:text-primary-light transition-all"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Create Form */}
        <div className="md:col-span-12 lg:col-span-4">
          <div className="bg-white dark:bg-subtle-dark rounded-[2rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm sticky top-8">
            <h2 className="text-lg font-black uppercase tracking-tight mb-6">New Category</h2>
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Category Name</label>
                <input 
                  required
                  className="w-full bg-gray-50 dark:bg-gray-800 border-0 rounded-xl px-5 py-4 font-bold text-sm focus:ring-2 focus:ring-primary-light transition-all"
                  placeholder="e.g. Research Ethics"
                  value={newCategory.name}
                  onChange={e => setNewCategory({ name: e.target.value })}
                />
              </div>
              <button 
                type="submit"
                disabled={creating}
                className="w-full py-4 bg-premium-gradient text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {creating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Create Category
              </button>
            </form>
          </div>
        </div>

        {/* Categories List */}
        <div className="md:col-span-12 lg:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.length === 0 ? (
              <div className="col-span-full py-20 text-center glass-card rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800">
                <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No categories assigned yet</p>
              </div>
            ) : (
              categories.map((category) => (
                <div key={category.id} className="group bg-white dark:bg-subtle-dark p-6 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between hover:shadow-lg transition-all">
                  {editingId === category.id ? (
                    <div className="flex-1 flex items-center gap-2">
                       <input 
                        autoFocus
                        className="flex-1 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg px-3 py-2 font-bold text-xs focus:ring-2 focus:ring-primary-light transition-all"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleUpdate(category.id)}
                      />
                      <button onClick={() => handleUpdate(category.id)} disabled={updating} className="p-2 bg-green-500 text-white rounded-lg">
                        <Check className="w-3 h-3" />
                      </button>
                      <button onClick={() => setEditingId(null)} className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-500 rounded-lg">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary-light/10 text-primary-light rounded-xl flex items-center justify-center">
                          <Tag className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-text-light dark:text-text-dark">{category.name}</p>
                          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">/{category.slug}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            setEditingId(category.id)
                            setEditName(category.name)
                          }}
                          className="p-2 text-gray-300 hover:text-primary-light hover:bg-primary-light/10 rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(category.id)}
                          className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
