'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  BookOpen,
  ChevronDown,
  Download,
  LogOut,
  Menu,
  Search,
  User,
  X,
} from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '@/lib/auth-context'

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement | null>(null)
  const { user, profile, signOut, isAdmin } = useAuth()

  if (pathname && pathname.startsWith('/admin')) return null
  if (pathname && pathname.startsWith('/student')) return null

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!profileRef.current?.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/blog', label: 'Blog' },
    { href: '/search', label: 'Search' },
    { href: '/study-hub', label: 'Study Hub' },
    { href: '/about', label: 'About' },
  ]

  const dashboardHref = isAdmin ? '/admin' : '/student'

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200/70 bg-white/92 shadow-sm backdrop-blur-xl transition-all duration-300 dark:border-white/5 dark:bg-background-dark/92">
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between gap-4 lg:h-20">
          <Link href="/" className="flex min-w-0 items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-premium-gradient text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="block truncate text-base font-black uppercase tracking-tight text-text-light dark:text-text-dark sm:text-lg">
                Sudum Study
              </span>
              <span className="block text-[9px] font-black uppercase tracking-[0.24em] text-primary-light">
                Academic Portal
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-bold transition-colors ${
                  pathname === link.href
                    ? 'text-primary-light'
                    : 'text-gray-600 hover:text-primary-light dark:text-gray-300 dark:hover:text-primary-dark'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-gray-600 transition hover:border-primary-light hover:text-primary-light dark:border-white/10 dark:text-gray-300"
            >
              <Search className="h-4 w-4" />
              Search
            </Link>
            <ThemeToggle />
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen((open) => !open)}
                  className="inline-flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-left transition hover:border-primary-light dark:border-white/10 dark:bg-subtle-dark"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light/10 font-black text-primary-light dark:bg-primary-dark/10 dark:text-primary-dark">
                    {profile?.full_name?.[0] || user.email?.[0] || 'U'}
                  </div>
                  <div className="max-w-36">
                    <p className="truncate text-sm font-black text-text-light dark:text-text-dark">
                      {profile?.full_name || 'My Account'}
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">
                      {isAdmin ? 'Administrator' : 'Student'}
                    </p>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-[calc(100%+0.75rem)] w-64 overflow-hidden rounded-[1.75rem] border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-subtle-dark">
                    <div className="border-b border-gray-100 px-5 py-4 dark:border-white/5">
                      <p className="text-sm font-black text-text-light dark:text-text-dark">
                        {profile?.full_name || user.email}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                    <div className="p-3">
                      <Link
                        href={dashboardHref}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-text-light transition hover:bg-gray-50 dark:text-text-dark dark:hover:bg-white/5"
                      >
                        <User className="h-4 w-4 text-primary-light" />
                        Open Dashboard
                      </Link>
                      {!isAdmin && (
                        <Link
                          href="/student/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-text-light transition hover:bg-gray-50 dark:text-text-dark dark:hover:bg-white/5"
                        >
                          <User className="h-4 w-4 text-primary-light" />
                          View Profile
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false)
                          signOut()
                        }}
                        className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="rounded-2xl px-4 py-2.5 text-sm font-black text-primary-light transition hover:opacity-80"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-2xl bg-premium-gradient px-5 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-lg"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen((open) => !open)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 text-gray-600 dark:border-white/10 dark:text-gray-300"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="no-print border-t border-gray-200 py-4 animate-slide-down dark:border-white/5 md:hidden">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-3 grid gap-2 border-t border-gray-200 pt-3 dark:border-white/5">
                {user ? (
                  <>
                    <Link
                      href={dashboardHref}
                      onClick={() => setIsOpen(false)}
                      className="rounded-2xl bg-primary-light/10 px-4 py-3 text-sm font-black text-primary-light"
                    >
                      Open Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setIsOpen(false)
                        signOut()
                      }}
                      className="rounded-2xl px-4 py-3 text-left text-sm font-black text-red-500"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      onClick={() => setIsOpen(false)}
                      className="rounded-2xl px-4 py-3 text-sm font-black text-primary-light"
                    >
                      Login
                    </Link>
                    <Link
                      href="/auth/signup"
                      onClick={() => setIsOpen(false)}
                      className="rounded-2xl bg-premium-gradient px-4 py-3 text-center text-[11px] font-black uppercase tracking-[0.2em] text-white"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
                <Link
                  href="/search"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-black text-gray-600 dark:border-white/10 dark:text-gray-300"
                >
                  <Search className="h-4 w-4" />
                  Search
                </Link>
                <a
                  href="/manifest.json"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-black text-gray-600 dark:border-white/10 dark:text-gray-300"
                >
                  <Download className="h-4 w-4" />
                  App Info
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
