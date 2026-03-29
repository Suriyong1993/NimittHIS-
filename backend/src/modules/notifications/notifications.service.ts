import { AppointmentStatus } from "@prisma/client"
import { endOfDay, startOfDay } from "date-fns"

import { prisma } from "../../config/database"
import { smsService } from "./sms.service"

export class NotificationsService {
  async sendSms(patientId: string, message: string, appointmentId?: string) {
    return smsService.sendAppointmentMessage(patientId, message, appointmentId)
  }

  async sendBulkReminder(date: string) {
    const targetDate = new Date(date)
    const appointments = await prisma.appointment.findMany({
      where: {
        appointmentDate: {
          gte: startOfDay(targetDate),
          lte: endOfDay(targetDate)
        },
        status: {
          in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED]
        },
        smsReminderSent: false
      },
      include: {
        patient: true,
        clinic: true
      }
    })

    const results = []
    for (const appointment of appointments) {
      if (!appointment.patient.phone) {
        continue
      }

      const message = `แจ้งเตือนนัดหมายเวลา ${appointment.timeFrom} คลินิก${appointment.clinic.name}`
      const sent = await smsService.sendAppointmentMessage(
        appointment.patientId,
        message,
        appointment.id
      )

      await prisma.appointment.update({
        where: { id: appointment.id },
        data: {
          smsReminderSent: true
        }
      })

      results.push(sent)
    }

    return results
  }
}

export const notificationsService = new NotificationsService()
