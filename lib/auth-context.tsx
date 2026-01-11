'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/packages/supabase/src/client'
import type { User, Session } from '@supabase/supabase-js'
import type { Profile } from '@/packages/supabase/src/types'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error: any }>
  signOut: () => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const router = useRouter()

  // ======================================================
  // INITIAL SESSION + AUTH STATE LISTENER
  // ======================================================
  useEffect(() => {
    // Check for hardcoded admin session in localStorage first
    const savedAdminSession = localStorage.getItem('admin-hardcoded-session')
    if (savedAdminSession) {
      try {
        const adminData = JSON.parse(savedAdminSession)
        
        // Check if session has expired
        const now = Math.floor(Date.now() / 1000)
        if (adminData.expires_at && adminData.expires_at < now) {
          // Session expired, remove it
          localStorage.removeItem('admin-hardcoded-session')
          setLoading(false)
        } else {
          // Session is valid, restore it immediately
          const mockUser = {
            id: 'admin-hardcoded-id',
            email: 'sudum@admin',
          } as User

          const mockProfile: Profile = {
            id: 'admin-hardcoded-id',
            role: 'admin',
            full_name: 'Admin User',
            faculty: null,
            department: null,
            matric_number: null,
            created_at: adminData.created_at,
            updated_at: adminData.updated_at,
          }

          const mockSession: Session = {
            access_token: 'admin-hardcoded-token',
            refresh_token: 'admin-hardcoded-refresh',
            expires_in: 3600 * 24 * 30,
            expires_at: adminData.expires_at,
            token_type: 'bearer',
            user: mockUser,
          }

          // Set all state synchronously
          setUser(mockUser)
          setProfile(mockProfile)
          setSession(mockSession)
          setLoading(false)
          return
        }
      } catch (error) {
        console.error('Error restoring admin session:', error)
        localStorage.removeItem('admin-hardcoded-session')
        setLoading(false)
      }
    }

    // Get initial session from Supabase (only if no admin session was found or expired)
    if (!savedAdminSession || !localStorage.getItem('admin-hardcoded-session')) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session)
        setUser(session?.user ?? null)
        if (session?.user) {
          fetchProfile(session.user.id)
        } else {
          setLoading(false)
        }
      })
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      // Don't override hardcoded admin session
      const currentAdminSession = localStorage.getItem('admin-hardcoded-session')
      if (currentAdminSession) {
        return
      }
      
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // ======================================================
  // FETCH USER PROFILE
  // ======================================================
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error

      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  // ======================================================
  // SIGN IN
  // ======================================================
  const signIn = async (email: string, password: string) => {
    // Check for hardcoded admin credentials
    if (email === 'sudum@admin' && password === 'admin') {
      // Create mock admin user and profile
      const now = new Date().toISOString()
      const expiresAt = Math.floor(Date.now() / 1000) + 3600 * 24 * 30 // 30 days
      
      const mockUser = {
        id: 'admin-hardcoded-id',
        email: 'sudum@admin',
      } as User

      const mockProfile: Profile = {
        id: 'admin-hardcoded-id',
        role: 'admin',
        full_name: 'Admin User',
        faculty: null,
        department: null,
        matric_number: null,
        created_at: now,
        updated_at: now,
      }

      const mockSession: Session = {
        access_token: 'admin-hardcoded-token',
        refresh_token: 'admin-hardcoded-refresh',
        expires_in: 3600 * 24 * 30,
        expires_at: expiresAt,
        token_type: 'bearer',
        user: mockUser,
      }

      // Save to localStorage for persistence
      localStorage.setItem('admin-hardcoded-session', JSON.stringify({
        created_at: now,
        updated_at: now,
        expires_at: expiresAt,
      }))

      setUser(mockUser)
      setProfile(mockProfile)
      setSession(mockSession)
      setLoading(false)
      return { error: null }
    }

    // Normal Supabase authentication for other users
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (!error && data.user) {
      await fetchProfile(data.user.id)
    }

    return { error }
  }

  // ======================================================
  // SIGN UP
  // ======================================================
  const signUp = async (
    email: string,
    password: string,
    fullName: string
  ) => {
    // Check if this is admin signup
    const isAdminSignup = email === 'admin@studyzone.com' && password === 'admin123'

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: isAdminSignup ? 'admin' : 'student',
        },
      },
    })

    if (!error && data.user) {
      // Create profile manually since trigger may not work
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          full_name: fullName,
          role: isAdminSignup ? 'admin' : 'student',
        })

      if (profileError) {
        console.error('Error creating profile:', profileError)
      }
    }

    return { error }
  }

  // ======================================================
  // SIGN OUT
  // ======================================================
  const signOut = async () => {
    // Check if it's hardcoded admin by checking localStorage or user ID
    const savedAdminSession = localStorage.getItem('admin-hardcoded-session')
    const isHardcodedAdmin = savedAdminSession || user?.id === 'admin-hardcoded-id'
    
    // Clear hardcoded admin session first
    localStorage.removeItem('admin-hardcoded-session')
    
    // Clear state immediately
    setUser(null)
    setProfile(null)
    setSession(null)
    setLoading(false)
    
    // Only sign out from Supabase if it's not a hardcoded admin
    if (!isHardcodedAdmin) {
      try {
        await supabase.auth.signOut()
      } catch (error) {
        console.error('Error signing out from Supabase:', error)
      }
    }
    
    // Redirect to appropriate login page
    if (isHardcodedAdmin) {
      router.push('/admin/login')
    } else {
      router.push('/auth/login')
    }
  }

  // ======================================================
  // ROLE CHECK
  // ======================================================
  const isAdmin = profile?.role === 'admin'

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
