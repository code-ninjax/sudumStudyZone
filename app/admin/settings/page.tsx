'use client'

import { useState, useEffect } from 'react'
import { Save, Globe, Bell, Shield, Database, Loader2 } from 'lucide-react'
import { getMaintenanceMode, setMaintenanceMode } from '@/packages/supabase/src/settings'
import { supabase } from '@/packages/supabase/src/client'

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    siteName: 'Sudum Study',
    siteDescription: 'Academic Learning Platform',
    contactEmail: 'admin@sudumstudy.com',
    allowRegistration: true,
    requireEmailVerification: true,
    maintenanceMode: false,
    maintenanceMessage: "The system is currently undergoing maintenance. Please check back later."
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    try {
      const mode = await getMaintenanceMode()
      setSettings({
        ...settings,
        maintenanceMode: mode.enabled,
        maintenanceMessage: mode.message || ""
      })
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await setMaintenanceMode(settings.maintenanceMode, settings.maintenanceMessage)
      alert("Settings saved successfully!")
    } catch (error) {
      alert("Failed to save settings.")
    } finally {
      setSaving(false)
    }
  }

  const toggleMaintenance = () => {
    const nextValue = !settings.maintenanceMode
    const message = nextValue 
      ? "ARE YOU ABSOLUTELY SURE? This will block all student access to the platform."
      : "Disable maintenance mode and restore student access?"
    
    if (confirm(message)) {
      setSettings({ ...settings, maintenanceMode: nextValue })
    }
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

          <div className="flex flex-col gap-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-2 border-red-200 dark:border-red-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-text-light dark:text-text-dark">Enable Maintenance Mode</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Platform will be inaccessible to students</p>
              </div>
              <button
                onClick={toggleMaintenance}
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

            <div>
              <label className="block text-sm font-bold text-red-900 dark:text-red-200 mb-2 uppercase tracking-widest">
                Maintenance Message
              </label>
              <textarea
                value={settings.maintenanceMessage}
                onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
                rows={2}
                placeholder="Enter message for students..."
                className="w-full p-4 rounded-xl border border-red-200 dark:border-red-800 bg-white/50 dark:bg-black/20 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-10 py-4 bg-premium-gradient text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center space-x-3 ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Synchronizing...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
