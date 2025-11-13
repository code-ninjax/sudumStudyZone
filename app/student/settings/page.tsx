'use client'

import { useState } from 'react'
import { Bell, Lock, Eye, Globe, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function StudentSettingsPage() {
  const { theme, setTheme } = useTheme()
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    courseUpdates: true,
    assignmentReminders: true,
    weeklyDigest: false,
    darkMode: theme === 'dark',
  })

  const handleToggle = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] })
    if (key === 'darkMode') {
      setTheme(settings.darkMode ? 'light' : 'dark')
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-2">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account preferences and notifications
        </p>
      </div>

      <div className="space-y-6">
        {/* Notifications */}
        <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Bell className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-light dark:text-text-dark">
                Notifications
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage how you receive notifications
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-subtle-light dark:bg-gray-800 rounded-lg">
              <div>
                <h3 className="font-semibold text-text-light dark:text-text-dark">Email Notifications</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receive notifications via email</p>
              </div>
              <button
                onClick={() => handleToggle('emailNotifications')}
                className={`relative w-14 h-8 rounded-full transition-colors duration-200 ${
                  settings.emailNotifications ? 'bg-primary-light dark:bg-primary-dark' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-200 ${
                    settings.emailNotifications ? 'transform translate-x-6' : ''
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-subtle-light dark:bg-gray-800 rounded-lg">
              <div>
                <h3 className="font-semibold text-text-light dark:text-text-dark">Push Notifications</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receive push notifications on your device</p>
              </div>
              <button
                onClick={() => handleToggle('pushNotifications')}
                className={`relative w-14 h-8 rounded-full transition-colors duration-200 ${
                  settings.pushNotifications ? 'bg-primary-light dark:bg-primary-dark' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-200 ${
                    settings.pushNotifications ? 'transform translate-x-6' : ''
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-subtle-light dark:bg-gray-800 rounded-lg">
              <div>
                <h3 className="font-semibold text-text-light dark:text-text-dark">Course Updates</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Get notified about course changes</p>
              </div>
              <button
                onClick={() => handleToggle('courseUpdates')}
                className={`relative w-14 h-8 rounded-full transition-colors duration-200 ${
                  settings.courseUpdates ? 'bg-primary-light dark:bg-primary-dark' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-200 ${
                    settings.courseUpdates ? 'transform translate-x-6' : ''
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-subtle-light dark:bg-gray-800 rounded-lg">
              <div>
                <h3 className="font-semibold text-text-light dark:text-text-dark">Assignment Reminders</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Reminders for upcoming assignments</p>
              </div>
              <button
                onClick={() => handleToggle('assignmentReminders')}
                className={`relative w-14 h-8 rounded-full transition-colors duration-200 ${
                  settings.assignmentReminders ? 'bg-primary-light dark:bg-primary-dark' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-200 ${
                    settings.assignmentReminders ? 'transform translate-x-6' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Eye className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-light dark:text-text-dark">
                Appearance
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Customize how Sudum Study looks
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-subtle-light dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-3">
              {theme === 'dark' ? (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
              <div>
                <h3 className="font-semibold text-text-light dark:text-text-dark">Dark Mode</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {theme === 'dark' ? 'Dark theme enabled' : 'Light theme enabled'}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('darkMode')}
              className={`relative w-14 h-8 rounded-full transition-colors duration-200 ${
                theme === 'dark' ? 'bg-primary-light dark:bg-primary-dark' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-200 ${
                  theme === 'dark' ? 'transform translate-x-6' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <Lock className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-light dark:text-text-dark">
                Security
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage your account security
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full p-4 bg-subtle-light dark:bg-gray-800 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
              <h3 className="font-semibold text-text-light dark:text-text-dark">Change Password</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Update your password regularly</p>
            </button>

            <button className="w-full p-4 bg-subtle-light dark:bg-gray-800 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
              <h3 className="font-semibold text-text-light dark:text-text-dark">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security</p>
            </button>
          </div>
        </div>

        {/* Language */}
        <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Globe className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-light dark:text-text-dark">
                Language & Region
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Set your preferred language
              </p>
            </div>
          </div>

          <select className="input-field">
            <option>English (US)</option>
            <option>English (UK)</option>
            <option>French</option>
            <option>Spanish</option>
          </select>
        </div>
      </div>
    </div>
  )
}
