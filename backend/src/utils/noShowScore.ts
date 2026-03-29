import { AppointmentStatus, RiskLevel, type Appointment } from "@prisma/client"
import { subDays } from "date-fns"

export interface NoShowScoreInput {
  totalAppointments: number
  totalNoShows: number
  recentNoShows: number
  consecutiveNoShows: number
}

export function calculateNoShowScore(patient: NoShowScoreInput): number {
  if (patient.totalAppointments === 0) return 0

  const baseRate = patient.totalNoShows / patient.totalAppointments
  const recentWeight =
    patient.recentNoShows > 0
      ? (patient.recentNoShows / Math.min(patient.totalAppointments, 5)) * 0.4
      : 0

  const consecutiveWeight = Math.min(patient.consecutiveNoShows * 0.15, 0.3)
  const rawScore = baseRate * 0.3 + recentWeight + consecutiveWeight

  return Math.min(parseFloat(rawScore.toFixed(3)), 1)
}

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 0.6) return RiskLevel.HIGH
  if (score >= 0.3) return RiskLevel.MEDIUM
  return RiskLevel.LOW
}

export interface AppointmentStatusLike {
  appointmentDate: Date
  status: AppointmentStatus
}

export function deriveNoShowMetrics(appointments: AppointmentStatusLike[]): NoShowScoreInput {
  const eligible = appointments
    .filter(
      (appointment) =>
        appointment.status === AppointmentStatus.ATTENDED ||
        appointment.status === AppointmentStatus.NO_SHOW
    )
    .sort((a, b) => b.appointmentDate.getTime() - a.appointmentDate.getTime())

  const ninetyDaysAgo = subDays(new Date(), 90)
  const totalAppointments = eligible.length
  const totalNoShows = eligible.filter((appointment) => appointment.status === AppointmentStatus.NO_SHOW).length
  const recentNoShows = eligible.filter(
    (appointment) =>
      appointment.status === AppointmentStatus.NO_SHOW && appointment.appointmentDate >= ninetyDaysAgo
  ).length

  let consecutiveNoShows = 0
  for (const appointment of eligible) {
    if (appointment.status === AppointmentStatus.NO_SHOW) {
      consecutiveNoShows += 1
      continue
    }

    break
  }

  return {
    totalAppointments,
    totalNoShows,
    recentNoShows,
    consecutiveNoShows
  }
}

export function buildPatientRiskSummary(appointments: AppointmentStatusLike[]) {
  const metrics = deriveNoShowMetrics(appointments)
  const score = calculateNoShowScore(metrics)

  return {
    ...metrics,
    noShowScore: score,
    riskLevel: getRiskLevel(score)
  }
}
