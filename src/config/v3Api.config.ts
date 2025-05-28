import axios from 'axios'
import { supabase } from './supabase.config'

// Create axios instance for v3 API
export const v3Api = axios.create({
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
v3Api.interceptors.request.use(
  async (config) => {
    // Get current session
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
v3Api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, try to refresh
      const { data: { session }, error: refreshError } = await supabase.auth.refreshSession()
      
      if (refreshError || !session) {
        // Refresh failed, redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('email')
          localStorage.removeItem('userType')
          window.location.href = '/'
        }
        return Promise.reject(error)
      }
      
      // Retry the original request with new token
      const originalRequest = error.config
      originalRequest.headers.Authorization = `Bearer ${session.access_token}`
      
      return v3Api(originalRequest)
    }
    
    return Promise.reject(error)
  }
)

// Contacts API methods
export const contactsApi = {
  getAll: async () => {
    const response = await v3Api.get('/api/v3/contacts')
    return response.data
  },

  getById: async (contactId: string) => {
    const response = await v3Api.get(`/api/v3/contacts/${contactId}`)
    return response.data
  },

  create: async (contactData: {
    email: string
    fullName: string
    address: string
    phone: string
    type: string
    url?: string
  }) => {
    const response = await v3Api.post('/api/v3/contacts', contactData)
    return response.data
  },

  update: async (contactId: string, contactData: Partial<{
    email: string
    fullName: string
    address: string
    phone: string
    type: string
    url: string
  }>) => {
    const response = await v3Api.patch(`/api/v3/contacts/${contactId}`, contactData)
    return response.data
  },

  delete: async (contactId: string) => {
    const response = await v3Api.delete(`/api/v3/contacts/${contactId}`)
    return response.data
  }
}

// Upload API methods
export const uploadApi = {
  uploadImage: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await v3Api.post('/api/v3/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }
}
