'use client'

import { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, Library, Upload, X, Search, RefreshCw, FileText, ImageIcon } from 'lucide-react'
import { getAllEBooks, createEBook, deleteEBook } from '@/packages/supabase/src/ebooks'
import { uploadMaterial, getMaterialUrl } from '@/packages/supabase/src/storage'
import { DashboardSkeleton } from '@/components/SkeletonLoader'

export default function AdminEBooksPage() {
  const [ebooks, setEbooks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  const [newEBook, setNewEBook] = useState({
    title: '',
    author: '',
    category: 'Computer Science',
    pages: 0,
    description: '',
  })
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [ebookFile, setEbookFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)

  const coverInputRef = useRef<HTMLInputElement>(null)
  const ebookInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchEBooks()
  }, [])

  async function fetchEBooks() {
    setLoading(true)
    try {
      const data = await getAllEBooks()
      setEbooks(data || [])
    } catch (error) {
      console.error('Error fetching ebooks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setCoverPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!ebookFile) {
      alert('Please select an eBook file (PDF/EPUB)')
      return
    }

    setUploading(true)
    try {
      let coverUrl = ''
      let ebookUrl = ''

      // 1. Upload Cover Image if exists
      if (coverFile) {
        const coverPath = `covers/${Date.now()}-${coverFile.name}`
        await uploadMaterial('EBOOKS', coverPath, coverFile)
        coverUrl = getMaterialUrl('EBOOKS', coverPath)
      }

      // 2. Upload eBook File
      const ebookPath = `files/${Date.now()}-${ebookFile.name}`
      await uploadMaterial('EBOOKS', ebookPath, ebookFile)
      ebookUrl = getMaterialUrl('EBOOKS', ebookPath)

      // 3. Create Record
      await createEBook({
        title: newEBook.title,
        author: newEBook.author,
        category: newEBook.category,
        pages: newEBook.pages,
        cover_image_url: coverUrl,
        file_url: ebookUrl,
        description: newEBook.description,
      })

      setShowAddModal(false)
      fetchEBooks()
      // Reset
      setNewEBook({ title: '', author: '', category: 'Computer Science', pages: 0, description: '' })
      setCoverFile(null)
      setEbookFile(null)
      setCoverPreview(null)
    } catch (error) {
      alert('Failed to upload eBook')
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this eBook?')) return
    try {
      await deleteEBook(id)
      setEbooks(ebooks.filter(e => e.id !== id))
    } catch (error) {
      alert('Failed to delete eBook')
    }
  }

  if (loading) return <DashboardSkeleton />

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-text-light dark:text-text-dark tracking-tighter uppercase mb-2">
            eBook <span className="text-primary-light">Vault</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium italic">Manage the digital library and academic resources.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-8 py-4 bg-premium-gradient text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3"
        >
          <Plus className="w-5 h-5" />
          Deposit Resource
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-subtle-dark p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Volumes</p>
          <p className="text-4xl font-black text-text-light dark:text-text-dark">{ebooks.length}</p>
        </div>
        <div className="bg-white dark:bg-subtle-dark p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Pulls</p>
          <p className="text-4xl font-black text-text-light dark:text-text-dark">
            {ebooks.reduce((sum, eb) => sum + (eb.pulls || 0), 0)}
          </p>
        </div>
        <div className="bg-white dark:bg-subtle-dark p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Library Health</p>
          <p className="text-4xl font-black text-green-500 tracking-tighter">OPTIMAL</p>
        </div>
      </div>

      {/* eBooks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ebooks.map((ebook) => (
          <div key={ebook.id} className="group bg-white dark:bg-subtle-dark rounded-[2.5rem] border border-gray-100 dark:border-white/5 overflow-hidden hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
            <div className="h-48 relative overflow-hidden">
              {ebook.cover_image_url ? (
                <img src={ebook.cover_image_url} alt={ebook.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              ) : (
                <div className="w-full h-full bg-premium-gradient opacity-10 flex items-center justify-center">
                  <Library className="w-12 h-12 text-primary-light" />
                </div>
              )}
              <div className="absolute top-4 right-4 flex gap-2">
                <button 
                  onClick={() => handleDelete(ebook.id)}
                  className="p-3 bg-white/20 backdrop-blur-md text-white rounded-xl hover:bg-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-8">
              <span className="px-3 py-1 bg-primary-light/10 text-primary-light rounded-lg text-[8px] font-black uppercase tracking-widest mb-4 inline-block">
                {ebook.category || 'General'}
              </span>
              <h3 className="text-xl font-black text-text-light dark:text-text-dark mb-1 tracking-tight truncate">{ebook.title}</h3>
              <p className="text-xs text-gray-500 font-bold mb-4">by {ebook.author || 'Unknown'}</p>
              
              <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-white/5">
                <div>
                   <p className="text-lg font-black text-text-light dark:text-text-dark">{ebook.pulls}</p>
                   <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Pulls</p>
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{ebook.pages} Pages</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-subtle-dark w-full max-w-2xl rounded-[3rem] p-10 shadow-3xl animate-scale-in max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tighter">New Resource</h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Enter the details of the digital assets</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Book Title</label>
                  <input required className="w-full bg-gray-50 dark:bg-gray-800 border-0 rounded-xl px-5 py-4 font-bold text-sm focus:ring-2 focus:ring-primary-light transition-all" value={newEBook.title} onChange={e => setNewEBook({...newEBook, title: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Author Name</label>
                  <input required className="w-full bg-gray-50 dark:bg-gray-800 border-0 rounded-xl px-5 py-4 font-bold text-sm focus:ring-2 focus:ring-primary-light transition-all" value={newEBook.author} onChange={e => setNewEBook({...newEBook, author: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Category</label>
                  <select className="w-full bg-gray-50 dark:bg-gray-800 border-0 rounded-xl px-5 py-4 font-bold text-sm focus:ring-2 focus:ring-primary-light transition-all" value={newEBook.category} onChange={e => setNewEBook({...newEBook, category: e.target.value})}>
                    <option>Computer Science</option>
                    <option>Software Engineering</option>
                    <option>Mathematics</option>
                    <option>Physics</option>
                    <option>Career</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Page Count</label>
                  <input type="number" className="w-full bg-gray-50 dark:bg-gray-800 border-0 rounded-xl px-5 py-4 font-bold text-sm focus:ring-2 focus:ring-primary-light transition-all" value={newEBook.pages} onChange={e => setNewEBook({...newEBook, pages: parseInt(e.target.value)})} />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                {/* Cover Upload */}
                <div className="flex-1 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Cover Artwork</label>
                  <div 
                    onClick={() => coverInputRef.current?.click()}
                    className="h-32 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-100 dark:border-gray-700 flex items-center justify-center cursor-pointer hover:border-primary-light transition-all overflow-hidden"
                  >
                    {coverPreview ? (
                      <img src={coverPreview} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">Upload Image</p>
                      </div>
                    )}
                  </div>
                  <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
                </div>

                {/* File Upload */}
                <div className="flex-1 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Binary Resource (PDF/EPUB)</label>
                  <div 
                    onClick={() => ebookInputRef.current?.click()}
                    className="h-32 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-100 dark:border-gray-700 flex items-center justify-center cursor-pointer hover:border-primary-light transition-all"
                  >
                    {ebookFile ? (
                      <div className="text-center p-4">
                        <FileText className="w-6 h-6 text-primary-light mx-auto mb-2" />
                        <p className="text-[10px] font-bold text-text-light dark:text-text-dark truncate max-w-[150px]">{ebookFile.name}</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">Choose File</p>
                      </div>
                    )}
                  </div>
                  <input ref={ebookInputRef} type="file" accept=".pdf,.epub" className="hidden" onChange={(e) => setEbookFile(e.target.files?.[0] || null)} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Description / Synopsis</label>
                <textarea className="w-full bg-gray-50 dark:bg-gray-800 border-0 rounded-2xl px-5 py-4 font-medium text-sm focus:ring-2 focus:ring-primary-light transition-all min-h-[100px]" placeholder="Brief context about this resource..." value={newEBook.description} onChange={e => setNewEBook({...newEBook, description: e.target.value})} />
              </div>

              <button 
                type="submit"
                disabled={uploading}
                className="w-full py-5 bg-premium-gradient text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl hover:scale-[1.01] active:scale-95 transition-all mt-4 disabled:opacity-50"
              >
                {uploading ? <RefreshCw className="w-5 h-5 animate-spin mx-auto" /> : 'Log to Library'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
