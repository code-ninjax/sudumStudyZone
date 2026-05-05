'use client'

import { useState, useEffect } from 'react'
import { Plus, Loader2, ArrowLeft, Trash2, Building, CheckCircle2, XCircle } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/packages/supabase/src/client'
import Card from '@/components/Card'

type Department = {
  id: string
  name: string
  code: string | null
  faculty_id: string | null
  created_at: string
}

type Faculty = {
  id: string
  name: string
  code: string | null
}

export default function DepartmentsHub() {
  const [view, setView] = useState<'list' | 'form'>('list')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [departments, setDepartments] = useState<Department[]>([])
  const [faculties, setFaculties] = useState<Faculty[]>([])
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    faculty_id: '',
  })
  const [studentStats, setStudentStats] = useState<{[key: string]: number}>({})

  useEffect(() => {
    fetchFaculties()
    fetchDepartments()
    fetchStudentCounts()
  }, [])

  const fetchFaculties = async () => {
    try {
      const { data, error } = await supabase
        .from('faculties')
        .select('id, name, code')
        .order('name', { ascending: true })
      if (error) throw error
      setFaculties(data || [])
    } catch (err: any) {
      console.error('Error fetching faculties:', err.message)
    }
  }

  const fetchDepartments = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      setDepartments((data || []) as Department[])
    } catch (err: any) {
      console.error('Error fetching departments:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchStudentCounts = async () => {
    try {
      // Query profiles to count users per department_id
      const { data, error } = await supabase
        .from('profiles')
        .select('department_id')
      
      if (error) throw error

      const counts: {[key: string]: number} = {}
      data?.forEach((profile) => {
        if (profile.department_id) {
           counts[profile.department_id] = (counts[profile.department_id] || 0) + 1
        }
      })
      setStudentStats(counts)
    } catch (err) {
      console.error('Error fetching student counts:', err)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (!formData.faculty_id) {
        throw new Error('Please select a faculty for this department.')
      }
      const { error: dbError } = await supabase
        .from('departments')
        .insert([{
          name: formData.name,
          code: formData.code || null,
          faculty_id: formData.faculty_id,
        }])

      if (dbError) {
         if (dbError.code === '23505') {
            throw new Error(`A department with this name or code already exists.`)
         }
         throw dbError
      }

      setSuccess(true)
      await fetchDepartments()
      setTimeout(() => {
        setSuccess(false)
        setFormData({ name: '', code: '', faculty_id: '' })
        setView('list')
      }, 1500)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this department? Doing so will unlink any students and assignments associated with it.')) return

    try {
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', id)

      if (error) throw error
      setDepartments(departments.filter(d => d.id !== id))
    } catch (err: any) {
      alert('Error deleting department: ' + err.message)
    }
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
            Department <span className="text-primary-light">Hub</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-2">Manage the academic departments your platform supports.</p>
        </div>

        {view === 'list' && (
          <button 
            onClick={() => { setFormData({ name: '', code: '', faculty_id: '' }); setView('form') }}
            className="px-8 py-4 bg-primary-light text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary-light/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Plus className="w-4 h-4" />
            Create Department
          </button>
        )}
      </div>

      {view === 'list' ? (
        <div className="space-y-12">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-gray-400">
              <Loader2 className="w-10 h-10 animate-spin mb-4" />
              <p className="font-black uppercase tracking-widest text-[10px]">Scanning Departments...</p>
            </div>
          ) : departments.length === 0 ? (
            <Card className="py-20 text-center border-2 border-dashed border-gray-100 dark:border-gray-800">
               <Building className="w-12 h-12 text-gray-200 mx-auto mb-4" />
               <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No active departments found</p>
               <button 
                 onClick={() => setView('form')}
                 className="mt-6 text-primary-light font-black uppercase text-[10px] tracking-widest border-b-2 border-primary-light pb-1"
               >
                 Register First Department
               </button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map((dept) => {
                const faculty = faculties.find((fac) => fac.id === dept.faculty_id)
                return (
                  <DepartmentCard 
                    key={dept.id} 
                    department={dept} 
                    facultyName={faculty?.name || 'Unassigned'}
                    studentCount={studentStats[dept.id] || 0}
                    onDelete={handleDelete} 
                  />
                )
              })}
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
                Department Established!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 font-medium tracking-tight">The new department is now live and selectable by students.</p>
            </Card>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8 animate-slide-up">
              <Card className="p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                   <Building className="w-32 h-32" />
                </div>
                
                <div className="grid grid-cols-1 gap-8 relative z-10">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Faculty</label>
                    <div className="relative">
                      <Building className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        required
                        name="faculty_id"
                        value={formData.faculty_id}
                        onChange={handleChange}
                        className="w-full bg-gray-50 dark:bg-gray-800/30 rounded-[1.5rem] pl-14 pr-8 py-5 text-sm font-bold outline-none border-2 border-transparent focus:border-primary-light transition-all"
                      >
                        <option value="" disabled>Select faculty</option>
                        {faculties.map((faculty) => (
                          <option key={faculty.id} value={faculty.id}>
                            {faculty.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Department Name</label>
                    <div className="relative">
                      <Building className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Computer Science"
                        className="w-full bg-gray-50 dark:bg-gray-800/30 rounded-[1.5rem] pl-14 pr-8 py-5 text-sm font-bold outline-none border-2 border-transparent focus:border-primary-light transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Department Code (Optional)</label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      placeholder="e.g. CSC"
                      className="w-full bg-gray-50 dark:bg-gray-800/30 rounded-[1.5rem] px-8 py-5 text-sm font-bold outline-none border-2 border-transparent focus:border-primary-light transition-all"
                    />
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
                    Initializing Department...
                  </>
                ) : (
                  <>
                    <Building className="w-5 h-5" />
                    Register Department
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

function DepartmentCard({ 
  department, 
  facultyName,
  studentCount,
  onDelete 
}: { 
  department: Department,
  facultyName: string,
  studentCount: number,
  onDelete: (id: string) => void
}) {
  return (
    <Card className="group flex flex-col justify-between p-6 h-full border border-gray-100 dark:border-gray-800 hover:border-primary-light/30 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-light/5">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-white/5 text-gray-500">
            <Building className="w-5 h-5" />
          </div>
          <button 
            onClick={() => onDelete(department.id)}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white"
            title="Delete department"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <h3 className="font-black text-text-light dark:text-text-dark text-xl group-hover:text-primary-light transition-colors tracking-tight leading-tight mb-2 line-clamp-2">
          {department.name}
        </h3>
        
        <div className="flex flex-wrap gap-2 items-center">
          {facultyName && (
            <span className="inline-flex items-center px-2 py-1 text-[9px] font-black uppercase tracking-widest bg-gray-100 dark:bg-white/5 rounded text-gray-500">
              Faculty: {facultyName}
            </span>
          )}
          {department.code && (
            <span className="inline-block px-2 py-1 text-[9px] font-black uppercase tracking-widest bg-gray-100 dark:bg-white/5 rounded text-gray-500">
              Code: {department.code}
            </span>
          )}
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
         <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Total Students</span>
            <span className="text-sm font-bold text-text-light dark:text-text-dark">{studentCount} Registered</span>
         </div>
      </div>
    </Card>
  )
}
