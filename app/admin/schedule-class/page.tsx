'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar, 
  Clock, 
  Video, 
  BookOpen, 
  Plus, 
  Loader2, 
  ArrowLeft, 
  CheckCircle2, 
  Trash2, 
  Edit, 
  ExternalLink,
  Search,
  Filter,
  MoreVertical,
  XCircle,
  AlertCircle,
  Users
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/packages/supabase/src/client'
import Card from '@/components/Card'

type OnlineClass = {
  id: string
  title: string
  course_code: string
  course_title: string | null
  level: string
  date: string
  time: string
  meet_link: string
  created_at: string
}

export default function OnlineClassHub() {
  const router = useRouter()
  const [view, setView] = useState<'list' | 'form'>('list')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [classes, setClasses] = useState<OnlineClass[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    course_code: '',
    course_title: '',
    level: '100L',
    date: '',
    time: '',
    meet_link: '',
  })

  const levels = ['100L', '200L', '300L', '400L', '500L', 'Postgraduate']

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('online_classes')
        .select('*')
        .order('date', { ascending: false })
        .order('time', { ascending: false })

      if (error) throw error
      setClasses(data || [])
    } catch (err: any) {
      console.error('Error fetching classes:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (editingId) {
        const { error } = await supabase
          .from('online_classes')
          .update(formData)
          .eq('id', editingId)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('online_classes')
          .insert([formData])
        if (error) throw error
      }

      setSuccess(true)
      await fetchClasses()
      setTimeout(() => {
        setSuccess(false)
        resetForm()
        setView('list')
      }, 1500)
    } catch (err: any) {
      alert('Error saving class: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this class? This will instantly remove it from student dashboards.')) return

    try {
      const { error } = await supabase
        .from('online_classes')
        .delete()
        .eq('id', id)

      if (error) throw error
      setClasses(classes.filter(c => c.id !== id))
    } catch (err: any) {
      alert('Error deleting class: ' + err.message)
    }
  }

  const handleEdit = (cls: OnlineClass) => {
    setEditingId(cls.id)
    setFormData({
      title: cls.title,
      course_code: cls.course_code,
      course_title: cls.course_title || '',
      level: cls.level,
      date: cls.date,
      time: cls.time,
      meet_link: cls.meet_link,
    })
    setView('form')
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      title: '',
      course_code: '',
      course_title: '',
      level: '100L',
      date: '',
      time: '',
      meet_link: '',
    })
  }

  const upcomingClasses = classes.filter(c => new Date(`${c.date}T${c.time}`) >= new Date())
  const pastClasses = classes.filter(c => new Date(`${c.date}T${c.time}`) < new Date())

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
            Online Class <span className="text-primary-light">Hub</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-2">Orchestrate virtual learning transmissions across the ecosystem.</p>
        </div>

        {view === 'list' && (
          <button 
            onClick={() => { resetForm(); setView('form') }}
            className="px-8 py-4 bg-primary-light text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary-light/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Plus className="w-4 h-4" />
            Schedule New Mission
          </button>
        )}
      </div>

      {view === 'list' ? (
        <div className="space-y-12">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-gray-400">
              <Loader2 className="w-10 h-10 animate-spin mb-4" />
              <p className="font-black uppercase tracking-widest text-[10px]">Scanning Transmissions...</p>
            </div>
          ) : classes.length === 0 ? (
            <Card className="py-20 text-center border-2 border-dashed border-gray-100 dark:border-gray-800">
               <Video className="w-12 h-12 text-gray-200 mx-auto mb-4" />
               <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No online classes scheduled</p>
               <button 
                 onClick={() => setView('form')}
                 className="mt-6 text-primary-light font-black uppercase text-[10px] tracking-widest border-b-2 border-primary-light pb-1"
               >
                 Initiate First Protocol
               </button>
            </Card>
          ) : (
            <>
              {upcomingClasses.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Live & Upcoming</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingClasses.map((cls) => (
                      <ClassCard key={cls.id} cls={cls} onEdit={handleEdit} onDelete={handleDelete} />
                    ))}
                  </div>
                </section>
              )}

              {pastClasses.length > 0 && (
                <section className="opacity-60">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Mission Archive</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pastClasses.map((cls) => (
                      <ClassCard key={cls.id} cls={cls} onEdit={handleEdit} onDelete={handleDelete} isArchive />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
             <button 
               onClick={() => setView('list')}
               className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-text-light flex items-center gap-2 transition-colors"
             >
               <XCircle className="w-4 h-4" /> Cancel Operation
             </button>
             <div className="text-right">
                <span className="text-[10px] font-black uppercase bg-primary-light/10 text-primary-light px-3 py-1 rounded-full border border-primary-light/20">
                  {editingId ? 'Edit Mission' : 'New Deployment'}
                </span>
             </div>
          </div>

          {success ? (
            <Card className="text-center py-20 bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800 animate-scale-in">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-10 h-10" strokeWidth={3} />
                </div>
              </div>
              <h2 className="text-2xl font-black text-text-light dark:text-text-dark uppercase tracking-tight mb-2">
                {editingId ? 'Class Updated!' : 'Class Scheduled!'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 font-medium tracking-tight">Transmission records have been synchronized.</p>
            </Card>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8 animate-slide-up">
              <Card className="p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <Video className="w-32 h-32" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                  {/* Class Title */}
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Class Title / Topic</label>
                    <div className="relative">
                      <BookOpen className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        required
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Advanced Quantum Mechanics Lecture"
                        className="w-full bg-gray-50 dark:bg-gray-800/30 rounded-[1.5rem] pl-14 pr-8 py-5 text-sm font-bold outline-none border-2 border-transparent focus:border-primary-light transition-all"
                      />
                    </div>
                  </div>

                  {/* Course Info */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Course Identifier</label>
                    <input
                      required
                      type="text"
                      name="course_code"
                      value={formData.course_code}
                      onChange={handleChange}
                      placeholder="e.g. PHY 301"
                      className="w-full bg-gray-50 dark:bg-gray-800/30 rounded-[1.5rem] px-8 py-5 text-sm font-bold outline-none border-2 border-transparent focus:border-primary-light transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Target Student Level</label>
                    <div className="relative">
                       <select
                         required
                         name="level"
                         value={formData.level}
                         onChange={handleChange}
                         className="w-full bg-gray-50 dark:bg-gray-800/30 rounded-[1.5rem] px-8 py-5 text-sm font-bold outline-none border-2 border-transparent focus:border-primary-light transition-all appearance-none"
                       >
                         {levels.map(l => <option key={l} value={l}>{l}</option>)}
                       </select>
                       <Filter className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Deployment Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        required
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full bg-gray-50 dark:bg-gray-800/30 rounded-[1.5rem] pl-14 pr-8 py-5 text-sm font-bold outline-none border-2 border-transparent focus:border-primary-light transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Target Start Time</label>
                    <div className="relative">
                      <Clock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        required
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="w-full bg-gray-50 dark:bg-gray-800/30 rounded-[1.5rem] pl-14 pr-8 py-5 text-sm font-bold outline-none border-2 border-transparent focus:border-primary-light transition-all"
                      />
                    </div>
                  </div>

                  {/* Google Meet Link */}
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Access Link (Google Meet)</label>
                    <div className="relative">
                      <Video className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        required
                        type="url"
                        name="meet_link"
                        value={formData.meet_link}
                        onChange={handleChange}
                        placeholder="https://meet.google.com/xxx-xxxx-xxx"
                        className="w-full bg-gray-50 dark:bg-gray-800/30 rounded-[1.5rem] pl-14 pr-8 py-5 text-sm font-bold outline-none border-2 border-transparent focus:border-primary-light transition-all"
                      />
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
                    Synchronizing Transmission...
                  </>
                ) : (
                  <>
                    {editingId ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    {editingId ? 'Update Mission Details' : 'Establish Online Class'}
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

function ClassCard({ 
  cls, 
  onEdit, 
  onDelete, 
  isArchive = false 
}: { 
  cls: OnlineClass, 
  onEdit: (cls: OnlineClass) => void, 
  onDelete: (id: string) => void,
  isArchive?: boolean
}) {
  return (
    <Card className={`group p-8 border border-gray-100 dark:border-gray-800 hover:border-primary-light/30 transition-all duration-300 ${!isArchive ? 'hover:shadow-2xl hover:shadow-primary-light/5' : ''}`}>
      <div className="flex justify-between items-start mb-6">
        <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center text-center ${isArchive ? 'bg-gray-100 dark:bg-gray-800 text-gray-400' : 'bg-primary-light/10 text-primary-light'}`}>
          <p className="text-[7px] font-black uppercase">{new Date(cls.date).toLocaleDateString(undefined, { month: 'short' })}</p>
          <p className="text-lg font-black leading-none">{new Date(cls.date).getDate()}</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => onEdit(cls)}
             className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all shadow-sm"
           >
              <Edit className="w-3.5 h-3.5" />
           </button>
           <button 
             onClick={() => onDelete(cls.id)}
             className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
           >
              <Trash2 className="w-3.5 h-3.5" />
           </button>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-black text-text-light dark:text-text-dark text-lg line-clamp-1 group-hover:text-primary-light transition-colors uppercase tracking-tight leading-tight mb-2">
          {cls.title}
        </h3>
        <div className="flex flex-wrap items-center gap-3 opacity-60">
           <p className="text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5"><BookOpen className="w-3 h-3" /> {cls.course_code}</p>
           <p className="text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5"><Clock className="w-3 h-3" /> {cls.time.substring(0, 5)}</p>
           <p className="text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5"><Users className="w-3 h-3" /> {cls.level}</p>
        </div>
      </div>

      <a 
        href={cls.meet_link} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center justify-between py-4 px-6 bg-gray-50 dark:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-primary-light hover:bg-primary-light/5 transition-all"
      >
        <span>Join Transmission</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </Card>
  )
}
