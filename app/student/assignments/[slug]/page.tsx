'use client'

import { useState, useEffect } from 'react'
import { FileText, Calendar, Clock, ArrowLeft, Upload, File, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getAssignmentById, submitAssignment, getStudentSubmission } from '@/packages/supabase/src/assignments'
import { getAllDepartments } from '@/packages/supabase/src/helpers'
import { uploadMaterial, getMaterialUrl, STORAGE_BUCKETS } from '@/packages/supabase/src/storage'
import { useAuth } from '@/lib/auth-context'
import Button from '@/components/Button'

export default function AssignmentDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const slug = params.slug
  
  const { user, profile } = useAuth()
  const [assignment, setAssignment] = useState<any>(null)
  const [existingSubmission, setExistingSubmission] = useState<any>(null)
  const [departments, setDepartments] = useState<any[]>([])
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const data = await getAllDepartments()
        setDepartments(data || [])
      } catch (err) {
        console.error('Error fetching departments:', err)
      }
    }
    fetchDepartments()
  }, [])

  useEffect(() => {
    if (profile?.department_id) {
      setSelectedDepartmentId(profile.department_id)
    }
  }, [profile])

  useEffect(() => {
    async function fetchData() {
      if (!slug) return
      setLoading(true)
      try {
        const data = await getAssignmentById(slug as string)
        if (data) {
          setAssignment(data)
          if (user) {
            const sub = await getStudentSubmission(data.id, user.id)
            setExistingSubmission(sub)
            if (sub) setSubmitted(true)
          }
        } else {
          setError('Assignment not found')
        }
      } catch (err) {
        console.error('Error fetching assignment:', err)
        setError('Failed to load assignment')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [slug, user])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB')
        setFile(null)
      } else {
        setError(null)
        setFile(selectedFile)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !user || !assignment) return
    
    setSubmitting(true)
    setError(null)
    
    try {
      // 1. Upload file to storage
      const fileName = `${user.id}_${Date.now()}_${file.name}`
      const filePath = `${assignment.id}/${fileName}`
      
      await uploadMaterial('SUBMISSIONS', filePath, file)
      const fileUrl = getMaterialUrl('SUBMISSIONS', filePath)
      
      // 2. Save submission record
      await submitAssignment(assignment.id, user.id, {
        file_url: fileUrl,
        file_name: file.name,
        file_size: file.size,
        department_id: selectedDepartmentId
      })
      
      setSubmitted(true)
    } catch (err: any) {
      console.error('Submission error:', err)
      setError(err.message || 'Failed to submit assignment')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light"></div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in max-w-5xl mx-auto px-4 py-12">
      {/* Back Navigation */}
      <div className="mb-12">
        <Link 
          href="/student/assignments"
          className="group inline-flex items-center gap-2 text-gray-400 hover:text-primary-light transition-all font-black uppercase text-[10px] tracking-[0.2em]"
        >
          <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 group-hover:bg-primary-light group-hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back to Assignments
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Main Content (Blog Style) */}
        <div className="lg:col-span-8">
          <header className="mb-12 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
               <span className="px-3 py-1 bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark text-[10px] font-black rounded uppercase tracking-widest border border-primary-light/20">
                  {assignment.level}
               </span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  {assignment.due_date ? 'Active' : 'No Limit'} 
                </span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black mb-6 tracking-tighter uppercase leading-none">
              {assignment.title}
            </h1>

            <div className="flex items-center gap-4 py-8 border-y border-gray-100 dark:border-gray-800">
               <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
                  <img 
                    src="/6035008313579212003.jpg" 
                    alt="Sir Sudum" 
                    className="w-full h-full object-cover"
                  />
               </div>
               <div>
                  <p className="text-sm font-black text-text-light dark:text-text-dark">
                    Sir Sudum
                  </p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Master Educator</p>
               </div>
               <div className="ml-auto hidden sm:flex flex-col items-end">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Deadline</p>
                  <p className="text-sm font-black text-primary-light">
                    {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : 'N/A'}
                  </p>
               </div>
            </div>
          </header>

          <div className="assignment-content prose prose-lg dark:prose-invert max-w-none 
            prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-text-light dark:prose-headings:text-text-dark
            prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-p:leading-relaxed prose-p:text-base
            prose-li:text-gray-600 dark:prose-li:text-gray-400 prose-li:text-base
            prose-strong:text-text-light dark:prose-strong:text-text-dark prose-strong:font-black
            font-medium
          ">
            <div dangerouslySetInnerHTML={{ __html: assignment.description || 'No instructions provided.' }} />
          </div>
        </div>

        {/* Sticky Submission Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 space-y-8">
            <section className="bg-white dark:bg-subtle-dark rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
              <div className="mb-8">
                <h2 className="text-2xl font-black text-text-light dark:text-text-dark mb-8 tracking-tight uppercase">Briefing Details</h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">Ensure your work follows the guidelines provided in the overview.</p>
              </div>

              {submitted ? (
                <div className="py-8 text-center animate-scale-in">
                   <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 border border-green-500/20">
                      <CheckCircle2 className="w-10 h-10" />
                   </div>
                   <h3 className="text-xl font-black text-text-light dark:text-text-dark mb-2 uppercase">Task Logged</h3>
                   <p className="text-xs text-gray-500 font-medium mb-8">Your submission is secured and awaiting validation.</p>
                   <div className="w-full py-4 rounded-xl border-2 border-gray-100 dark:border-gray-800 text-gray-400 text-[10px] font-black uppercase tracking-widest pointer-events-none text-center">
                      Submission Finalized
                   </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Department Selection */}
                  <div className="space-y-2">
                    <label htmlFor="department" className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Your Department <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="department"
                        required
                        value={selectedDepartmentId}
                        onChange={(e) => setSelectedDepartmentId(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-light outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Select Department</option>
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                        <ChevronRight className="w-4 h-4 rotate-90" />
                      </div>
                    </div>
                  </div>

                  <div className="relative group">
                    <input
                      type="file"
                      id="assignment-file"
                      accept="application/pdf,image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className={`
                      border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-300
                      ${file ? 'border-primary-light bg-primary-light/5' : 'border-gray-100 dark:border-gray-800 hover:border-primary-light group-hover:bg-primary-light/5'}
                    `}>
                      {file ? (
                        <div className="flex flex-col items-center text-center">
                          <div className="w-12 h-12 bg-primary-light text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-primary-light/20">
                            <File className="w-6 h-6" />
                          </div>
                          <p className="text-xs font-black text-text-light dark:text-text-dark mb-1 line-clamp-1">{file.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-center">
                          <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 text-gray-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-white dark:group-hover:bg-gray-700 transition-all">
                            <Upload className="w-6 h-6" />
                          </div>
                          <p className="text-xs font-black text-text-light dark:text-text-dark mb-1 uppercase tracking-tight">Drop your file</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">PDF/IMG • 5MB MAX</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-red-600 font-bold text-[10px] uppercase tracking-widest p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    loading={submitting}
                    disabled={!file}
                    className="w-full py-5 rounded-2xl tracking-[0.25em]"
                  >
                    Submit Artifact <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              )}
            </section>

            <div className="glass-card rounded-3xl p-8 bg-black dark:bg-white text-white dark:text-black">
               <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-4 opacity-70">Need Help?</h3>
               <p className="text-sm font-medium leading-relaxed mb-6 opacity-90">If you're facing technical issues with the submission portal, contact IT support immediately so yrr.</p>
               <button className="text-[10px] font-black uppercase tracking-widest border-b-2 border-primary-light pb-1">Open Ticket</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
