import { Prisma, TimelineType } from "@prisma/client"

import { prisma } from "../../config/database"
import { ApiError } from "../../utils/apiError"
import { createPaginatedResponse, getPagination } from "../../utils/pagination"
import { recalculatePatientScore } from "../../utils/patientRisk"
import type {
  CreateTimelineEntryDto,
  ListTimelineQuery,
  UpdateTimelineEntryDto
} from "./timeline.schema"

const timelineInclude = {
  creator: {
    select: {
      id: true,
      firstName: true,
      lastName: true
    }
  }
} satisfies Prisma.TimelineEntryInclude

export class TimelineService {
  async list(patientId: string, query: ListTimelineQuery) {
    const pagination = getPagination({
      page: query.page,
      limit: query.limit
    })

    const where: Prisma.TimelineEntryWhereInput = {
      patientId,
      ...(query.type ? { type: query.type } : {})
    }

    const [entries, total] = await Promise.all([
      prisma.timelineEntry.findMany({
        where,
        include: timelineInclude,
        orderBy: { entryDate: "desc" },
        skip: pagination.skip,
        take: pagination.limit
      }),
      prisma.timelineEntry.count({ where })
    ])

    return createPaginatedResponse(entries, total, pagination)
  }

  async create(patientId: string, data: CreateTimelineEntryDto, userId: string) {
    await this.ensurePatientExists(patientId)

    return prisma.$transaction(async (transaction) => {
      const created = await transaction.timelineEntry.create({
        data: {
          patientId,
          appointmentId: data.appointmentId,
          createdById: userId,
          type: data.type,
          entryDate: new Date(data.entryDate),
          clinicName: data.clinicName,
          doctorName: data.doctorName,
          notes: data.notes,
          noShowReason: data.noShowReason
        },
        include: timelineInclude
      })

      if (data.type === TimelineType.ATTENDED || data.type === TimelineType.NO_SHOW) {
        await recalculatePatientScore(patientId, transaction)
      }

      return created
    })
  }

  async updateEntry(entryId: string, data: UpdateTimelineEntryDto, editorId: string) {
    const existing = await prisma.timelineEntry.findUnique({
      where: { id: entryId }
    })

    if (!existing) {
      throw new ApiError(404, "TIMELINE_NOT_FOUND", "ไม่พบรายการ timeline")
    }

    return prisma.$transaction(async (transaction) => {
      const updated = await transaction.timelineEntry.update({
        where: { id: entryId },
        data: {
          ...(data.type ? { type: data.type } : {}),
          ...(data.entryDate ? { entryDate: new Date(data.entryDate) } : {}),
          ...(data.clinicName !== undefined ? { clinicName: data.clinicName } : {}),
          ...(data.doctorName !== undefined ? { doctorName: data.doctorName } : {}),
          ...(data.notes !== undefined ? { notes: data.notes } : {}),
          ...(data.noShowReason !== undefined ? { noShowReason: data.noShowReason } : {}),
          lastEditedBy: editorId,
          lastEditedAt: new Date()
        },
        include: timelineInclude
      })

      if (
        existing.type === TimelineType.ATTENDED ||
        existing.type === TimelineType.NO_SHOW ||
        updated.type === TimelineType.ATTENDED ||
        updated.type === TimelineType.NO_SHOW
      ) {
        await recalculatePatientScore(existing.patientId, transaction)
      }

      return updated
    })
  }

  async delete(entryId: string) {
    const existing = await prisma.timelineEntry.findUnique({
      where: { id: entryId }
    })

    if (!existing) {
      throw new ApiError(404, "TIMELINE_NOT_FOUND", "ไม่พบรายการ timeline")
    }

    await prisma.$transaction(async (transaction) => {
      await transaction.timelineEntry.delete({
        where: { id: entryId }
      })

      if (existing.type === TimelineType.ATTENDED || existing.type === TimelineType.NO_SHOW) {
        await recalculatePatientScore(existing.patientId, transaction)
      }
    })
  }

  private async ensurePatientExists(patientId: string) {
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      select: { id: true }
    })

    if (!patient) {
      throw new ApiError(404, "PATIENT_NOT_FOUND", "ไม่พบข้อมูลผู้ป่วย")
    }
  }
}

export const timelineService = new TimelineService()
