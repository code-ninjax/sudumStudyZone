'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Download, Mail, Eye } from 'lucide-react'
import CountingAnimation from '@/components/CountingAnimation'
import { DashboardSkeleton } from '@/components/SkeletonLoader'
import { getAllStudents } from '@/packages/supabase/src/helpers'

export default function AdminStudentsPage() {
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [students, setStudents] = useState<any[]>([])
  const [filteredStudents, setFilteredStudents] = useState<any[]>([])

  useEffect(() => {
    async function fetchStudents() {
      try {
        const data = await getAllStudents()
        setStudents(data || [])
        setFilteredStudents(data || [])
      } catch (error) {
        console.error('Error fetching students:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStudents()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredStudents(students)
    } else {
      const filtered = students.filter(
        (student) =>
          student.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.matric_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.faculty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.id?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredStudents(filtered)
    }
  }, [searchQuery, students])


  const mockStudents = [
    { id: 1, name: 'John Doe', matricNumber: 'CSC/2020/001', email: 'john@student.edu', level: '300L', cgpa: 3.85, courses: 5, status: 'Active' },
    { id: 2, name: 'Jane Smith', matricNumber: 'CSC/2020/002', email: 'jane@student.edu', level: '300L', cgpa: 3.92, courses: 5, status: 'Active' },
    { id: 3, name: 'Mike Johnson', matricNumber: 'CSC/2020/003', email: 'mike@student.edu', level: '300L', cgpa: 3.45, courses: 4, status: 'Active' },
    { id: 4, name: 'Sarah Williams', matricNumber: 'CSC/2020/004', email: 'sarah@student.edu', level: '300L', cgpa: 4.00, courses: 5, status: 'Active' },
    { id: 5, name: 'David Brown', matricNumber: 'CSC/2020/005', email: 'david@student.edu', level: '200L', cgpa: 3.67, courses: 4, status: 'Active' },
    { id: 6, name: 'Emily Davis', matricNumber: 'CSC/2020/006', email: 'emily@student.edu', level: '200L', cgpa: 3.78, courses: 4, status: 'Inactive' },
  ]

  const stats = [
    { label: 'Total Students', value: 1234, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { label: 'Active Students', value: 1180, color: 'text-green-500', bgColor: 'bg-green-500/10' },
    { label: 'New This Month', value: 45, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
    { label: 'Avg CGPA', value: '3.72', color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
  ]

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-2">
          Students Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and manage all registered students
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
          <div className="inline-flex p-3 rounded-lg bg-blue-500/10 mb-4">
            <span className="text-2xl font-bold text-blue-500">
              <CountingAnimation end={students.length} />
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
        </div>
        <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
          <div className="inline-flex p-3 rounded-lg bg-green-500/10 mb-4">
            <span className="text-2xl font-bold text-green-500">
              <CountingAnimation end={students.length} />
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Active Students</p>
        </div>
        <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
          <div className="inline-flex p-3 rounded-lg bg-purple-500/10 mb-4">
            <span className="text-2xl font-bold text-purple-500">
              <CountingAnimation end={0} />
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">New This Month</p>
        </div>
        <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
          <div className="inline-flex p-3 rounded-lg bg-yellow-500/10 mb-4">
            <span className="text-2xl font-bold text-yellow-500">-</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Avg CGPA</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, matric number, faculty, or department..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
            />
          </div>
          <button className="px-6 py-3 bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark rounded-lg font-medium hover:bg-primary-light/20 dark:hover:bg-primary-dark/20 transition-colors duration-200 flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filter</span>
          </button>
          <button className="px-6 py-3 bg-primary-light dark:bg-primary-dark text-white rounded-lg font-medium hover:opacity-90 transition-opacity duration-200 flex items-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Matric Number
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Faculty
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-600 dark:text-gray-400">
                    {searchQuery ? 'No students found matching your search.' : 'No students registered yet.'}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-text-light dark:text-text-dark">
                        {student.full_name || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {student.matric_number || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {student.faculty || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {student.department || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {student.email || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
                          <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
                          <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
