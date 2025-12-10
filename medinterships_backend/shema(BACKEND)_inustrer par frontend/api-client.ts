const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

interface FetchOptions extends RequestInit {
  token?: string
}

export async function apiRequest<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...fetchOptions.headers,
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `API Error: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error("[API Request Error]", error)
    throw error
  }
}

// Auth API calls
export const authApi = {
  studentLogin: (matricule: string, password: string) =>
    apiRequest("/auth/student-login", {
      method: "POST",
      body: JSON.stringify({ matricule, password }),
    }),

  personnelLogin: (email: string, password: string) =>
    apiRequest("/auth/personnel-login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: (token: string) =>
    apiRequest("/auth/logout", {
      method: "POST",
      token,
    }),

  refreshToken: (token: string) =>
    apiRequest("/auth/refresh", {
      method: "POST",
      token,
    }),
}

// Student API calls
export const studentApi = {
  getProfile: (token: string) =>
    apiRequest("/students/profile", {
      method: "GET",
      token,
    }),

  updateProfile: (token: string, data: Partial<any>) =>
    apiRequest("/students/profile", {
      method: "PUT",
      body: JSON.stringify(data),
      token,
    }),

  getApplications: (token: string) =>
    apiRequest("/students/applications", {
      method: "GET",
      token,
    }),

  getInternships: (token: string, query?: string) => {
    const url = query ? `/internships?${query}` : "/internships"
    return apiRequest(url, {
      method: "GET",
      token,
    })
  },

  applyForInternship: (token: string, internshipId: string) =>
    apiRequest("/applications/submit", {
      method: "POST",
      body: JSON.stringify({ internship_id: internshipId }),
      token,
    }),

  getDocuments: (token: string) =>
    apiRequest("/students/documents", {
      method: "GET",
      token,
    }),

  uploadDocument: (token: string, file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    return apiRequest("/students/documents/upload", {
      method: "POST",
      body: formData,
      token,
      headers: {}, // Let browser set Content-Type for multipart
    })
  },

  deleteDocument: (token: string, documentId: string) =>
    apiRequest(`/students/documents/${documentId}`, {
      method: "DELETE",
      token,
    }),
}

// Internship API calls
export const internshipApi = {
  getAvailable: (token: string) =>
    apiRequest("/internships/available", {
      method: "GET",
      token,
    }),

  getById: (token: string, id: string) =>
    apiRequest(`/internships/${id}`, {
      method: "GET",
      token,
    }),

  search: (token: string, query: string) =>
    apiRequest(`/internships/search?q=${encodeURIComponent(query)}`, {
      method: "GET",
      token,
    }),
}

// Evaluation API calls
export const evaluationApi = {
  getByApplication: (token: string, applicationId: string) =>
    apiRequest(`/evaluations/application/${applicationId}`, {
      method: "GET",
      token,
    }),

  getAllForStudent: (token: string) =>
    apiRequest("/evaluations", {
      method: "GET",
      token,
    }),
}

// Notification API calls
export const notificationApi = {
  getAll: (token: string) =>
    apiRequest("/notifications", {
      method: "GET",
      token,
    }),

  markAsRead: (token: string, notificationId: string) =>
    apiRequest(`/notifications/${notificationId}/read`, {
      method: "PUT",
      token,
    }),

  markAllAsRead: (token: string) =>
    apiRequest("/notifications/read-all", {
      method: "PUT",
      token,
    }),
}

// Admin API calls for establishments and users
export const adminApi = {
  getEstablishments: (token: string) =>
    apiRequest("/establishments", {
      method: "GET",
      token,
    }),

  getUsers: (token: string, role?: string) => {
    const url = role ? `/users?role=${role}` : "/users"
    return apiRequest(url, {
      method: "GET",
      token,
    })
  },

  createUser: (token: string, data: any) =>
    apiRequest("/users", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),

  updateUser: (token: string, userId: string, data: any) =>
    apiRequest(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(data),
      token,
    }),

  deleteUser: (token: string, userId: string) =>
    apiRequest(`/users/${userId}`, {
      method: "DELETE",
      token,
    }),
}
