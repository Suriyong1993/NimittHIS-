import { apiClient } from "./client"

export async function getAppointments(params?: Record<string, string | number | undefined>) {
  const response = await apiClient.get("/appointments", { params })
  return response.data.data
}

export async function getTodayAppointments() {
  const response = await apiClient.get("/appointments/today")
  return response.data.data
}

export async function getOverdueAppointments() {
  const response = await apiClient.get("/appointments/overdue")
  return response.data.data
}
