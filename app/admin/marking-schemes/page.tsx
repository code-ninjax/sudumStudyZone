'use client'

import { useState, useEffect, useRef } from 'react'
import { Plus, Loader2, ArrowLeft, Trash2, FileText, Download, XCircle, FileUp, UploadCloud, CheckCircle2, Edit } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/packages/supabase/src/client'
import Card from '@/components/Card'

// Type definition for marking scheme
type MarkingScheme = {
  id: string
  title: string
  course_code: string | null
  file_url: string
  created_at: string
}

export default function MarkingSchemesHub() {
  const [view, setView] = useState<'list' | 'form'>('list')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [schemes, setSchemes] = useState<MarkingScheme[]>([])
  const [editScheme, setEditScheme] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    course_code: '',
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchSchemes()
  }, [])

  const fetchSchemes = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('marking_schemes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setSchemes(data || [])
    } catch (err: any) {
      console.error('Error fetching marking schemes:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editScheme && !selectedFile) {
      alert("Please select a file to upload.")
      return
    }

    setSubmitting(true)

    try {
      let publicUrl = ''

      // 1. Upload new file if selected
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('marking-schemes')
          .upload(filePath, selectedFile)

        if (uploadError) {
          throw new Error(`Upload failed: ${uploadError.message}. Make sure the 'marking-schemes' storage bucket exists and is public.`)
        }

        const { data } = supabase.storage
          .from('marking-schemes')
          .getPublicUrl(filePath)
        
        publicUrl = data.publicUrl
      }

      // 3. Save or Update database
      if (editScheme) {
        const updateData: any = {
           title: formData.title,
           course_code: formData.course_code || null,
        }
        if (publicUrl) updateData.file_url = publicUrl

        const { error: dbError } = await supabase
          .from('marking_schemes')
          .update(updateData)
          .eq('id', editScheme)

        if (dbError) throw dbError
      } else {
        const { error: dbError } = await supabase
          .from('marking_schemes')
          .insert([{
            title: formData.title,
            course_code: formData.course_code || null,
            file_url: publicUrl,
          }])

        if (dbError) throw dbError
      }

      setSuccess(true)
      await fetchSchemes()
      setTimeout(() => {
        setSuccess(false)
        resetForm()
        setView('list')
      }, 1500)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string, fileUrl: string) => {
    if (!confirm('Are you sure you want to delete this marking scheme? This action is permanent.')) return

    try {
      // Extract file path from URL (naive approach, assumes URL ends with /bucket/path)
      const urlParts = fileUrl.split('/')
      const fileName = urlParts[urlParts.length - 1]
      
      // Attempt to delete the file from storage
      await supabase.storage
        .from('marking-schemes')
        .remove([fileName])

      // Delete the record from DB
      const { error } = await supabase
        .from('marking_schemes')
        .delete()
        .eq('id', id)

      if (error) throw error
      setSchemes(schemes.filter(s => s.id !== id))
    } catch (err: any) {
      alert('Error deleting marking scheme: ' + err.message)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      course_code: '',
    })
    setSelectedFile(null)
    setEditScheme(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleEdit = (scheme: MarkingScheme) => {
    setFormData({
       title: scheme.title,
       course_code: scheme.course_code || '',
    })
    setEditScheme(scheme.id)
    setSelectedFile(null)
    setView('form')
  }

  return (
    <div className="animate-fade-in max-w-6xl mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <Link 
            href="/admin" 
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary-light mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Command Station
          </Link>
          <h1 className="text-4xl font-black text-text-light dark:text-text-dark tracking-tighter uppercase leading-none">
            Marking <span className="text-primary-light">Schemes</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-2">Manage official grading rubrics and marking templates.</p>
        </div>

        {view === 'list' && (
          <button 
            onClick={() => { resetForm(); setView('form') }}
            className="px-8 py-4 bg-primary-light text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary-light/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Plus className="w-4 h-4" />
            Upload New Scheme
          </button>
        )}
      </div>

      {view === 'list' ? (
        <div className="space-y-12">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-gray-400">
              <Loader2 className="w-10 h-10 animate-spin mb-4" />
              <p className="font-black uppercase tracking-widest text-[10px]">Scanning Archives...</p>
            </div>
          ) : schemes.length === 0 ? (
            <Card className="py-20 text-center border-2 border-dashed border-gray-100 dark:border-gray-800">
               <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
               <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No marking schemes available</p>
               <button 
                 onClick={() => setView('form')}
                 className="mt-6 text-primary-light font-black uppercase text-[10px] tracking-widest border-b-2 border-primary-light pb-1"
               >
                 Upload First Document
               </button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schemes.map((scheme) => (
                <SchemeCard 
                  key={scheme.id} 
                  scheme={scheme} 
                  onEdit={handleEdit}
                  onDelete={handleDelete} 
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
             <button 
               onClick={() => setView('list')}
               className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-text-light flex items-center gap-2 transition-colors"
             >
               <XCircle className="w-4 h-4" /> Cancel Operation
             </button>
          </div>

          {success ? (
            <Card className="text-center py-20 bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800 animate-scale-in">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-10 h-10" strokeWidth={3} />
                </div>
              </div>
              <h2 className="text-2xl font-black text-text-light dark:text-text-dark uppercase tracking-tight mb-2">
                {editScheme ? 'Document Updated!' : 'Document Uploaded!'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 font-medium tracking-tight">The marking scheme has been securely archived.</p>
            </Card>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8 animate-slide-up">
              <Card className="p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                   <FileText className="w-32 h-32" />
                </div>
                
                <div className="grid grid-cols-1 gap-8 relative z-10">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Document Title</label>
                    <div className="relative">
                      <FileText className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        required
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Mid-Term Exam Rubric"
                        className="w-full bg-gray-50 dark:bg-gray-800/30 rounded-[1.5rem] pl-14 pr-8 py-5 text-sm font-bold outline-none border-2 border-transparent focus:border-primary-light transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Course Code (Optional)</label>
                    <input
                      type="text"
                      name="course_code"
                      value={formData.course_code}
                      onChange={handleChange}
                      placeholder="e.g. ENG 201"
                      className="w-full bg-gray-50 dark:bg-gray-800/30 rounded-[1.5rem] px-8 py-5 text-sm font-bold outline-none border-2 border-transparent focus:border-primary-light transition-all"
                    />
                  </div>

                  {/* File Upload Section */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Document File (PDF, DOCX)</label>
                    <div className="relative">
                      <input
                        required
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        id="file-upload"
                      />
                      <label 
                        htmlFor="file-upload"
                        className={`w-full flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-[1.5rem] cursor-pointer transition-all ${
                          selectedFile 
                            ? 'border-primary-light bg-primary-light/5' 
                            : 'border-gray-200 dark:border-gray-800 hover:border-primary-light hover:bg-gray-50 dark:hover:bg-white/5'
                        }`}
                      >
                        {selectedFile ? (
                          <>
                            <FileUp className="w-10 h-10 text-primary-light mb-4" />
                            <p className="text-sm font-bold text-text-light dark:text-text-dark">{selectedFile.name}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB — Click to Change
                            </p>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="w-10 h-10 text-gray-400 mb-4" />
                            <p className="text-sm font-bold text-text-light dark:text-text-dark mb-1">Select a file to upload</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                              {editScheme ? 'Leave empty to keep existing file' : 'PDF, DOC, DOCX up to 10MB'}
                            </p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              </Card>

              <button
                disabled={submitting}
                type="submit"
                className="w-full py-6 bg-primary-light text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs shadow-2xl shadow-primary-light/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:scale-100"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Uploading Document...
                  </>
                ) : (
                  <>
                    <FileUp className="w-5 h-5" />
                    {editScheme ? 'Update Marking Scheme' : 'Archive Marking Scheme'}
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  )
}

function SchemeCard({ 
  scheme,
  onEdit, 
  onDelete 
}: { 
  scheme: MarkingScheme,
  onEdit: (scheme: MarkingScheme) => void, 
  onDelete: (id: string, url: string) => void
}) {
  return (
    <Card className="group flex flex-col justify-between p-6 h-full border border-gray-100 dark:border-gray-800 hover:border-primary-light/30 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-light/5">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-white/5 text-gray-500">
            <FileText className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-2">
             <button 
               onClick={() => onEdit(scheme)}
               className="w-8 h-8 rounded-lg flex items-center justify-center transition-all bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-text-light dark:hover:text-text-dark"
               title="Edit marking scheme"
             >
               <Edit className="w-3.5 h-3.5" />
             </button>
             <button 
               onClick={() => onDelete(scheme.id, scheme.file_url)}
               className="w-8 h-8 rounded-lg flex items-center justify-center transition-all bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white"
               title="Delete marking scheme"
             >
               <Trash2 className="w-3.5 h-3.5" />
             </button>
          </div>
        </div>

        <h3 className="font-black text-text-light dark:text-text-dark text-lg group-hover:text-primary-light transition-colors tracking-tight leading-tight mb-2 line-clamp-2">
          {scheme.title}
        </h3>
        {scheme.course_code && (
          <span className="inline-block px-2 text-[9px] font-black uppercase tracking-widest bg-gray-100 dark:bg-white/5 rounded text-gray-500">
            {scheme.course_code}
          </span>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
          {new Date(scheme.created_at).toLocaleDateString()}
        </p>
        <a 
          href={scheme.file_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-primary-light hover:underline"
        >
          View Doc <Download className="w-3 h-3" />
        </a>
      </div>
    </Card>
  )
}
