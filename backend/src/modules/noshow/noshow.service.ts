import { AppointmentStatus, Prisma } from "@prisma/client"
import { eachMonthOfInterval, endOfDay, endOfMonth, format, startOfDay, startOfMonth } from "date-fns"

import { prisma } from "../../config/database"
import { appointmentsService } from "../appointments/appointments.service"

export class NoShowService {
  async getRiskList() {
    const tomorrow = new Date()
    const start = startOfDay(new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate() + 1))
    const end = endOfDay(new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate() + 1))

    return prisma.appointment.findMany({
      where: {
        appointmentDate: {
          gte: start,
          lte: end
        },
        status: {
          in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED]
        }
      },
      include: {
        patient: true,
        clinic: true,
        doctor: true,
        room: true
      },
      orderBy: [
        {
          patient: {
            noShowScore: "desc"
          }
        },
        { timeFrom: "asc" }
      ]
    })
  }

  async getTodayUnattended() {
    const now = new Date()
    return prisma.appointment.findMany({
      where: {
        appointmentDate: {
          gte: startOfDay(now),
          lte: now
        },
        status: {
          in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED]
        }
      },
      include: {
        patient: true,
        clinic: true,
        doctor: true,
        room: true
      },
      orderBy: [{ appointmentDate: "asc" }, { timeFrom: "asc" }]
    })
  }

  async getStatistics(filters: { from?: string; to?: string; clinicId?: string }) {
    const from = filters.from ? startOfDay(new Date(filters.from)) : startOfMonth(new Date())
    const to = filters.to ? endOfDay(new Date(filters.to)) : endOfDay(new Date())

    const where: Prisma.AppointmentWhereInput = {
      appointmentDate: {
        gte: from,
        lte: to
      },
      ...(filters.clinicId ? { clinicId: filters.clinicId } : {})
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        clinic: true
      }
    })

    const total = appointments.length
    const noShowAppointments = appointments.filter(
      (appointment) => appointment.status === AppointmentStatus.NO_SHOW
    )
    const noShowCount = noShowAppointments.length
    const noShowRate = total === 0 ? 0 : Number(((noShowCount / total) * 100).toFixed(2))

    const reasonKeys = ["FORGOT", "SICK", "TRANSPORTATION", "FINANCIAL", "NO_ANSWER", "OTHER"] as const
    const byReason = Object.fromEntries(
      reasonKeys.map((reason) => [
        reason,
        noShowAppointments.filter((appointment) => appointment.noShowReason === reason).length
      ])
    )

    const clinicMap = new Map<
      string,
      { clinicId: string; name: string; total: number; noShow: number }
    >()

    appointments.forEach((appointment) => {
      const current = clinicMap.get(appointment.clinicId) ?? {
        clinicId: appointment.clinicId,
        name: appointment.clinic.name,
        total: 0,
        noShow: 0
      }

      current.total += 1
      if (appointment.status === AppointmentStatus.NO_SHOW) {
        current.noShow += 1
      }

      clinicMap.set(appointment.clinicId, current)
    })

    const months = eachMonthOfInterval({
      start: startOfMonth(from),
      end: endOfMonth(to)
    })

    const byMonth = months.map((monthDate) => {
      const monthStart = startOfMonth(monthDate)
      const monthEnd = endOfMonth(monthDate)
      const monthlyAppointments = appointments.filter(
        (appointment) =>
          appointment.appointmentDate >= monthStart && appointment.appointmentDate <= monthEnd
      )
      const monthlyNoShows = monthlyAppointments.filter(
        (appointment) => appointment.status === AppointmentStatus.NO_SHOW
      )

      return {
        month: format(monthDate, "yyyy-MM"),
        count: monthlyNoShows.length,
        rate:
          monthlyAppointments.length === 0
            ? 0
            : Number(((monthlyNoShows.length / monthlyAppointments.length) * 100).toFixed(2))
      }
    })

    return {
      total,
      noShowCount,
      noShowRate,
      byReason,
      byClinic: Array.from(clinicMap.values()).map((item) => ({
        clinicId: item.clinicId,
        name: item.name,
        rate: item.total === 0 ? 0 : Number(((item.noShow / item.total) * 100).toFixed(2))
      })),
      byMonth
    }
  }

  async bulkUpdateStatus(
    appointmentIds: string[],
    status: AppointmentStatus,
    userId: string
  ) {
    const results = []
    for (const appointmentId of appointmentIds) {
      const updated = await appointmentsService.updateStatus(appointmentId, status, undefined, userId)
      results.push(updated)
    }

    return results
  }
}

export const noShowService = new NoShowService()
