import {
  AppointmentStatus,
  NoShowReason,
  Prisma,
  TimelineType
} from "@prisma/client"
import { endOfDay, startOfDay } from "date-fns"

import { prisma } from "../../config/database"
import { ApiError } from "../../utils/apiError"
import { createPaginatedResponse, getPagination } from "../../utils/pagination"
import { recalculatePatientScore } from "../../utils/patientRisk"
import type {
  CreateAppointmentDto,
  ListAppointmentsQuery,
  UpdateAppointmentDto
} from "./appointments.schema"

const appointmentInclude = {
  patient: true,
  clinic: true,
  doctor: true,
  room: true,
  creator: {
    select: {
      id: true,
      username: true,
      firstName: true,
      lastName: true,
      role: true
    }
  }
} satisfies Prisma.AppointmentInclude

export class AppointmentsService {
  async list(query: ListAppointmentsQuery) {
    const pagination = getPagination({
      page: query.page,
      limit: query.limit
    })

    const where: Prisma.AppointmentWhereInput = {
      ...(query.date
        ? {
            appointmentDate: {
              gte: startOfDay(new Date(query.date)),
              lte: endOfDay(new Date(query.date))
            }
          }
        : {}),
      ...(query.clinicId ? { clinicId: query.clinicId } : {}),
      ...(query.doctorId ? { doctorId: query.doctorId } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.patientId ? { patientId: query.patientId } : {}),
      ...(query.search
        ? {
            patient: {
              OR: [
                { hn: { contains: query.search, mode: "insensitive" } },
                { firstName: { contains: query.search, mode: "insensitive" } },
                { lastName: { contains: query.search, mode: "insensitive" } }
              ]
            }
          }
        : {})
    }

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        include: appointmentInclude,
        orderBy: [{ appointmentDate: "asc" }, { timeFrom: "asc" }],
        skip: pagination.skip,
        take: pagination.limit
      }),
      prisma.appointment.count({ where })
    ])

    return createPaginatedResponse(appointments, total, pagination)
  }

  async getToday() {
    return prisma.appointment.findMany({
      where: {
        appointmentDate: {
          gte: startOfDay(new Date()),
          lte: endOfDay(new Date())
        }
      },
      include: appointmentInclude,
      orderBy: [{ timeFrom: "asc" }, { appointmentDate: "asc" }]
    })
  }

  async getOverdue() {
    const now = new Date()
    return prisma.appointment.findMany({
      where: {
        appointmentDate: { lt: now },
        status: {
          in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED]
        }
      },
      include: appointmentInclude,
      orderBy: [{ appointmentDate: "asc" }, { timeFrom: "asc" }]
    })
  }

  async getById(id: string) {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: appointmentInclude
    })

    if (!appointment) {
      throw new ApiError(404, "APPOINTMENT_NOT_FOUND", "ไม่พบข้อมูลนัดหมาย")
    }

    return appointment
  }

  async create(payload: CreateAppointmentDto, userId: string) {
    await this.ensurePatient(payload.patientId)

    return prisma.appointment.create({
      data: {
        ...payload,
        appointmentDate: new Date(payload.appointmentDate),
        createdBy: userId
      },
      include: appointmentInclude
    })
  }

  async update(id: string, payload: UpdateAppointmentDto) {
    await this.getById(id)

    return prisma.appointment.update({
      where: { id },
      data: {
        ...payload,
        ...(payload.appointmentDate ? { appointmentDate: new Date(payload.appointmentDate) } : {}),
        ...(payload.confirmedAt ? { confirmedAt: new Date(payload.confirmedAt) } : {}),
        ...(payload.attendedAt ? { attendedAt: new Date(payload.attendedAt) } : {}),
        ...(payload.cancelledAt ? { cancelledAt: new Date(payload.cancelledAt) } : {})
      },
      include: appointmentInclude
    })
  }

  async updateStatus(
    appointmentId: string,
    status: AppointmentStatus,
    noShowReason: NoShowReason | undefined,
    userId: string
  ) {
    const typeMap: Partial<Record<AppointmentStatus, TimelineType>> = {
      [AppointmentStatus.ATTENDED]: TimelineType.ATTENDED,
      [AppointmentStatus.NO_SHOW]: TimelineType.NO_SHOW,
      [AppointmentStatus.CANCELLED]: TimelineType.NOTE,
      [AppointmentStatus.RESCHEDULED]: TimelineType.RESCHEDULED
    }

    return prisma.$transaction(async (transaction) => {
      const appointment = await transaction.appointment.update({
        where: { id: appointmentId },
        data: {
          status,
          noShowReason,
          confirmedAt: status === AppointmentStatus.CONFIRMED ? new Date() : undefined,
          attendedAt: status === AppointmentStatus.ATTENDED ? new Date() : undefined,
          cancelledAt: status === AppointmentStatus.CANCELLED ? new Date() : undefined,
          overdueFlag: false
        },
        include: {
          patient: true,
          clinic: true,
          doctor: true,
          room: true
        }
      })

      const timelineType = typeMap[status]
      if (timelineType) {
        await transaction.timelineEntry.create({
          data: {
            patientId: appointment.patientId,
            appointmentId: appointment.id,
            type: timelineType,
            entryDate: new Date(),
            noShowReason,
            createdById: userId,
            clinicName: appointment.clinic.name,
            doctorName: appointment.doctor
              ? `${appointment.doctor.prefix}${appointment.doctor.firstName} ${appointment.doctor.lastName}`
              : undefined,
            notes: `อัปเดตสถานะ: ${status}`
          }
        })
      }

      await recalculatePatientScore(appointment.patientId, transaction)

      return transaction.appointment.findUniqueOrThrow({
        where: { id: appointment.id },
        include: appointmentInclude
      })
    })
  }

  async softDelete(id: string, userId: string) {
    return this.updateStatus(id, AppointmentStatus.CANCELLED, undefined, userId)
  }

  private async ensurePatient(patientId: string) {
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      select: { id: true }
    })

    if (!patient) {
      throw new ApiError(404, "PATIENT_NOT_FOUND", "ไม่พบข้อมูลผู้ป่วย")
    }
  }
}

export const appointmentsService = new AppointmentsService()
