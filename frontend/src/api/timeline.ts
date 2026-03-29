import { apiClient } from "./client"

export async function createTimelineEntry(patientId: string, payload: Record<string, unknown>) {
  const response = await apiClient.post(`/patients/${patientId}/timeline`, payload)
  return response.data.data
}
