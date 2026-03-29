import { apiClient } from "./client"

export async function getPatients(params?: Record<string, string | number | undefined>) {
  const response = await apiClient.get("/patients", { params })
  return response.data.data
}

export async function getPatientById(id: string) {
  const response = await apiClient.get(`/patients/${id}`)
  return response.data.data
}

export async function getPatientStats(id: string) {
  const response = await apiClient.get(`/patients/${id}/stats`)
  return response.data.data
}

export async function getPatientTimeline(id: string) {
  const response = await apiClient.get(`/patients/${id}/timeline`)
  return response.data.data
}
