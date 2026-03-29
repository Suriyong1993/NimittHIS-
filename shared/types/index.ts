export type RiskLevel = "LOW" | "MEDIUM" | "HIGH"

export type AppointmentStatus =
  | "SCHEDULED"
  | "CONFIRMED"
  | "ATTENDED"
  | "NO_SHOW"
  | "CANCELLED"
  | "RESCHEDULED"

export type NoShowReason =
  | "FORGOT"
  | "SICK"
  | "TRANSPORTATION"
  | "FINANCIAL"
  | "NO_ANSWER"
  | "OTHER"

export type TimelineType =
  | "ATTENDED"
  | "NO_SHOW"
  | "RESCHEDULED"
  | "PHONE_FOLLOWUP"
  | "NOTE"
  | "LAB_ORDER"
  | "XRAY_ORDER"
  | "SURGERY"
  | "ALLERGY"
  | "MEDICATION"

export interface Patient {
  id: string
  hn: string
  firstName: string
  lastName: string
  fullName: string
  dateOfBirth: string
  age: number
  gender: string
  bloodType?: string
  phone?: string
  idCard?: string
  insuranceType?: string
  allergies: string[]
  totalAppointments: number
  totalAttended: number
  totalNoShows: number
  noShowScore: number
  riskLevel: RiskLevel
}

export interface Appointment {
  id: string
  patientId: string
  patient: Pick<
    Patient,
    "id" | "hn" | "firstName" | "lastName" | "riskLevel" | "noShowScore"
  >
  clinicId: string
  clinic: { id: string; name: string }
  doctor?: { id: string; prefix: string; firstName: string; lastName: string }
  room?: { id: string; name: string }
  appointmentDate: string
  timeFrom: string
  timeTo: string
  reason: string
  notes?: string
  status: AppointmentStatus
  noShowReason?: NoShowReason
  overdueFlag: boolean
  createdAt: string
}

export interface TimelineEntry {
  id: string
  patientId: string
  appointmentId?: string
  type: TimelineType
  entryDate: string
  clinicName?: string
  doctorName?: string
  notes?: string
  noShowReason?: NoShowReason
  originalCreatedAt: string
  createdAt: string
  lastEditedBy?: string
  lastEditedAt?: string
  creator: { id: string; firstName: string; lastName: string }
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface DashboardStats {
  todayStats: {
    total: number
    attended: number
    noShow: number
    pending: number
    cancelled: number
    attendanceRate: number
  }
  riskPatientsCount: number
  overdueCount: number
  unconfirmedTomorrow: number
}
