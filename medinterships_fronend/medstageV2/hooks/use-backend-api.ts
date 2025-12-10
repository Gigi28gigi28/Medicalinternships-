"use client"

import { useState, useCallback } from "react"
import * as apiClient from "@/lib/api-client"

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

export function useStudentProfile() {
  const [state, setState] = useState<UseApiState<any>>({
    data: null,
    loading: false,
    error: null,
  })

  const getProfile = useCallback(async (token: string) => {
    setState({ data: null, loading: true, error: null })
    try {
      const response = await apiClient.studentApi.getProfile(token)
      setState({ data: response.data, loading: false, error: null })
      return response.data
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Failed to fetch profile")
      setState({ data: null, loading: false, error: err })
      throw err
    }
  }, [])

  const updateProfile = useCallback(async (token: string, data: any) => {
    setState((prev) => ({ ...prev, loading: true }))
    try {
      const response = await apiClient.studentApi.updateProfile(token, data)
      setState({ data: response.data, loading: false, error: null })
      return response.data
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Failed to update profile")
      setState((prev) => ({ ...prev, loading: false, error: err }))
      throw err
    }
  }, [])

  return { ...state, getProfile, updateProfile }
}

export function useInternships() {
  const [state, setState] = useState<UseApiState<any[]>>({
    data: null,
    loading: false,
    error: null,
  })

  const getInternships = useCallback(async (token: string, query?: string) => {
    setState({ data: null, loading: true, error: null })
    try {
      const response = await apiClient.internshipApi.getAvailable(token)
      setState({ data: response.data, loading: false, error: null })
      return response.data
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Failed to fetch internships")
      setState({ data: null, loading: false, error: err })
      throw err
    }
  }, [])

  return { ...state, getInternships }
}

export function useApplications() {
  const [state, setState] = useState<UseApiState<any[]>>({
    data: null,
    loading: false,
    error: null,
  })

  const getApplications = useCallback(async (token: string) => {
    setState({ data: null, loading: true, error: null })
    try {
      const response = await apiClient.studentApi.getApplications(token)
      setState({ data: response.data, loading: false, error: null })
      return response.data
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Failed to fetch applications")
      setState({ data: null, loading: false, error: err })
      throw err
    }
  }, [])

  const submitApplication = useCallback(async (token: string, internshipId: string) => {
    setState((prev) => ({ ...prev, loading: true }))
    try {
      const response = await apiClient.studentApi.applyForInternship(token, internshipId)
      setState((prev) => ({
        ...prev,
        data: prev.data ? [...prev.data, response.data] : [response.data],
        loading: false,
      }))
      return response.data
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Failed to submit application")
      setState((prev) => ({ ...prev, loading: false, error: err }))
      throw err
    }
  }, [])

  return { ...state, getApplications, submitApplication }
}

export function useDocuments() {
  const [state, setState] = useState<UseApiState<any[]>>({
    data: null,
    loading: false,
    error: null,
  })

  const getDocuments = useCallback(async (token: string) => {
    setState({ data: null, loading: true, error: null })
    try {
      const response = await apiClient.studentApi.getDocuments(token)
      setState({ data: response.data, loading: false, error: null })
      return response.data
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Failed to fetch documents")
      setState({ data: null, loading: false, error: err })
      throw err
    }
  }, [])

  const uploadDocument = useCallback(async (token: string, file: File) => {
    setState((prev) => ({ ...prev, loading: true }))
    try {
      const response = await apiClient.studentApi.uploadDocument(token, file)
      setState((prev) => ({
        ...prev,
        data: prev.data ? [...prev.data, response.data] : [response.data],
        loading: false,
      }))
      return response.data
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Failed to upload document")
      setState((prev) => ({ ...prev, loading: false, error: err }))
      throw err
    }
  }, [])

  const deleteDocument = useCallback(async (token: string, documentId: string) => {
    setState((prev) => ({ ...prev, loading: true }))
    try {
      await apiClient.studentApi.deleteDocument(token, documentId)
      setState((prev) => ({
        ...prev,
        data: prev.data?.filter((doc: any) => doc.id !== documentId) || null,
        loading: false,
      }))
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Failed to delete document")
      setState((prev) => ({ ...prev, loading: false, error: err }))
      throw err
    }
  }, [])

  return { ...state, getDocuments, uploadDocument, deleteDocument }
}

