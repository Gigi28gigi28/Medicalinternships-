// This file should be imported in your API routes to standardize all backend calls

export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
}

// API Endpoints mapping
export const ENDPOINTS = {
  AUTH: {
    STUDENT_LOGIN: "/auth/student-login",
    STUDENT_REGISTER: "/auth/student-register",
    PERSONNEL_LOGIN: "/auth/personnel-login",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh",
  },
  INTERNSHIPS: {
    LIST: "/internships",
    GET_ONE: (id: string) => `/internships/${id}`,
    SEARCH: "/internships/search",
    AVAILABLE: "/internships/available",
  },
  APPLICATIONS: {
    LIST: "/applications",
    SUBMIT: "/applications/submit",
    GET_ONE: (id: string) => `/applications/${id}`,
    UPDATE_STATUS: (id: string) => `/applications/${id}/status`,
  },
  HOSPITALS: {
    LIST: "/hospitals",
    GET_ONE: (id: string) => `/hospitals/${id}`,
  },
  CONTACT: "/contact",
  NEWSLETTER: {
    SUBSCRIBE: "/newsletter/subscribe",
  },
  DASHBOARD: {
    STUDENT: "/student/dashboard",
    PERSONNEL: "/personnel/dashboard",
  },
}

// Helper function to make API calls
export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_CONFIG.baseUrl}${endpoint}`

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...API_CONFIG.headers,
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("[API Error]", error)
    throw error
  }
}
