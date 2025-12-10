// User Types
export interface User {
  id: string
  email: string
  role: "STUDENT" | "PERSONNEL" | "CHIEF" | "DOCTOR" | "ADMIN"
  is_active: boolean
  last_login: string | null
  created_at: string
  updated_at: string
}

export interface Student extends User {
  matricule: string
  first_name: string
  last_name: string
  phone: string
  level: "L2" | "L3" | "M1" | "M2"
  specialty: string
  university: string
  batch: string
  cv_file_url: string | null
  profile_photo_url: string | null
}

export interface Personnel extends User {
  first_name: string
  last_name: string
  phone: string
  position: string
  role: "CHIEF" | "DOCTOR" | "SUPERVISOR"
  establishment_id: string
  department_id: string | null
}

// Establishment Types
export interface Establishment {
  id: string
  name: string
  type: "HOSPITAL" | "CLINIC" | "RESEARCH_CENTER"
  address: string
  city: string
  wilaya: string
  phone: string
  email: string
  website: string | null
  principal_chief_id: string | null
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface Department {
  id: string
  establishment_id: string
  name: string
  description: string
  chief_doctor_id: string | null
  created_at: string
  updated_at: string
}

// Internship Types
export interface Internship {
  id: string
  establishment_id: string
  department_id: string
  title: string
  description: string
  duration_weeks: number
  available_places: number
  filled_places: number
  start_date: string
  end_date: string
  requirements: string
  supervisor_id: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

// Application Types
export interface Application {
  id: string
  student_id: string
  internship_id: string
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN"
  applied_at: string
  reviewed_at: string | null
  rejection_reason: string | null
  created_at: string
  updated_at: string
}

// Evaluation Types
export interface Evaluation {
  id: string
  application_id: string
  student_id: string
  evaluator_id: string
  score: number
  comments: string
  attendance_rate: number
  evaluation_date: string
  status: "PENDING" | "COMPLETED" | "ARCHIVED"
  created_at: string
  updated_at: string
}

// Notification Types
export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: "APPLICATION_STATUS" | "EVALUATION" | "SYSTEM" | "MESSAGE"
  is_read: boolean
  action_url: string | null
  created_at: string
}

// Document Types
export interface Document {
  id: string
  student_id: string
  file_name: string
  file_type: string
  file_url: string
  file_size: number
  document_type: "TRANSCRIPT" | "CERTIFICATE" | "CV" | "OTHER"
  uploaded_at: string
  created_at: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    current_page: number
    total_pages: number
    total_count: number
    per_page: number
  }
}
