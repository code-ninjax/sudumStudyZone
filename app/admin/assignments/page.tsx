'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Users, FileText, Calendar, Clock, ChevronDown, ChevronUp, Download, CheckCircle2, XCircle } from 'lucide-react'
import CountingAnimation from '@/components/CountingAnimation'
import { DashboardSkeleton } from '@/components/SkeletonLoader'
import { 
  getAllAssignments, 
  createAssignment, 
  getAssignmentSubmissions, 
  gradeSubmission 
} from '@/packages/supabase/src/assignments'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/packages/supabase/src/client'

export default function AdminAssignmentsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [assignments, setAssignments] = useState<any[]>([])
  const [departments, setDepartments] = useState<{id: string, name: string}[]>([])
  const [visibleCount, setVisibleCount] = useState(3)
  const [expandedAssignment, setExpandedAssignment] = useState<string | null>(null)
  const [submissions, setSubmissions] = useState<{ [key: string]: any[] }>({})
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEvalModal, setShowEvalModal] = useState(false)
  const [evalData, setEvalData] = useState({
    submissionId: '',
    assignmentId: '',
    score: 0,
    feedback: '',
    studentName: ''
  })
  
  // Form State
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    course_code: '',
    level: '100L',
    due_date: '',
    max_score: 100,
    department_ids: [] as string[]
  })

  // Filters State
  const [filterDepartment, setFilterDepartment] = useState('')
  const [filterLevel, setFilterLevel] = useState('')
  const [filterCourse, setFilterCourse] = useState('')

  useEffect(() => {
    fetchAssignments()
    fetchDepartments()
  }, [])

  async function fetchDepartments() {
    const { data } = await supabase.from('departments').select('id, name').order('name')
    if (data) setDepartments(data)
  }

  async function fetchAssignments() {
    setLoading(true)
    try {
      const data = await getAllAssignments()
      setAssignments(data || [])
    } catch (error) {
      console.error('Error fetching assignments:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleDepartmentSelection = (deptId: string) => {
    setNewAssignment(prev => {
      const isSelected = prev.department_ids.includes(deptId)
      return {
        ...prev,
        department_ids: isSelected 
          ? prev.department_ids.filter(id => id !== deptId)
          : [...prev.department_ids, deptId]
      }
    })
  }

  // Define levels from the previous component for reuse
  const levels = ['100L', '200L', '300L', '400L', '500L', 'Postgraduate']

  // Filter Logic
  const filteredAssignments = assignments.filter(assignment => {
    const matchLevel = filterLevel ? assignment.level === filterLevel : true
    const matchCourse = filterCourse ? assignment.course_code.toLowerCase().includes(filterCourse.toLowerCase()) : true
    const matchDept = filterDepartment 
      ? assignment.assignment_departments?.some((ad: any) => ad.department_id === filterDepartment)
      : true
    
    return matchLevel && matchCourse && matchDept
  })

  async function handleExpand(assignmentId: string) {
    if (expandedAssignment === assignmentId) {
      setExpandedAssignment(null)
      return
    }

    setExpandedAssignment(assignmentId)
    if (!submissions[assignmentId]) {
      try {
        const data = await getAssignmentSubmissions(assignmentId)
        setSubmissions(prev => ({ ...prev, [assignmentId]: data }))
      } catch (error) {
        console.error('Error fetching submissions:', error)
      }
    }
  }

  async function handleAddAssignment(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return

    try {
      await createAssignment(user.id, newAssignment)
      setShowAddModal(false)
      setNewAssignment({
        title: '',
        description: '',
        course_code: '',
        level: '100L',
        due_date: '',
        max_score: 100,
        department_ids: []
      })
      fetchAssignments()
    } catch (error) {
      alert('Failed to create assignment')
    }
  }

  async function handleEvaluate(e: React.FormEvent) {
    e.preventDefault()
    try {
      await gradeSubmission(evalData.submissionId, {
        score: evalData.score,
        feedback: evalData.feedback
      })
      setShowEvalModal(false)
      // Refresh submissions for this assignment
      const data = await getAssignmentSubmissions(evalData.assignmentId)
      setSubmissions(prev => ({ ...prev, [evalData.assignmentId]: data }))
    } catch (error) {
      alert('Failed to evaluate submission')
    }
  }

  if (loading) return <DashboardSkeleton />

  return (
    <div className="animate-fade-in max-w-[1200px] mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-3xl font-black text-text-light dark:text-text-dark tracking-tighter uppercase mb-2">
            Assignments <span className="text-primary-light">Management</span>
          </h1>
          <p className="text-sm text-gray-500 font-medium tracking-tight">Deployment hub for academic tasks and student assessments.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-8 py-4 bg-premium-gradient text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-[1.02] transition-all flex items-center gap-3"
        >
          <Plus className="w-4 h-4" />
          Add Assignment
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
        <div className="bg-white dark:bg-subtle-dark p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Assignments</p>
          <p className="text-4xl font-black text-text-light dark:text-text-dark tracking-tighter">
            <CountingAnimation end={assignments.length} />
          </p>
        </div>
        <div className="bg-white dark:bg-subtle-dark p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Active Tasks</p>
          <p className="text-4xl font-black text-text-light dark:text-text-dark tracking-tighter">
            <CountingAnimation end={assignments.filter(a => new Date(a.due_date) > new Date()).length} />
          </p>
        </div>
        <div className="bg-white dark:bg-subtle-dark p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Submissions Hub</p>
          <p className="text-4xl font-black text-text-light dark:text-text-dark tracking-tighter">
            <CountingAnimation end={Object.values(submissions).flat().length} />
          </p>
        </div>
      </div>

      {/* Filters Area */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Filter By Department</label>
          <select 
            className="w-full bg-white dark:bg-subtle-dark border border-gray-100 dark:border-gray-800 rounded-xl px-5 py-3 text-sm font-bold focus:ring-2 focus:ring-primary-light transition-all outline-none"
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
          >
            <option value="" className="text-gray-900 bg-white dark:text-white dark:bg-gray-800">All Departments</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id} className="text-gray-900 bg-white dark:text-white dark:bg-gray-800">{dept.name}</option>
            ))}
          </select>
        </div>
        <div>
           <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Filter By Level</label>
           <select 
            className="w-full bg-white dark:bg-subtle-dark border border-gray-100 dark:border-gray-800 rounded-xl px-5 py-3 text-sm font-bold focus:ring-2 focus:ring-primary-light transition-all outline-none"
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
          >
            <option value="" className="text-gray-900 bg-white dark:text-white dark:bg-gray-800">All Levels</option>
            {levels.map(l => (
              <option key={l} value={l} className="text-gray-900 bg-white dark:text-white dark:bg-gray-800">{l}</option>
            ))}
          </select>
        </div>
        <div>
           <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Filter By Course Code</label>
           <input 
             placeholder="e.g. CSC 401"
             className="w-full bg-white dark:bg-subtle-dark border border-gray-100 dark:border-gray-800 rounded-xl px-5 py-3 text-sm font-bold focus:ring-2 focus:ring-primary-light transition-all outline-none"
             value={filterCourse}
             onChange={(e) => setFilterCourse(e.target.value)}
           />
        </div>
      </div>

      {/* Assignments List */}
      <div className="space-y-6">
        {filteredAssignments.length === 0 ? (
          <div className="py-12 bg-white dark:bg-subtle-dark rounded-3xl border border-gray-100 dark:border-gray-800 text-center">
            <p className="text-gray-400 font-bold tracking-tight">No assignments match your filters.</p>
          </div>
        ) : 
          filteredAssignments.slice(0, visibleCount).map((assignment) => (
          <div key={assignment.id} className="group bg-white dark:bg-subtle-dark rounded-[2rem] border border-gray-100 dark:border-gray-800 overflow-hidden transition-all hover:shadow-2xl">
            <div className={`p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${expandedAssignment === assignment.id ? 'bg-gray-50/50 dark:bg-gray-800/20' : ''}`}>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <span className="px-3 py-1 bg-primary-light/10 text-primary-light text-[10px] font-black rounded uppercase tracking-widest border border-primary-light/20">
                    {assignment.level}
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{assignment.course_code}</span>
                </div>
                <h3 className="text-xl font-black text-text-light dark:text-text-dark tracking-tight mb-2 uppercase group-hover:text-primary-light transition-colors">{assignment.title}</h3>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                    <Calendar className="w-3 h-3" />
                    Due: {new Date(assignment.due_date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                    <FileText className="w-3 h-3" />
                    {assignment.max_score} Points Max
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handleExpand(assignment.id)}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-light hover:text-white transition-all shadow-sm"
                >
                  {expandedAssignment === assignment.id ? (
                    <>Hide Submissions <ChevronUp className="w-3 h-3" /></>
                  ) : (
                    <>View Submissions <ChevronDown className="w-3 h-3" /></>
                  )}
                </button>
                <button className="p-3 text-gray-400 hover:text-blue-500 transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-3 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Submissions Table Area */}
            {expandedAssignment === assignment.id && (
              <div className="p-8 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-subtle-dark animate-slide-down">
                <div className="flex items-center justify-between mb-8">
                  <h4 className="text-sm font-black uppercase tracking-widest">Candidate Responses</h4>
                  <div className="px-4 py-2 bg-green-500/10 text-green-500 text-[8px] font-black rounded-full uppercase tracking-[0.2em] border border-green-500/20">
                    Active Ledger
                  </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-gray-50 dark:border-gray-800">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-800/50">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Student</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Timestamp</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Artifact</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                      {(submissions[assignment.id] || []).length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            No submissions detected for this task.
                          </td>
                        </tr>
                      ) : (
                        submissions[assignment.id].map((sub) => (
                          <tr key={sub.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                            <td className="px-6 py-6 font-bold text-sm text-text-light dark:text-text-dark">
                              {sub.profiles?.full_name || 'Anonymous Student'}
                              <p className="text-[8px] opacity-40 uppercase tracking-widest">{sub.profiles?.matric_number}</p>
                            </td>
                            <td className="px-6 py-6 text-xs text-gray-500 font-medium">
                              {new Date(sub.submitted_at).toLocaleString()}
                            </td>
                            <td className="px-6 py-6">
                              <a href={sub.file_url} target="_blank" className="inline-flex items-center gap-2 text-primary-light font-black text-[10px] uppercase tracking-widest hover:underline">
                                <Download className="w-3 h-3" /> Get File
                              </a>
                            </td>
                            <td className="px-6 py-6">
                              {sub.score !== null ? (
                                <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[8px] font-black rounded-full uppercase tracking-widest">Graded: {sub.score}</span>
                              ) : (
                                <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 text-[8px] font-black rounded-full uppercase tracking-widest">Pending</span>
                              )}
                            </td>
                            <td className="px-6 py-6 text-right">
                              <button 
                                onClick={() => {
                                  setEvalData({
                                    submissionId: sub.id,
                                    assignmentId: assignment.id,
                                    score: sub.score || 0,
                                    feedback: sub.feedback || '',
                                    studentName: sub.profiles?.full_name || 'Student'
                                  })
                                  setShowEvalModal(true)
                                }}
                                className="px-4 py-2 bg-primary-light text-white text-[8px] font-black uppercase tracking-widest rounded-lg hover:bg-primary-dark transition-all"
                              >
                                {sub.score !== null ? 'Re-evaluate' : 'Evaluate'}
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {visibleCount < filteredAssignments.length && (
          <button 
            onClick={() => setVisibleCount(prev => prev + 3)}
            className="w-full py-6 mt-8 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-3xl text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-light transition-all"
          >
            Load More Assignments
          </button>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-subtle-dark w-full max-w-xl rounded-[2.5rem] p-10 shadow-3xl animate-scale-in">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black uppercase tracking-tighter">Strategic Deployment</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all">
                <XCircle className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleAddAssignment} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Assignment Title</label>
                  <input 
                    required
                    className="w-full bg-gray-50 dark:bg-gray-800 border-0 rounded-xl px-5 py-4 font-bold text-sm focus:ring-2 focus:ring-primary-light transition-all"
                    placeholder="e.g. Advanced Neural Architectures"
                    value={newAssignment.title}
                    onChange={e => setNewAssignment({...newAssignment, title: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Course Code</label>
                  <input 
                    required
                    className="w-full bg-gray-50 dark:bg-gray-800 border-0 rounded-xl px-5 py-4 font-bold text-sm focus:ring-2 focus:ring-primary-light transition-all"
                    placeholder="CSC 401"
                    value={newAssignment.course_code}
                    onChange={e => setNewAssignment({...newAssignment, course_code: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Level</label>
                  <select 
                    className="w-full bg-gray-50 dark:bg-gray-800 border-0 rounded-xl px-5 py-4 font-bold text-sm focus:ring-2 focus:ring-primary-light transition-all"
                    value={newAssignment.level}
                    onChange={e => setNewAssignment({...newAssignment, level: e.target.value})}
                  >
                    {levels.map(l => (
                      <option key={l} value={l} className="text-gray-900 bg-white dark:text-white dark:bg-gray-800">{l}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">Target Departments (Select Multiple)</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {departments.map((dept) => (
                      <label 
                        key={dept.id} 
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          newAssignment.department_ids.includes(dept.id) 
                            ? 'bg-primary-light/10 border-primary-light text-primary-light' 
                            : 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <input 
                          type="checkbox" 
                          checked={newAssignment.department_ids.includes(dept.id)}
                          onChange={() => toggleDepartmentSelection(dept.id)}
                          className="w-4 h-4 text-primary-light bg-white border-gray-300 rounded focus:ring-primary-light"
                        />
                        <span className="text-xs font-bold line-clamp-1">{dept.name}</span>
                      </label>
                    ))}
                  </div>
                  {departments.length === 0 && (
                     <p className="text-xs text-red-500 font-bold mt-2">No departments established. Please create one in the Department Hub first.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Deadline</label>
                  <input 
                    required
                    type="datetime-local"
                    className="w-full bg-gray-50 dark:bg-gray-800 border-0 rounded-xl px-5 py-4 font-bold text-sm focus:ring-2 focus:ring-primary-light transition-all"
                    value={newAssignment.due_date}
                    onChange={e => setNewAssignment({...newAssignment, due_date: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Max Points</label>
                  <input 
                    type="number"
                    className="w-full bg-gray-50 dark:bg-gray-800 border-0 rounded-xl px-5 py-4 font-bold text-sm focus:ring-2 focus:ring-primary-light transition-all"
                    value={newAssignment.max_score}
                    onChange={e => setNewAssignment({...newAssignment, max_score: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Briefing Instructions (HTML)</label>
                <textarea 
                  className="w-full bg-gray-50 dark:bg-gray-800 border-0 rounded-2xl px-5 py-4 font-medium text-sm focus:ring-2 focus:ring-primary-light transition-all min-h-[120px]"
                  placeholder="Provide detailed instructions..."
                  value={newAssignment.description}
                  onChange={e => setNewAssignment({...newAssignment, description: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                className="w-full py-5 bg-premium-gradient text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl hover:scale-[1.01] active:scale-95 transition-all mt-4"
              >
                Deploy Task
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Evaluation Modal */}
      {showEvalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-subtle-dark w-full max-w-lg rounded-[2.5rem] p-10 shadow-3xl animate-scale-in">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter">Evaluate Submission</h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{evalData.studentName}</p>
              </div>
              <button onClick={() => setShowEvalModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all">
                <XCircle className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleEvaluate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Score (Max {assignments.find(a => a.id === evalData.assignmentId)?.max_score || 100})</label>
                <input 
                  required
                  type="number"
                  className="w-full bg-gray-50 dark:bg-gray-800 border-0 rounded-xl px-5 py-4 font-bold text-sm focus:ring-2 focus:ring-primary-light transition-all"
                  value={evalData.score}
                  onChange={e => setEvalData({...evalData, score: parseInt(e.target.value)})}
                  max={assignments.find(a => a.id === evalData.assignmentId)?.max_score || 100}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Lecturer Remark / Feedback</label>
                <textarea 
                  required
                  className="w-full bg-gray-50 dark:bg-gray-800 border-0 rounded-2xl px-5 py-4 font-medium text-sm focus:ring-2 focus:ring-primary-light transition-all min-h-[120px]"
                  placeholder="Provide feedback on the submission..."
                  value={evalData.feedback}
                  onChange={e => setEvalData({...evalData, feedback: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                className="w-full py-5 bg-premium-gradient text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl hover:scale-[1.01] active:scale-95 transition-all mt-4"
              >
                Log Evaluation
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
