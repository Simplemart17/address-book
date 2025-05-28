'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/config/supabase.config'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setLoading(false)
      return
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Error getting session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          user_type: 'user'
        }
      }
    })

    if (error) throw error;

    const supabaseUser = data.user;

    // save data into users table
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        user_id: supabaseUser?.id,
        email: supabaseUser?.email,
        full_name: supabaseUser?.user_metadata.full_name,
        password: "managed-by-supabase",
        verified: false,
        user_type: 'user'
      })

    if (insertError) throw insertError;

    return data;
  }

  const signIn = async (email: string, password: string) => {
    let user_type = 'user';
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    // check the admin_users table if the data.user_id matches
    const admin = await supabase.from("admin_users").select('*').eq('id', data.user?.id).single();
    if (admin.data) {
      user_type = 'admin';
      localStorage.setItem('userType', user_type);
    }

    return { ...data, user_type: user_type }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error

    // Clear localStorage
    localStorage.removeItem('email')
    localStorage.removeItem('userType')
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
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
