'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/packages/supabase/src/client'
import type { Profile } from '@/packages/supabase/src/types'
import { User, Hash, Building2, GraduationCap, Save, AlertCircle, CheckCircle, LogOut, Camera, ShieldCheck, Calendar, Activity, Layers3 } from 'lucide-react'
import { DashboardSkeleton } from '@/components/SkeletonLoader'

export default function StudentProfilePage() {
  const router = useRouter()
  const { user, loading: authLoading, signOut } = useAuth()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    matricNumber: '',
    faculty_id: '',
    department_id: '',
    level: '',
  })
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [departments, setDepartments] = useState<{id: string, name: string, faculty_id: string}[]>([])
  const [faculties, setFaculties] = useState<{id: string, name: string}[]>([])

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) {
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (fetchError) throw fetchError

        if (data) {
          setProfile(data as Profile)
          setFormData({
            fullName: data.full_name || '',
            email: user?.email || '',
            matricNumber: data.matric_number || '',
            faculty_id: data.faculty_id || '',
            department_id: data.department_id || '',
            level: data.level || '',
          })
        }
      } catch (err) {
        console.error('Error loading profile:', err)
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading && user) {
      loadProfile()
    } else if (!authLoading && !user) {
      setLoading(false)
    }
  }, [user, authLoading])

  useEffect(() => {
    const fetchData = async () => {
      const { data: depsData } = await supabase.from('departments').select('id, name, faculty_id').order('name')
      if (depsData) setDepartments(depsData)
      
      const { data: facsData } = await supabase.from('faculties').select('id, name').order('name')
      if (facsData) setFaculties(facsData)
    }
    fetchData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name === 'faculty_id') {
      setFormData((current) => ({
        ...current,
        [name]: value,
        department_id: '',
      }))
    } else {
      setFormData((current) => ({
        ...current,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setSaving(true)

    try {
      if (!user?.id) throw new Error('User not authenticated')

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          matric_number: formData.matricNumber,
          faculty_id: formData.faculty_id || null,
          department_id: formData.department_id || null,
          level: formData.level,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (profileError) throw profileError

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || loading) return <DashboardSkeleton />

  const initials = (formData.fullName || 'ST')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('')

  return (
    <div className="animate-fade-in max-w-6xl mx-auto px-4 py-8">
      {/* Premium Hero Section */}
      <div className="relative mb-12 bg-premium-gradient rounded-[3rem] p-12 sm:p-16 text-white shadow-3xl overflow-hidden group">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px] -mr-72 -mt-72 transition-transform duration-1000 group-hover:scale-110"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-[100px] -ml-40 -mb-40"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="relative">
            <div className="w-40 h-40 rounded-[2.5rem] bg-white/20 backdrop-blur-md flex items-center justify-center text-6xl font-black border-4 border-white/30 text-white shadow-2xl relative overflow-hidden transform hover:rotate-3 transition-transform duration-500">
              {initials}
            </div>
            <button className="absolute -bottom-4 -right-4 w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center text-black shadow-xl hover:scale-110 active:scale-95 transition-all border-4 border-primary-light">
              <Camera className="w-5 h-5" />
            </button>
          </div>
          
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-white/30">
              <ShieldCheck className="w-3 h-3 text-green-400" />
              Verified Profile
            </div>
            <h1 className="text-4xl sm:text-5xl font-black mb-3 tracking-tighter uppercase leading-none">
              {formData.fullName || 'User Profile'}
            </h1>
            <p className="text-lg opacity-80 font-medium tracking-tight mb-8">
              {formData.email} • <span className="text-yellow-300">Level {formData.level || '--'}</span>
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 flex items-center gap-3">
                <Calendar className="w-4 h-4 text-blue-300" />
                <span className="text-[10px] font-black uppercase tracking-widest">Joined {profile?.created_at ? new Date(profile.created_at).getFullYear() : '--'}</span>
              </div>
              <div className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 flex items-center gap-3">
                <Activity className="w-4 h-4 text-green-300" />
                <span className="text-[10px] font-black uppercase tracking-widest">Academic Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Form Area */}
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-subtle-dark rounded-[2.5rem] p-10 border border-gray-100 dark:border-white/5 shadow-sm">
            <h2 className="text-xl font-black uppercase tracking-tight mb-10">Personal Information</h2>
            
            {error && (
              <div className="mb-8 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-500 animate-fade-in">
                <AlertCircle className="w-6 h-6" />
                <p className="text-sm font-bold">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-8 p-6 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-4 text-green-500 animate-fade-in">
                <CheckCircle className="w-6 h-6" />
                <p className="text-sm font-bold">Log entries updated successfully!</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-light transition-colors" />
                    <input 
                      required 
                      className="w-full bg-gray-50/50 dark:bg-gray-800/50 border-0 rounded-2xl pl-14 pr-6 py-5 font-bold text-sm focus:ring-2 focus:ring-primary-light transition-all" 
                      value={formData.fullName} 
                      onChange={e => setFormData({...formData, fullName: e.target.value})} 
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Matric Number</label>
                  <div className="relative group">
                    <Hash className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-light transition-colors" />
                    <input 
                      className="w-full bg-gray-50/50 dark:bg-gray-800/50 border-0 rounded-2xl pl-14 pr-6 py-5 font-bold text-sm focus:ring-2 focus:ring-primary-light transition-all" 
                      value={formData.matricNumber} 
                      onChange={e => setFormData({...formData, matricNumber: e.target.value})} 
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Faculty</label>
                  <div className="relative group">
                    <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-light transition-colors" />
                    <select
                      name="faculty_id"
                      value={formData.faculty_id}
                      onChange={handleChange}
                      className="w-full appearance-none bg-gray-50/50 dark:bg-gray-800/50 border-0 rounded-2xl pl-14 pr-6 py-5 font-bold text-sm focus:ring-2 focus:ring-primary-light transition-all"
                    >
                      <option value="" disabled>Select a faculty</option>
                      {faculties.map((fac) => (
                        <option key={fac.id} value={fac.id}>
                          {fac.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Department</label>
                  <div className="relative group">
                    <GraduationCap className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-light transition-colors" />
                    <select
                      name="department_id"
                      value={formData.department_id}
                      onChange={handleChange}
                      disabled={!formData.faculty_id}
                      className="w-full appearance-none bg-gray-50/50 dark:bg-gray-800/50 border-0 rounded-2xl pl-14 pr-6 py-5 font-bold text-sm focus:ring-2 focus:ring-primary-light transition-all disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <option value="" disabled>
                        {formData.faculty_id ? 'Select a department' : 'Select a faculty first'}
                      </option>
                      {departments
                        .filter((dept) => dept.faculty_id === formData.faculty_id)
                        .map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Level</label>
                <div className="relative group">
                  <Layers3 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-light transition-colors" />
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full appearance-none bg-gray-50/50 dark:bg-gray-800/50 border-0 rounded-2xl pl-14 pr-6 py-5 font-bold text-sm focus:ring-2 focus:ring-primary-light transition-all"
                  >
                    <option value="">Select level</option>
                    <option value="100L">100L</option>
                    <option value="200L">200L</option>
                    <option value="300L">300L</option>
                    <option value="400L">400L</option>
                    <option value="500L">500L</option>
                  </select>
                </div>
              </div>

              <div className="relative pt-6">
                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white dark:from-subtle-dark pointer-events-none"></div>
                <button 
                  type="submit"
                  disabled={saving}
                  className="w-full py-6 bg-premium-gradient text-white rounded-[1.5rem] font-black uppercase tracking-[0.3em] text-[10px] shadow-3xl hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Intelligence Profile
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Account Info Area */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white dark:bg-subtle-dark rounded-[2.5rem] p-10 border border-gray-100 dark:border-white/5 shadow-sm text-center">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-8">Account Control</h3>
            <div className="space-y-4">
              <button 
                onClick={async () => {
                  await signOut()
                  router.push('/auth/login')
                }}
                className="w-full py-5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-3 border-2 border-transparent"
              >
                <LogOut className="w-4 h-4" />
                Terminate Session
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-subtle-dark rounded-[2.5rem] p-10 border border-gray-100 dark:border-white/5 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Security Metadata</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Node Role</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary-light">{profile?.role}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Access Type</span>
                <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[8px] font-black uppercase rounded-lg">Full Auth</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
