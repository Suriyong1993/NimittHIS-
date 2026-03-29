import twilio from "twilio"

import { env } from "../../config/env"
import { prisma } from "../../config/database"
import { ApiError } from "../../utils/apiError"

export class SmsService {
  private readonly client =
    env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN
      ? twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN)
      : null

  async sendAppointmentMessage(patientId: string, message: string, appointmentId?: string) {
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      select: {
        id: true,
        phone: true
      }
    })

    if (!patient) {
      throw new ApiError(404, "PATIENT_NOT_FOUND", "ไม่พบข้อมูลผู้ป่วย")
    }

    if (!patient.phone) {
      throw new ApiError(400, "PHONE_REQUIRED", "ผู้ป่วยยังไม่มีหมายเลขโทรศัพท์")
    }

    if (!this.client || !env.TWILIO_FROM_NUMBER) {
      return {
        delivered: false,
        provider: "mock",
        patientId,
        appointmentId,
        message
      }
    }

    const result = await this.client.messages.create({
      to: patient.phone,
      from: env.TWILIO_FROM_NUMBER,
      body: message
    })

    return {
      delivered: true,
      provider: "twilio",
      sid: result.sid,
      patientId,
      appointmentId
    }
  }
}

export const smsService = new SmsService()