export function useNotifications() {
  const [state, setState] = useState<UseApiState<any[]>>({
    data: null,
    loading: false,
    error: null,
  })

  const getNotifications = useCallback(async (token: string) => {
    setState({ data: null, loading: true, error: null })
    try {
      const response = await apiClient.notificationApi.getAll(token)
      setState({ data: response.data, loading: false, error: null })
      return response.data
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Failed to fetch notifications")
      setState({ data: null, loading: false, error: err })
      throw err
    }
  }, [])

  const markAsRead = useCallback(async (token: string, notificationId: string) => {
    try {
      await apiClient.notificationApi.markAsRead(token, notificationId)
      setState((prev) => ({
        ...prev,
        data:
          prev.data?.map((notif: any) => (notif.id === notificationId ? { ...notif, is_read: true } : notif)) || null,
      }))
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Failed to mark as read")
      throw err
    }
  }, [])

  return { ...state, getNotifications, markAsRead }
}

export function useEstablishments() {
  const [state, setState] = useState<UseApiState<any[]>>({
    data: null,
    loading: false,
    error: null,
  })

  const getEstablishments = useCallback(async (token: string) => {
    setState({ data: null, loading: true, error: null })
    try {
      const response = await apiClient.adminApi.getEstablishments(token)
      setState({ data: response.data, loading: false, error: null })
      return response.data
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Failed to fetch establishments")
      setState({ data: null, loading: false, error: err })
      throw err
    }
  }, [])

  return { ...state, getEstablishments }
}

export function useUsers() {
  const [state, setState] = useState<UseApiState<any[]>>({
    data: null,
    loading: false,
    error: null,
  })

  const getUsers = useCallback(async (token: string, role?: string) => {
    setState({ data: null, loading: true, error: null })
    try {
      const response = await apiClient.adminApi.getUsers(token, role)
      setState({ data: response.data, loading: false, error: null })
      return response.data
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Failed to fetch users")
      setState({ data: null, loading: false, error: err })
      throw err
    }
  }, [])

  const createUser = useCallback(async (token: string, data: any) => {
    setState((prev) => ({ ...prev, loading: true }))
    try {
      const response = await apiClient.adminApi.createUser(token, data)
      setState((prev) => ({
        ...prev,
        data: prev.data ? [...prev.data, response.data] : [response.data],
        loading: false,
      }))
      return response.data
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Failed to create user")
      setState((prev) => ({ ...prev, loading: false, error: err }))
      throw err
    }
  }, [])

  const updateUser = useCallback(async (token: string, userId: string, data: any) => {
    setState((prev) => ({ ...prev, loading: true }))
    try {
      const response = await apiClient.adminApi.updateUser(token, userId, data)
      setState((prev) => ({
        ...prev,
        data: prev.data?.map((user: any) => (user.id === userId ? response.data : user)) || null,
        loading: false,
      }))
      return response.data
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Failed to update user")
      setState((prev) => ({ ...prev, loading: false, error: err }))
      throw err
    }
  }, [])

  const deleteUser = useCallback(async (token: string, userId: string) => {
    setState((prev) => ({ ...prev, loading: true }))
    try {
      await apiClient.adminApi.deleteUser(token, userId)
      setState((prev) => ({
        ...prev,
        data: prev.data?.filter((user: any) => user.id !== userId) || null,
        loading: false,
      }))
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Failed to delete user")
      setState((prev) => ({ ...prev, loading: false, error: err }))
      throw err
    }
  }, [])

  return { ...state, getUsers, createUser, updateUser, deleteUser }
}
