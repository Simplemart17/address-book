// Thin fetch wrappers around the app's API routes. Auth rides on the
// Clerk session cookie (same-origin), so no token handling is needed.

async function request<T = Record<string, unknown>>(
  url: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(url, init)
  const body = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(body?.message || `Request failed (${response.status})`)
  }

  return body as T
}

function jsonInit(method: string, data: unknown): RequestInit {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }
}

export const contactsApi = {
  getAll: () => request('/api/contacts'),

  create: (contactData: {
    email: string
    fullName: string
    address: string
    phone: string
    type: string
    url?: string
  }) => request('/api/contacts', jsonInit('POST', contactData)),

  update: (
    contactId: string,
    contactData: Partial<{
      email: string
      fullName: string
      address: string
      phone: string
      type: string
      url: string
    }>,
  ) => request(`/api/contacts/${contactId}`, jsonInit('PATCH', contactData)),

  delete: (contactId: string) =>
    request(`/api/contacts/${contactId}`, { method: 'DELETE' }),
}

export const usersApi = {
  getAll: () => request('/api/users'),

  updateStatus: (userId: string) =>
    request(`/api/users/${userId}`, { method: 'PATCH' }),

  updateUser: (userId: string, fullName: string) =>
    request(`/api/users/${userId}`, jsonInit('PUT', { full_name: fullName })),

  delete: (userId: string) =>
    request(`/api/users/${userId}`, { method: 'DELETE' }),
}

export const uploadApi = {
  uploadImage: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return request<{ success: boolean; url: string }>('/api/upload', {
      method: 'POST',
      body: formData,
    })
  },
}
