import { AppointmentStatus, Prisma, type PrismaClient } from "@prisma/client"

import { buildPatientRiskSummary } from "./noShowScore"

type PrismaExecutor = PrismaClient | Prisma.TransactionClient

export async function recalculatePatientScore(
  patientId: string,
  executor: PrismaExecutor
) {
  const appointments = await executor.appointment.findMany({
    where: {
      patientId,
      status: {
        not: AppointmentStatus.CANCELLED
      }
    },
    select: {
      appointmentDate: true,
      status: true
    }
  })

  const summary = buildPatientRiskSummary(appointments)
  const totalAttended = appointments.filter(
    (appointment) => appointment.status === AppointmentStatus.ATTENDED
  ).length

  return executor.patient.update({
    where: { id: patientId },
    data: {
      totalAppointments: summary.totalAppointments,
      totalAttended,
      totalNoShows: summary.totalNoShows,
      noShowScore: summary.noShowScore,
      riskLevel: summary.riskLevel
    }
  })
}
