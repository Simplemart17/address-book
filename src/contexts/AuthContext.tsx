'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/config/supabase.config'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  userType: string
  signIn: (email: string, password: string) => Promise<{ userId: string; user_type: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [userType, setUserType] = useState('user')

  useEffect(() => {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      setLoading(false)
      return
    }

    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          const storedType = localStorage.getItem('userType')
          if (storedType) setUserType(storedType)
        }
      } catch (error) {
        console.error('Error getting session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (!session) {
        setUserType('user')
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    let user_type = 'user'
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    const admin = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', data.user?.id)
      .single()

    if (admin.data) {
      user_type = 'admin'
      localStorage.setItem('userType', user_type)
    } else {
      const { data: userData, error: userError } = await supabase
        .from('contact_users')
        .select('verified, user_type')
        .eq('user_id', data.user?.id)
        .single()

      if (userError) {
        throw new Error('Failed to fetch user information')
      }

      if (!userData?.verified) {
        await supabase.auth.signOut()
        throw new Error(
          'Account not verified! Please check your email and verify your account before logging in.',
        )
      }

      user_type = userData.user_type || 'user'
      localStorage.setItem('userType', user_type)
    }

    setUserType(user_type)
    return { userId: data.user?.id!, user_type }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error

    localStorage.removeItem('email')
    localStorage.removeItem('userType')
    setUserType('user')
  }

  return (
    <AuthContext.Provider
      value={{ user, session, loading, userType, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
