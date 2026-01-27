'use client'

import { useState, useEffect } from 'react'
import { FileText, Calendar, ChevronRight, Award, Clock, Download, XCircle } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { getStudentSubmissions } from '@/packages/supabase/src/assignments'
import { DashboardSkeleton } from '@/components/SkeletonLoader'

export default function StudentScoresPage() {
  const { user } = useAuth()
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null)

  useEffect(() => {
    if (user) {
      fetchSubmissions()
    }
  }, [user])

  async function fetchSubmissions() {
    try {
      const data = await getStudentSubmissions(user!.id)
      setSubmissions(data || [])
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <DashboardSkeleton />

  return (
    <div className="animate-fade-in max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-black text-text-light dark:text-text-dark tracking-tighter uppercase mb-2">
          Academic <span className="text-primary-light">Performance</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium">Review your graded tasks and lecturer feedback.</p>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-subtle-dark p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Submissions</p>
          <p className="text-4xl font-black text-text-light dark:text-text-dark">{submissions.length}</p>
        </div>
        <div className="bg-white dark:bg-subtle-dark p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm border-l-4 border-l-green-500">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Graded Tasks</p>
          <p className="text-4xl font-black text-text-light dark:text-text-dark">{submissions.filter(s => s.score !== null).length}</p>
        </div>
        <div className="bg-white dark:bg-subtle-dark p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm border-l-4 border-l-yellow-500">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pending Review</p>
          <p className="text-4xl font-black text-text-light dark:text-text-dark">{submissions.filter(s => s.score === null).length}</p>
        </div>
      </div>

      {/* Submissions List */}
      <div className="bg-white dark:bg-subtle-dark rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-100 dark:border-white/5">
          <h2 className="text-sm font-black uppercase tracking-widest">Submission History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/5">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Assignment</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Submitted</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Score</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No assignments submitted yet.</p>
                  </td>
                </tr>
              ) : (
                submissions.map((sub) => (
                  <tr key={sub.id} className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary-light/10 text-primary-light rounded-xl flex items-center justify-center">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-text-light dark:text-text-dark">{sub.assignments?.title}</p>
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{sub.assignments?.course_code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(sub.submitted_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {sub.score !== null ? (
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-black text-text-light dark:text-text-dark">{sub.score}</span>
                          <span className="text-[10px] text-gray-400 font-bold">/ {sub.assignments?.max_score}</span>
                        </div>
                      ) : (
                        <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 text-[8px] font-black rounded-full uppercase tracking-widest">Pending</span>
                      )}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => setSelectedSubmission(sub)}
                        className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-xl transition-all"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-light" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-subtle-dark w-full max-w-xl rounded-[2.5rem] p-10 shadow-3xl animate-scale-in">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter">Task Result</h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{selectedSubmission.assignments?.title}</p>
              </div>
              <button onClick={() => setSelectedSubmission(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-all">
                <XCircle className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="space-y-8">
              {/* Score Display */}
              <div className="bg-premium-gradient p-8 rounded-3xl text-white text-center relative overflow-hidden">
                < Award className="absolute top-4 right-4 w-20 h-20 opacity-10" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2">Final Score</p>
                <p className="text-6xl font-black">{selectedSubmission.score || '--'}</p>
                <p className="text-xs font-bold opacity-60">Out of {selectedSubmission.assignments?.max_score} Points</p>
              </div>

              {/* Remark */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Lecturer Remark</label>
                <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5">
                  <p className="text-sm font-medium italic">
                    "{selectedSubmission.feedback || "Your submission is currently under review by the academic board."}"
                  </p>
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                  <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Submitted File</p>
                  <a href={selectedSubmission.file_url} target="_blank" className="text-xs font-bold text-primary-light flex items-center gap-2 hover:underline">
                    <Download className="w-3 h-3" /> {selectedSubmission.file_name || 'Assignment File'}
                  </a>
                </div>
                <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                  <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Date Logged</p>
                  <p className="text-xs font-bold">{new Date(selectedSubmission.submitted_at).toLocaleString()}</p>
                </div>
              </div>

              <button 
                onClick={() => setSelectedSubmission(null)}
                className="w-full py-5 bg-gray-100 dark:bg-white/10 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:bg-gray-200 dark:hover:bg-white/20 transition-all mt-4"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
