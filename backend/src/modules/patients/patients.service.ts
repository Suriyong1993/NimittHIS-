import { Prisma, type Patient } from "@prisma/client"
import { differenceInYears } from "date-fns"

import { prisma } from "../../config/database"
import { ApiError } from "../../utils/apiError"
import { createPaginatedResponse, getPagination } from "../../utils/pagination"
import type {
  CreatePatientDto,
  ListPatientsQuery,
  UpdatePatientDto
} from "./patients.schema"

const patientDetailInclude = {
  appointments: {
    orderBy: {
      appointmentDate: "desc" as const
    },
    take: 5,
    include: {
      clinic: true,
      doctor: true,
      room: true
    }
  },
  timelineEntries: {
    orderBy: {
      entryDate: "desc" as const
    },
    take: 5,
    include: {
      creator: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      }
    }
  }
} satisfies Prisma.PatientInclude

const serializePatient = (patient: Patient) => ({
  ...patient,
  fullName: `${patient.firstName} ${patient.lastName}`,
  age: differenceInYears(new Date(), patient.dateOfBirth)
})

export class PatientsService {
  async list(query: ListPatientsQuery) {
    const pagination = getPagination({
      page: query.page,
      limit: query.limit
    })

    const where: Prisma.PatientWhereInput = {
      ...(query.riskLevel ? { riskLevel: query.riskLevel } : {}),
      ...(query.search
        ? {
            OR: [
              { hn: { contains: query.search, mode: "insensitive" } },
              { firstName: { contains: query.search, mode: "insensitive" } },
              { lastName: { contains: query.search, mode: "insensitive" } },
              { phone: { contains: query.search, mode: "insensitive" } }
            ]
          }
        : {})
    }

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        orderBy: [{ noShowScore: "desc" }, { updatedAt: "desc" }],
        skip: pagination.skip,
        take: pagination.limit
      }),
      prisma.patient.count({ where })
    ])

    return createPaginatedResponse(
      patients.map(serializePatient),
      total,
      pagination
    )
  }

  async getById(id: string) {
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: patientDetailInclude
    })

    if (!patient) {
      throw new ApiError(404, "PATIENT_NOT_FOUND", "ไม่พบข้อมูลผู้ป่วย")
    }

    return {
      ...serializePatient(patient),
      appointments: patient.appointments,
      timelineEntries: patient.timelineEntries
    }
  }

  async create(payload: CreatePatientDto) {
    const patient = await prisma.patient.create({
      data: {
        ...payload,
        dateOfBirth: new Date(payload.dateOfBirth)
      }
    })

    return serializePatient(patient)
  }

  async update(id: string, payload: UpdatePatientDto) {
    await this.ensureExists(id)

    const patient = await prisma.patient.update({
      where: { id },
      data: {
        ...payload,
        ...(payload.dateOfBirth ? { dateOfBirth: new Date(payload.dateOfBirth) } : {})
      }
    })

    return serializePatient(patient)
  }

  async getStats(id: string) {
    await this.ensureExists(id)

    const [patient, appointments] = await Promise.all([
      prisma.patient.findUniqueOrThrow({
        where: { id }
      }),
      prisma.appointment.findMany({
        where: { patientId: id },
        orderBy: { appointmentDate: "asc" }
      })
    ])

    const attendanceBase = patient.totalAttended + patient.totalNoShows
    const lastAppointment =
      appointments
        .filter((appointment) => appointment.appointmentDate <= new Date())
        .at(-1)?.appointmentDate ?? null
    const nextAppointment =
      appointments.find((appointment) => appointment.appointmentDate >= new Date())?.appointmentDate ?? null

    return {
      totalAppointments: patient.totalAppointments,
      totalAttended: patient.totalAttended,
      totalNoShows: patient.totalNoShows,
      noShowScore: patient.noShowScore,
      riskLevel: patient.riskLevel,
      attendanceRate:
        attendanceBase === 0
          ? 0
          : Number(((patient.totalAttended / attendanceBase) * 100).toFixed(2)),
      lastAppointment,
      nextAppointment
    }
  }

  async getHighRisk(limit: number) {
    const patients = await prisma.patient.findMany({
      orderBy: [{ noShowScore: "desc" }, { totalNoShows: "desc" }, { updatedAt: "desc" }],
      take: limit
    })

    return patients.map(serializePatient)
  }

  private async ensureExists(id: string) {
    const exists = await prisma.patient.findUnique({
      where: { id },
      select: { id: true }
    })

    if (!exists) {
      throw new ApiError(404, "PATIENT_NOT_FOUND", "ไม่พบข้อมูลผู้ป่วย")
    }
  }
}

export const patientsService = new PatientsService()
