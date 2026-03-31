import { apiClient } from "./client"

export async function createTimelineEntry(patientId: string, payload: Record<string, unknown>) {
  const response = await apiClient.post(`/patients/${patientId}/timeline`, payload)
  return response.data.data
}

export async function createFollowUpNote(patientId: string, notes: string) {
  const response = await apiClient.post(`/patients/${patientId}/timeline`, {
    type: "PHONE_FOLLOWUP",
    entryDate: new Date().toISOString(),
    notes
  })

  return response.data.data
}
