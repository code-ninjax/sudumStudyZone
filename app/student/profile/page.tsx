'use client'

import { useState } from 'react'
import { User, Mail, Hash, Phone, MapPin, Calendar, Edit2, Save } from 'lucide-react'
import CountingAnimation from '@/components/CountingAnimation'

export default function StudentProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    fullName: 'John Doe',
    matricNumber: 'CSC/2020/001',
    email: 'john.doe@student.edu',
    phone: '+234 801 234 5678',
    department: 'Computer Science',
    level: '300 Level',
    address: 'Lagos, Nigeria',
    dateOfBirth: '2002-05-15',
  })

  const stats = [
    { label: 'Total Points', value: 1250, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
    { label: 'Courses Completed', value: 12, color: 'text-green-500', bgColor: 'bg-green-500/10' },
    { label: 'Current CGPA', value: '3.85', color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { label: 'Study Streak', value: 7, suffix: ' days', color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
  ]

  const handleSave = () => {
    setIsEditing(false)
    // TODO: Save to backend
    console.log('Profile updated:', profile)
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-2">
          My Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your personal information and academic details
        </p>
      </div>

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark rounded-2xl p-8 mb-8 text-white">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold border-4 border-white/30">
            JD
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold mb-2">{profile.fullName}</h2>
            <p className="text-lg opacity-90 mb-1">{profile.matricNumber}</p>
            <p className="opacity-80">{profile.department} • {profile.level}</p>
          </div>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            {isEditing ? (
              <>
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </>
            ) : (
              <>
                <Edit2 className="w-5 h-5" />
                <span>Edit Profile</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
            <div className={`inline-flex p-3 rounded-lg ${stat.bgColor} mb-4`}>
              <span className={`text-2xl font-bold ${stat.color}`}>
                {typeof stat.value === 'number' ? <CountingAnimation end={stat.value} suffix={stat.suffix || ''} /> : stat.value}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Information */}
        <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-6">
            Personal Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  disabled={!isEditing}
                  className="input-field pl-10 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Matric Number
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={profile.matricNumber}
                  disabled
                  className="input-field pl-10 bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  disabled={!isEditing}
                  className="input-field pl-10 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  disabled={!isEditing}
                  className="input-field pl-10 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-6">
            Academic Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Department
              </label>
              <input
                type="text"
                value={profile.department}
                disabled
                className="input-field bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Level
              </label>
              <input
                type="text"
                value={profile.level}
                disabled
                className="input-field bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date of Birth
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={profile.dateOfBirth}
                  onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                  disabled={!isEditing}
                  className="input-field pl-10 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  disabled={!isEditing}
                  className="input-field pl-10 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
