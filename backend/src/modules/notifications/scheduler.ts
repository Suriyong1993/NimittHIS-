import { AppointmentStatus } from "@prisma/client"
import { addDays, endOfDay, startOfDay, subHours } from "date-fns"
import cron from "node-cron"

import { prisma } from "../../config/database"
import { smsService } from "./sms.service"

export async function sendTomorrowReminders() {
  const tomorrow = addDays(new Date(), 1)
  const appointments = await prisma.appointment.findMany({
    where: {
      appointmentDate: {
        gte: startOfDay(tomorrow),
        lte: endOfDay(tomorrow)
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

  for (const appointment of appointments) {
    if (!appointment.patient.phone) {
      continue
    }

    await smsService.sendAppointmentMessage(
      appointment.patientId,
      `แจ้งเตือนนัดหมายเวลา ${appointment.timeFrom} คลินิก${appointment.clinic.name}`,
      appointment.id
    )

    await prisma.appointment.update({
      where: { id: appointment.id },
      data: {
        smsReminderSent: true
      }
    })
  }
}

export function startNotificationScheduler() {
  cron.schedule("*/15 * * * *", async () => {
    const twoHoursAgo = subHours(new Date(), 2)
    await prisma.appointment.updateMany({
      where: {
        appointmentDate: { lt: twoHoursAgo },
        status: {
          in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED]
        },
        overdueFlag: false
      },
      data: { overdueFlag: true }
    })
  })

  cron.schedule("0 8 * * *", async () => {
    await sendTomorrowReminders()
  })
}
