import { apiClient } from "./client"

export async function getDashboardStats() {
  const response = await apiClient.get("/analytics/dashboard")
  return response.data.data
}

export async function getNoShowTrend(period: "month" | "quarter" | "year") {
  const response = await apiClient.get("/analytics/noshow-trend", {
    params: { period }
  })
  return response.data.data
}

export async function getClinicBreakdown() {
  const response = await apiClient.get("/analytics/clinic-breakdown")
  return response.data.data
}
