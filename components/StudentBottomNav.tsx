'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Settings,
  Menu,
  X,
  Lightbulb,
  Library,
  Bot,
  User,
  LogOut
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'

const primaryLinks = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/student' },
  { icon: BookOpen, label: 'Assignments', href: '/student/assignments' },
  { icon: FileText, label: 'Blog', href: '/student/blog' },
  { icon: Settings, label: 'Settings', href: '/student/settings' },
]

const otherLinks = [
  { icon: Lightbulb, label: 'Study Hub', href: '/student/study-hub' },
  { icon: Library, label: 'eBooks', href: '/student/ebooks' },
  { icon: Bot, label: 'AI Assistant', href: '/student/ai-chat' },
  { icon: User, label: 'Profile', href: '/student/profile' },
]

export default function StudentBottomNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { profile, user, signOut } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut()
    router.push('/auth/login')
  }

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden animate-fade-in"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white dark:bg-background-dark z-[70] transform transition-transform duration-500 ease-out lg:hidden shadow-2xl ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center justify-between border-b border-gray-100 dark:border-white/5">
            <h2 className="text-xl font-black text-text-light dark:text-text-dark tracking-tight">More Links</h2>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2 no-scrollbar">
            {/* User Profile in Drawer */}
            <div className="mb-8 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-light/20 dark:bg-primary-dark/20 flex items-center justify-center text-primary-light dark:text-primary-dark font-bold text-xl border border-primary-light/10">
                {profile?.full_name?.[0] || user?.email?.[0] || 'U'}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-base font-bold text-text-light dark:text-text-dark truncate">
                  {profile?.full_name || 'Sandra Bullock'}
                </p>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest truncate">
                  {profile?.role || 'Verified Student'}
                </p>
              </div>
            </div>

            <p className="px-4 mb-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">Services</p>
            {otherLinks.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? 'bg-primary-light/[0.08] dark:bg-primary-dark/[0.08] text-primary-light dark:text-primary-dark'
                      : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                  <item.icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''}`} />
                  <span className="text-base font-bold tracking-tight">{item.label}</span>
                </Link>
              )
            })}
          </div>

          <div className="p-6 border-t border-gray-100 dark:border-white/5">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-4 px-4 py-4 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-300 w-full font-bold"
            >
              <LogOut className="w-6 h-6" />
              <span>Logout System</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/80 dark:bg-background-dark/80 backdrop-blur-xl border-t border-white/20 dark:border-white/5 lg:hidden z-50 flex items-center justify-around px-2 shadow-[0_-8px_32px_0_rgba(31,38,135,0.07)]">
        {primaryLinks.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center gap-1.5 w-16 h-16 rounded-2xl transition-all duration-300 ${
                isActive
                  ? 'text-primary-light dark:text-primary-dark'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
              }`}
            >
              <item.icon className={`w-6 h-6 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
              <span className="text-[10px] font-black uppercase tracking-tighter truncate w-full text-center">
                {item.label}
              </span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary-light dark:bg-primary-dark rounded-full shadow-[0_0_12px_rgba(var(--primary-light),0.5)]" />
              )}
            </Link>
          )
        })}

        {/* Hamburger Menu Trigger */}
        <button
          onClick={() => setIsMenuOpen(true)}
          className={`flex flex-col items-center justify-center gap-1.5 w-16 h-16 rounded-2xl transition-all duration-300 ${
            isMenuOpen
              ? 'text-primary-light dark:text-primary-dark'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
          }`}
        >
          <Menu className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Menu</span>
        </button>
      </nav>
    </>
  )
}
