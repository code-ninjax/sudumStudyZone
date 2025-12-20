'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/packages/supabase/src/client'
import type { Profile } from '@/packages/supabase/src/types'
import { User, Mail, Hash, Building2, GraduationCap, Save, AlertCircle, CheckCircle, LogOut } from 'lucide-react'
import { DashboardSkeleton } from '@/components/SkeletonLoader'
import Button from '@/components/Button'
import Card from '@/components/Card'

export default function StudentProfilePage() {
  const router = useRouter()
  const { user, loading: authLoading, signOut } = useAuth()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    matricNumber: '',
    faculty: '',
    department: '',
  })
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetchLoading, setFetchLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) {
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        // Fetch profile from Supabase
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (fetchError) {
          console.error('Fetch error:', fetchError)
          setError(`Failed to fetch profile: ${fetchError.message}`)
          setLoading(false)
          return
        }

        if (data) {
          setProfile(data as Profile)
          setFormData({
            fullName: data.full_name || '',
            email: user?.email || '',
            matricNumber: data.matric_number || '',
            faculty: data.faculty || '',
            department: data.department || '',
          })
        } else {
          console.warn('No profile data returned')
          setError('No profile data found')
        }
        setLoading(false)
      } catch (err: any) {
        console.error('Error loading profile:', err)
        setError(`Error loading profile: ${err.message}`)
        setLoading(false)
      }
    }

    if (!authLoading && user) {
      loadProfile()
    } else if (!authLoading && !user) {
      setLoading(false)
    }
  }, [user, authLoading])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError(null)
    setSuccess(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setFetchLoading(true)

    try {
      if (!user?.id) throw new Error('User not authenticated')

      // Update profile in database
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          matric_number: formData.matricNumber,
          faculty: formData.faculty,
          department: formData.department,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (profileError) {
        setError(profileError.message || 'Failed to update profile')
        return
      }

      // Update local state
      if (profile) {
        setProfile({
          ...profile,
          full_name: formData.fullName,
          matric_number: formData.matricNumber,
          faculty: formData.faculty,
          department: formData.department,
          updated_at: new Date().toISOString(),
        })
      }

      setSuccess(true)
      // Force a reload after a short delay to update global context/sidebar
      // Ideally we would have a refreshProfile context method, but a reload works for now to ensure consistency
      // setTimeout(() => window.location.reload(), 1500) 
      // Commented out reload to avoid jarring UX, keeping success message
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating your profile')
    } finally {
      setFetchLoading(false)
    }
  }

  const handleCancel = () => {
    if (profile && user) {
      setFormData({
        fullName: profile.full_name || '',
        email: user.email || '',
        matricNumber: profile.matric_number || '',
        faculty: profile.faculty || '',
        department: profile.department || '',
      })
      setError(null)
      setSuccess(false)
    }
  }

  if (authLoading || loading) {
    return <DashboardSkeleton />
  }

  if (!user) {
    return (
      <div className="animate-fade-in">
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">You must be logged in to view this page.</p>
        </div>
      </div>
    )
  }

  const initials = (formData.fullName || 'U')
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('') || 'ST'

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-2">
          Profile Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account information and academic details
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card className="bg-gradient-to-br from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark text-white p-8 text-center h-full">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold border-4 border-white/30">
                <span className="inline-block leading-none">{initials}</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-1">{formData.fullName || 'User'}</h2>
            <p className="text-white/80 mb-4 break-all text-sm">{formData.email || 'Loading email...'}</p>
            <div className="pt-4 border-t border-white/20">
              <p className="text-sm text-white/70 mb-1">Student ID</p>
              <p className="font-mono text-lg break-all">{formData.matricNumber || 'N/A'}</p>
            </div>
            <div className="pt-4 border-t border-white/20 mt-4">
              <p className="text-sm text-white/70 mb-1">Role</p>
              <p className="font-semibold capitalize">{profile?.role || 'Student'}</p>
            </div>
            <div className="pt-4 border-t border-white/20 mt-4">
              <p className="text-sm text-white/70 mb-1">Member Since</p>
              <p className="font-medium text-sm">
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
          </Card>
        </div>

        {/* Form Card */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-800 dark:text-green-200">
                  Profile updated successfully!
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="input-field pl-10 w-full"
                    placeholder="John Doe"
                    required
                    disabled={fetchLoading}
                  />
                </div>
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    className="input-field pl-10 w-full bg-gray-100 dark:bg-gray-800 cursor-not-allowed text-gray-500"
                    placeholder="your.email@example.com"
                    disabled
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Email cannot be changed. Contact support if you need to update it.
                </p>
              </div>

              {/* Matric Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Matric Number
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="matricNumber"
                    value={formData.matricNumber}
                    onChange={handleChange}
                    className="input-field pl-10 w-full"
                    placeholder="e.g., CSC/2020/001"
                    disabled={fetchLoading}
                  />
                </div>
              </div>

              {/* Faculty */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Faculty
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="faculty"
                    value={formData.faculty}
                    onChange={handleChange}
                    className="input-field pl-10 w-full"
                    placeholder="e.g., Faculty of Science"
                    disabled={fetchLoading}
                  />
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Department
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="input-field pl-10 w-full"
                    placeholder="e.g., Computer Science"
                    disabled={fetchLoading}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700 mt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 font-medium text-sm"
                  disabled={fetchLoading}
                >
                  Reset Changes
                </button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={fetchLoading}
                  className="flex items-center gap-2 px-6 py-2.5"
                >
                  <Save className="w-4 h-4" />
                  {fetchLoading ? 'Saving...' : 'Save Profile'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>

      {/* Account Information Section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-bold text-text-light dark:text-text-dark mb-4">
            Account Status
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">Account Role</span>
              <span className="text-sm font-semibold text-text-light dark:text-text-dark capitalize">
                {profile?.role || 'Student'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">Profile Created</span>
              <span className="text-sm font-semibold text-text-light dark:text-text-dark">
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString()
                  : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Last Details Update</span>
              <span className="text-sm font-semibold text-text-light dark:text-text-dark">
                {profile?.updated_at
                  ? new Date(profile.updated_at).toLocaleDateString()
                  : 'N/A'}
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-text-light dark:text-text-dark mb-4">
            Account Security
          </h3>
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Manage your account security and sign out options.
            </p>
            <button
              onClick={() => router.push('/student/settings')}
              className="w-full px-4 py-2.5 rounded-lg text-primary-light dark:text-primary-dark border border-primary-light dark:border-primary-dark hover:bg-primary-light/10 dark:hover:bg-primary-dark/10 transition-colors duration-200 font-medium text-sm"
            >
              Go to Security Settings
            </button>
            <button
              onClick={async () => {
                await signOut()
                router.push('/auth/login')
              }}
              className="w-full px-4 py-2.5 rounded-lg text-red-600 dark:text-red-400 border border-red-600 dark:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 font-medium text-sm flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}
