import { AppointmentStatus } from "@prisma/client"
import {
  eachDayOfInterval,
  eachMonthOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths
} from "date-fns"

import { prisma } from "../../config/database"

export class AnalyticsService {
  async getDashboard() {
    const todayStart = startOfDay(new Date())
    const todayEnd = endOfDay(new Date())
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 })

    const [todayAppointments, weeklyAppointments, topRiskPatients, clinicPerformance] =
      await Promise.all([
        prisma.appointment.findMany({
          where: {
            appointmentDate: {
              gte: todayStart,
              lte: todayEnd
            }
          }
        }),
        prisma.appointment.findMany({
          where: {
            appointmentDate: {
              gte: weekStart,
              lte: weekEnd
            }
          },
          include: {
            clinic: true
          }
        }),
        prisma.patient.findMany({
          orderBy: [{ noShowScore: "desc" }, { totalNoShows: "desc" }],
          take: 5
        }),
        prisma.clinic.findMany({
          include: {
            appointments: true
          }
        })
      ])

    const total = todayAppointments.length
    const attended = todayAppointments.filter((item) => item.status === AppointmentStatus.ATTENDED).length
    const noShow = todayAppointments.filter((item) => item.status === AppointmentStatus.NO_SHOW).length
    const cancelled = todayAppointments.filter(
      (item) => item.status === AppointmentStatus.CANCELLED
    ).length
    const pending = todayAppointments.filter(
      (item) =>
        item.status === AppointmentStatus.SCHEDULED ||
        item.status === AppointmentStatus.CONFIRMED
    ).length

    const weeklyTrend = eachDayOfInterval({
      start: weekStart,
      end: weekEnd
    }).map((day) => {
      const dayAppointments = weeklyAppointments.filter(
        (appointment) =>
          appointment.appointmentDate >= startOfDay(day) &&
          appointment.appointmentDate <= endOfDay(day)
      )

      return {
        date: format(day, "yyyy-MM-dd"),
        total: dayAppointments.length,
        attended: dayAppointments.filter((item) => item.status === AppointmentStatus.ATTENDED).length,
        noShow: dayAppointments.filter((item) => item.status === AppointmentStatus.NO_SHOW).length
      }
    })

    const clinicStats = clinicPerformance.map((clinic) => {
      const totalAppointments = clinic.appointments.length
      const noShowCount = clinic.appointments.filter(
        (appointment) => appointment.status === AppointmentStatus.NO_SHOW
      ).length

      return {
        clinicId: clinic.id,
        name: clinic.name,
        totalAppointments,
        noShowCount,
        rate:
          totalAppointments === 0
            ? 0
            : Number(((noShowCount / totalAppointments) * 100).toFixed(2))
      }
    })

    return {
      todayStats: {
        total,
        attended,
        noShow,
        pending,
        cancelled
      },
      weeklyTrend,
      topRiskPatients,
      clinicPerformance: clinicStats
    }
  }

  async getNoShowTrend(period: "month" | "quarter" | "year") {
    const monthCount = period === "month" ? 1 : period === "quarter" ? 3 : 12
    const start = startOfMonth(subMonths(new Date(), monthCount - 1))
    const end = endOfMonth(new Date())

    const appointments = await prisma.appointment.findMany({
      where: {
        appointmentDate: {
          gte: start,
          lte: end
        }
      }
    })

    return eachMonthOfInterval({ start, end }).map((monthDate) => {
      const monthStart = startOfMonth(monthDate)
      const monthEnd = endOfMonth(monthDate)
      const monthlyAppointments = appointments.filter(
        (appointment) =>
          appointment.appointmentDate >= monthStart && appointment.appointmentDate <= monthEnd
      )
      const noShows = monthlyAppointments.filter(
        (appointment) => appointment.status === AppointmentStatus.NO_SHOW
      )

      return {
        month: format(monthDate, "yyyy-MM"),
        total: monthlyAppointments.length,
        count: noShows.length,
        rate:
          monthlyAppointments.length === 0
            ? 0
            : Number(((noShows.length / monthlyAppointments.length) * 100).toFixed(2))
      }
    })
  }

  async getClinicBreakdown() {
    const clinics = await prisma.clinic.findMany({
      include: {
        appointments: true
      }
    })

    return clinics.map((clinic) => {
      const total = clinic.appointments.length
      const noShow = clinic.appointments.filter(
        (appointment) => appointment.status === AppointmentStatus.NO_SHOW
      ).length
      const attended = clinic.appointments.filter(
        (appointment) => appointment.status === AppointmentStatus.ATTENDED
      ).length

      return {
        clinicId: clinic.id,
        name: clinic.name,
        total,
        attended,
        noShow,
        rate: total === 0 ? 0 : Number(((noShow / total) * 100).toFixed(2))
      }
    })
  }
}

export const analyticsService = new AnalyticsService()
