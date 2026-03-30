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
  // Check for overdue appointments and mark them as NO_SHOW every 15 minutes
  cron.schedule("*/15 * * * *", async () => {
    try {
      // Call the SQL function that handles status updates, score recalculation, and risk escalation
      await prisma.$executeRaw`SELECT public.check_overdue_appointments()`
      console.log("[Scheduler] Successfully checked overdue appointments and updated no-show statuses.")
    } catch (error) {
      console.error("[Scheduler] Error checking overdue appointments:", error)
    }

    // Original overdue flag logic for reporting
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

  // Send reminders for tomorrow's appointments at 8:00 AM
  cron.schedule("0 8 * * *", async () => {
    await sendTomorrowReminders()
  })
}
