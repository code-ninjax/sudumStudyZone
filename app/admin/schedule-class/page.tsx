'use client'

import { useState } from 'react'
import { Calendar, Clock, Video, BookOpen, Plus, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/packages/supabase/src/client'
import Card from '@/components/Card'

export default function ScheduleClassPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('online_classes')
        .insert([formData])

      if (error) throw error

      setSuccess(true)
      setTimeout(() => {
        router.push('/admin')
      }, 2000)
    } catch (err: any) {
      alert('Error scheduling class: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-in max-w-4xl mx-auto py-10 px-4">
      <Link 
        href="/admin" 
        className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-400 hover:text-primary-light mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Command Station
      </Link>

      <div className="mb-10">
        <h1 className="text-4xl font-black text-text-light dark:text-text-dark tracking-tighter uppercase mb-2">Schedule Online Class</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Deploy a Google Meet link to specific student levels in real-time.</p>
      </div>

      {success ? (
        <Card className="text-center py-20 bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg animate-scale-in">
              <CheckCircle2 className="w-10 h-10" strokeWidth={3} />
            </div>
          </div>
          <h2 className="text-2xl font-black text-text-light dark:text-text-dark uppercase tracking-tight mb-2">Class Scheduled!</h2>
          <p className="text-gray-600 dark:text-gray-400 font-medium">The mission has been deployed to the student dashboards.</p>
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card className="p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Class Title */}
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Class Title</label>
                <div className="relative">
                  <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    required
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Advanced Quantum Mechanics Lecture"
                    className="w-full bg-gray-50 dark:bg-gray-800/30 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold outline-none border border-transparent focus:border-primary-light transition-all"
                  />
                </div>
              </div>

              {/* Course Info */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Course Code</label>
                <input
                  required
                  type="text"
                  name="course_code"
                  value={formData.course_code}
                  onChange={handleChange}
                  placeholder="e.g. PHY 301"
                  className="w-full bg-gray-50 dark:bg-gray-800/30 rounded-2xl px-6 py-4 text-sm font-bold outline-none border border-transparent focus:border-primary-light transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Student Level</label>
                <select
                  required
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-gray-800/30 rounded-2xl px-6 py-4 text-sm font-bold outline-none border border-transparent focus:border-primary-light transition-all appearance-none"
                >
                  {levels.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              {/* Date & Time */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    required
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full bg-gray-50 dark:bg-gray-800/30 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold outline-none border border-transparent focus:border-primary-light transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Start Time</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    required
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full bg-gray-50 dark:bg-gray-800/30 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold outline-none border border-transparent focus:border-primary-light transition-all"
                  />
                </div>
              </div>

              {/* Google Meet Link */}
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Google Meet Link</label>
                <div className="relative">
                  <Video className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    required
                    type="url"
                    name="meet_link"
                    value={formData.meet_link}
                    onChange={handleChange}
                    placeholder="https://meet.google.com/xxx-xxxx-xxx"
                    className="w-full bg-gray-50 dark:bg-gray-800/30 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold outline-none border border-transparent focus:border-primary-light transition-all"
                  />
                </div>
                <p className="mt-4 text-[9px] text-gray-400 font-black uppercase tracking-widest text-center">
                  This link will automatically appear on the dashboards of {formData.level} students.
                </p>
              </div>
            </div>
          </Card>

          <button
            disabled={loading}
            type="submit"
            className="w-full py-6 bg-primary-light text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs shadow-2xl shadow-primary-light/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:scale-100"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Deploying Mission...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Establish Online Class
              </>
            )}
          </button>
        </form>
      )}
    </div>
  )
}
