'use client'

import { useState } from 'react'
import { Bell, Lock, Eye, Globe, Moon, Sun, Zap, ArrowRight } from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'

const ComingSoonBadge = () => (
  <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold rounded-full">
    <Zap className="w-3 h-3" />
    Coming Soon
  </span>
)

export default function StudentSettingsPage() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-text-light dark:text-text-dark mb-3 tracking-tight">
          System Preferences
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium">
          Personalize your workspace experience and aesthetics.
        </p>
      </div>

      <div className="grid gap-8">
        {/* Security Section */}
        <section className="bg-white/80 dark:bg-subtle-dark/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-100 dark:border-white/5 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-primary-light/10 dark:bg-primary-dark/10 rounded-2xl flex items-center justify-center">
              <Lock className="w-6 h-6 text-primary-light dark:text-primary-dark" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-light dark:text-text-dark">Security</h2>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">Account Protection</p>
            </div>
          </div>

          <Link
            href="/auth/forgot-password"
            className="group flex items-center justify-between p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-transparent hover:border-primary-light/20 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
                <Lock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <h3 className="font-bold text-text-light dark:text-text-dark">Reset Password</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Change your password via email verification
                </p>
              </div>
            </div>
            
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-light group-hover:translate-x-1 transition-all" />
          </Link>
        </section>

        {/* Appearance Section - The Only Functional One */}
        <section className="bg-white/80 dark:bg-subtle-dark/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-100 dark:border-white/5 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-primary-light/10 dark:bg-primary-dark/10 rounded-2xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-primary-light dark:text-primary-dark" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-light dark:text-text-dark">Aesthetics</h2>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">Interface Styling</p>
            </div>
          </div>

          <div className="group flex items-center justify-between p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-transparent hover:border-primary-light/20 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-primary-dark" />
                ) : (
                  <Sun className="w-5 h-5 text-primary-light" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-text-light dark:text-text-dark">Dark Mode</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {theme === 'dark' ? 'Optimum for late night study' : 'Classic bright interface'}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`relative w-14 h-8 rounded-full transition-all duration-500 ease-in-out ${
                theme === 'dark' ? 'bg-primary-light dark:bg-primary-dark' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-all duration-500 shadow-lg flex items-center justify-center ${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
                }`}
              >
                {theme === 'dark' ? <Moon className="w-3 h-3 text-primary-dark" /> : <Sun className="w-3 h-3 text-amber-500" />}
              </div>
            </button>
          </div>
        </section>

        {/* Coming Soon Sections Consolidated */}
        <section className="bg-gray-50/50 dark:bg-white/[0.02] border border-dashed border-gray-200 dark:border-white/10 rounded-3xl p-12 text-center">
          <div className="max-w-xs mx-auto space-y-4">
            <div className="w-16 h-16 bg-white dark:bg-subtle-dark rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <Zap className="w-8 h-8 text-amber-500 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-text-light dark:text-text-dark">Advanced Controls</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Notifications, Security, and Language settings are being optimized for your account.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-200/30">
              Evolution in Progress
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
