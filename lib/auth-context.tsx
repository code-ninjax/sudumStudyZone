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
    // Only run on client side to prevent SSR issues
    if (typeof window === 'undefined') {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setUser(data.session?.user ?? null)

      if (data.session?.user) {
        fetchProfile(data.session.user.id)
      } else {
        setLoading(false)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
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
    const isAdminLogin = email === 'admin@studyzone.com' && password === 'admin123'

    if (isAdminLogin) {
      // For admin login, we need to either create the admin user or handle it specially
      // First try normal login, if it fails, we might need to create the admin account
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // If admin doesn't exist, we could create it here, but for now let's return the error
        // In production, you'd want to create the admin account separately
        return { error }
      }

      if (data.user) {
        await fetchProfile(data.user.id)
        // Ensure the profile has admin role
        if (profile && profile.role !== 'admin') {
          // Update the profile to admin role
          await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', data.user.id)
        }
      }

      return { error }
    }

    // Normal user login
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
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setSession(null)
    router.push('/auth/login')
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
