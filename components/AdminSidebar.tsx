'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  FileText, 
  DollarSign, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Library,
  Video
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Users, label: 'Students', href: '/admin/students' },
  { icon: BookOpen, label: 'Assignments Management', href: '/admin/assignments' },
  { icon: Video, label: 'Online Classes', href: '/admin/schedule-class' },
  { icon: FileText, label: 'Write Blog', href: '/admin/blog' },
  { icon: FileText, label: 'Manage Blogs', href: '/admin/blog/manage' },
  { icon: BarChart3, label: 'Blog Categories', href: '/admin/blog/categories' },
  { icon: Library, label: 'eBooks Management', href: '/admin/ebooks' },
  { icon: DollarSign, label: 'Revenue', href: '/admin/revenue' },
  { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
]

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const { profile, user, signOut } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut()
    router.push('/admin/login')
  }

  return (
    <>
      {/* Mobile Menu Button - Floating Style */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white dark:bg-subtle-dark text-primary-light dark:text-primary-dark rounded-xl shadow-lg border border-gray-100 dark:border-white/10"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - Floating Design */}
      <aside
        className={`fixed top-0 lg:top-4 left-0 lg:left-4 h-full lg:h-[calc(100vh-2rem)] z-40 transform transition-all duration-500 ease-in-out bg-white/80 dark:bg-background-dark/80 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-none lg:rounded-3xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${isCollapsed ? 'w-20' : 'w-72'}`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header Section */}
          <div className="p-8 pb-4">
            <div className="flex items-center justify-between mb-8">
              {!isCollapsed && (
                <Link href="/" className="group flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-black text-xl">S</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-black text-text-light dark:text-text-dark leading-none tracking-tight">SUDUM</span>
                    <span className="text-[10px] font-bold text-primary-light dark:text-primary-dark tracking-[0.2em]">ADMIN</span>
                  </div>
                </Link>
              )}
              {isCollapsed && (
                <div className="w-10 h-10 bg-primary-light/10 dark:bg-primary-dark/10 rounded-xl flex items-center justify-center mx-auto">
                   <span className="text-primary-light dark:text-primary-dark font-black">S</span>
                </div>
              )}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:flex items-center justify-center w-8 h-8 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors text-gray-400"
              >
                {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
              </button>
            </div>

            {/* Admin Profile Glance */}
            {!isCollapsed && profile && (
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center gap-4 group transition-all duration-300 hover:shadow-md">
                <div className="w-10 h-10 rounded-full bg-primary-light/20 dark:bg-primary-dark/20 flex items-center justify-center text-primary-light dark:text-primary-dark font-bold border border-primary-light/10">
                  {profile.full_name?.[0] || user?.email?.[0] || 'A'}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold text-text-light dark:text-text-dark truncate">
                    {profile.full_name || 'Administrator'}
                  </p>
                  <p className="text-[10px] font-black text-primary-light dark:text-primary-dark uppercase tracking-widest truncate">
                    System Admin
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto no-scrollbar">
            {!isCollapsed && (
               <p className="px-4 mb-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">Admin Modules</p>
            )}
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`group relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? 'bg-primary-light/[0.08] dark:bg-primary-dark/[0.08] text-primary-light dark:text-primary-dark'
                      : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'
                  } ${isCollapsed ? 'justify-center px-0' : ''}`}
                >
                  {/* Active Indicator Bar */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-light dark:bg-primary-dark rounded-full shadow-[0_0_12px_rgba(var(--primary-light),0.5)]" />
                  )}
                  
                  <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  
                  {!isCollapsed && (
                    <span className={`text-sm tracking-tight font-bold transition-all duration-300`}>
                      {item.label}
                    </span>
                  )}

                  {/* Tooltip for collapsed mode */}
                  {isCollapsed && (
                    <div className="absolute left-20 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Footer / Logout */}
          <div className="p-6">
            <button 
              onClick={handleLogout}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-300 w-full group ${isCollapsed ? 'justify-center px-0' : ''}`}
            >
              <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              {!isCollapsed && <span className="text-sm font-bold tracking-tight">System Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
