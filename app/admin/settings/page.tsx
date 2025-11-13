'use client'

import { useState } from 'react'
import { Save, Globe, Bell, Shield, Database } from 'lucide-react'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'Sudum Study',
    siteDescription: 'Academic Learning Platform',
    contactEmail: 'admin@sudums tudy.com',
    allowRegistration: true,
    requireEmailVerification: true,
    maintenanceMode: false,
  })

  const handleSave = () => {
    console.log('Saving settings:', settings)
    // TODO: Save to backend
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-2">
          Platform Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configure your platform preferences and settings
        </p>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Globe className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-light dark:text-text-dark">
                General Settings
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Basic platform configuration
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Site Name
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Site Description
              </label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                rows={3}
                className="input-field resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Registration Settings */}
        <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Shield className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-light dark:text-text-dark">
                Registration & Security
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage user registration and security
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-subtle-light dark:bg-gray-800 rounded-lg">
              <div>
                <h3 className="font-semibold text-text-light dark:text-text-dark">Allow Registration</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Enable new student registrations</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, allowRegistration: !settings.allowRegistration })}
                className={`relative w-14 h-8 rounded-full transition-colors duration-200 ${
                  settings.allowRegistration ? 'bg-primary-light dark:bg-primary-dark' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-200 ${
                    settings.allowRegistration ? 'transform translate-x-6' : ''
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-subtle-light dark:bg-gray-800 rounded-lg">
              <div>
                <h3 className="font-semibold text-text-light dark:text-text-dark">Email Verification</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Require email verification for new accounts</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, requireEmailVerification: !settings.requireEmailVerification })}
                className={`relative w-14 h-8 rounded-full transition-colors duration-200 ${
                  settings.requireEmailVerification ? 'bg-primary-light dark:bg-primary-dark' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-200 ${
                    settings.requireEmailVerification ? 'transform translate-x-6' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Maintenance Mode */}
        <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <Database className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-light dark:text-text-dark">
                Maintenance Mode
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Temporarily disable platform access
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-2 border-red-200 dark:border-red-800">
            <div>
              <h3 className="font-semibold text-text-light dark:text-text-dark">Enable Maintenance Mode</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Platform will be inaccessible to students</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
              className={`relative w-14 h-8 rounded-full transition-colors duration-200 ${
                settings.maintenanceMode ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-200 ${
                  settings.maintenanceMode ? 'transform translate-x-6' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-primary-light dark:bg-primary-dark text-white rounded-lg font-medium hover:opacity-90 transition-opacity duration-200 flex items-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  )
}
