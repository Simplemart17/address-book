// Database types for the shared Supabase project. This app owns the
// "contacts" schema; user_id holds Clerk user ids (TEXT, not UUID).
export interface Database {
  __InternalSupabase: {
    PostgrestVersion: '12'
  }
  contacts: {
    Tables: {
      contacts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          full_name: string
          address: string
          phone: string
          type: string
          url: string | null
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          email: string
          full_name: string
          address: string
          phone: string
          type: string
          url?: string | null
          user_id?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          full_name?: string
          address?: string
          phone?: string
          type?: string
          url?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      contact_type: 'Friend' | 'Colleague' | 'Mate'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Contact = Database['contacts']['Tables']['contacts']['Row']
export type ContactInsert = Database['contacts']['Tables']['contacts']['Insert']
export type ContactUpdate = Database['contacts']['Tables']['contacts']['Update']
