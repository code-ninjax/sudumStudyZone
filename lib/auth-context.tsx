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
    input: {
      email: string
      password: string
      fullName: string
      faculty: string
      department: string
      level: string
      matricNumber: string
      redirectTo?: string
    }
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
    // Get initial session from Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
        setProfile(null)
      }
    }).catch((error) => {
      console.error('Error getting session:', error)
      setLoading(false)
      setProfile(null)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
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

      if (error) {
        console.error('Error fetching profile:', error)
        // If profile doesn't exist, create a default one or handle gracefully
        if (error.code === 'PGRST116') {
          console.log('Profile not found for user:', userId)
        }
        setProfile(null)
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      setProfile(null)
    } finally {
      // Always set loading to false, even if profile fetch fails
      setLoading(false)
    }
  }

  // ======================================================
  // SIGN IN
  // ======================================================
  const signIn = async (email: string, password: string) => {
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
  const signUp = async ({
    email,
    password,
    fullName,
    faculty,
    department,
    level,
    matricNumber,
    redirectTo,
  }: {
    email: string
    password: string
    fullName: string
    faculty: string
    department: string
    level: string
    matricNumber: string
    redirectTo?: string
  }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          full_name: fullName,
          faculty,
          department,
          level,
          matric_number: matricNumber,
          role: 'student', // Default role for public signups
        },
      },
    })

    if (!error && data.user) {
      // Profile creation is handled by the DB trigger
    }

    return { error }
  }

  // ======================================================
  // SIGN OUT
  // ======================================================
  const signOut = async () => {
    // Capture status before signing out
    const isAdminUser = profile?.role === 'admin'

    try {
      // Clear AI Chat History on logout
      localStorage.removeItem('sudum_chat_history')
      
      // Signing out from Supabase will trigger the onAuthStateChange listener
      await supabase.auth.signOut()
      
      // Manually push the clean state just in case, though the listener handles it
      setUser(null)
      setProfile(null)
      setSession(null)
      setLoading(false)

      if (isAdminUser) {
        router.push('/admin/login')
      } else {
        router.push('/auth/login')
      }
    } catch (error) {
      console.error('Error signing out:', error)
      // Fallback redirect
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
