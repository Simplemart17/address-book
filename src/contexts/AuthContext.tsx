'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/config/supabase.config'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
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

  const signIn = async (email: string, password: string) => {
    let user_type = 'user';
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error;

    // Check if user is admin
    const admin = await supabase.from("admin_users").select('*').eq('id', data.user?.id).single();
    if (admin.data) {
      user_type = 'admin';
      localStorage.setItem('userType', user_type);
    } else {
      // Check if user exists in our users table and is verified
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('verified, user_type')
        .eq('user_id', data.user?.id)
        .single();

      if (userError) {
        console.error('Error fetching user data:', userError);
        throw new Error('Failed to fetch user information');
      }

      // Check if user is verified
      if (!userData?.verified) {
        // Sign out the user since they're not verified
        await supabase.auth.signOut();
        throw new Error('Account not verified! Please check your email and verify your account before logging in.');
      }
      user_type = userData.user_type || 'user';
    }

    return { userId: data.user?.id, user_type: user_type }
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
