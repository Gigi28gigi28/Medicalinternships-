export interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
  level: "deux_ans" | "trois_ans" | "quatre_ans" | "cinq_ans" | "six_ans"
  specialty: string
  profilePhoto?: string
  registrationDate: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Establishment {
  id: string
  name: string
  city: string
  address?: string
  phone?: string
  email?: string
  website?: string
  type: "CHU" | "Clinique" | "Hôpital" | "Polyclinique"
  departments: number
  totalStudents: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Department {
  id: string
  name: string
  description?: string
  establishmentId: string
  chiefId: string
  totalPlaces: number
  availablePlaces: number
  createdAt: Date
  updatedAt: Date
}

export interface Internship {
  id: string
  title: string
  description: string
  departmentId: string
  establishmentId: string
  totalPlaces: number
  filledPlaces: number
  duration: string
  startDate: Date
  endDate: Date
  requirements?: string
  status: "Actif" | "Complet" | "Archivé" | "Clôturé"
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface Application {
  id: string
  studentId: string
  internshipId: string
  status: "En attente" | "Acceptée" | "Refusée" | "Annulée"
  appliedDate: Date
  startDate?: Date
  departmentTitle: string
  hospital: string
  motivationLetter?: string
  cv?: string
  responseDate?: Date
  rejectionReason?: string
  createdAt: Date
  updatedAt: Date
}

export interface Evaluation {
  id: string
  studentId: string
  internshipId: string
  doctorId: string
  status: "En attente" | "En cours" | "Soumise"
  startDate?: Date
  dueDate: Date
  submissionDate?: Date
  score?: number
  comments?: string
  evaluationForm?: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  email: string
  password: string
  role: "student" | "chief" | "doctor" | "admin"
  firstName: string
  lastName: string
  phone?: string
  profilePhoto?: string
  establishmentId?: string
  departmentId?: string
  isActive: boolean
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Notification {
  id: string
  userId: string
  type: "success" | "warning" | "error" | "info"
  title: string
  message: string
  relatedEntityType?: string
  relatedEntityId?: string
  isRead: boolean
  createdAt: Date
  readAt?: Date
}

export interface Document {
  id: string
  studentId: string
  name: string
  fileUrl: string
  fileSize: number
  mimeType: string
  uploadedDate: Date
  createdAt: Date
  updatedAt: Date
}
