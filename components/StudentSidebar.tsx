'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  BookOpen, 
  Library, 
  FileText, 
  Lightbulb, 
  MessageSquare, 
  Settings, 
  User,
  LogOut,
  Menu,
  X,
  Bot,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/student' },
  { icon: BookOpen, label: 'My Assignments', href: '/student/assignments' },
  { icon: FileText, label: 'Result Scores', href: '/student/scores' },
  { icon: Lightbulb, label: 'Study Hub', href: '/student/study-hub' },
  { icon: Library, label: 'eBooks', href: '/student/ebooks' },
  { icon: FileText, label: 'Blog', href: '/student/blog' },
  { icon: Bot, label: 'AI Assistant', href: '/student/ai-chat' },
  { icon: User, label: 'Profile', href: '/student/profile' },
  { icon: Settings, label: 'Settings', href: '/student/settings' },
]

export default function StudentSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const { profile, user, signOut } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut()
    router.push('/auth/login')
  }

  return (
    <aside
      className={`fixed top-0 lg:top-4 left-0 lg:left-4 h-full lg:h-[calc(100vh-2rem)] z-40 transform transition-all duration-500 ease-in-out bg-white/80 dark:bg-background-dark/80 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-none lg:rounded-3xl hidden lg:flex flex-col ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
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
                  <span className="text-[10px] font-bold text-primary-light dark:text-primary-dark tracking-[0.2em]">STUDY</span>
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

          {/* Profile Glance */}
          {!isCollapsed && (
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center gap-4 group transition-all duration-300 hover:shadow-md animate-fade-in">
              <div className="w-10 h-10 rounded-full bg-primary-light/20 dark:bg-primary-dark/20 flex items-center justify-center text-primary-light dark:text-primary-dark font-bold border border-primary-light/10">
                {profile?.full_name?.[0] || user?.email?.[0] || 'U'}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-text-light dark:text-text-dark truncate">
                  {profile?.full_name || 'Sandra Bullock'}
                </p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">
                  {profile?.role || 'Verified Student'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto no-scrollbar">
          {!isCollapsed && (
             <p className="px-4 mb-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">Navigation</p>
          )}
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
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
            {!isCollapsed && <span className="text-sm font-bold tracking-tight">Logout System</span>}
          </button>
        </div>
      </div>
    </aside>
  )
}
