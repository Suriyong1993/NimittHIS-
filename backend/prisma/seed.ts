import {
  AppointmentStatus,
  NoShowReason,
  PrismaClient,
  RiskLevel,
  Role,
  TimelineType
} from "@prisma/client"
import bcrypt from "bcryptjs"
import {
  addDays,
  addHours,
  addMonths,
  set,
  subDays,
  subHours,
  subMonths
} from "date-fns"

import { buildPatientRiskSummary } from "../src/utils/noShowScore"

const prisma = new PrismaClient()

type SeedPatient = {
  hn: string
  firstName: string
  lastName: string
  dateOfBirth: Date
  gender: string
  bloodType?: string
  phone?: string
  idCard?: string
  insuranceType?: string
  allergies: string[]
  passportNo?: string
}

const appointmentTime = (date: Date, hour: number, minute = 0) =>
  set(date, {
    hours: hour,
    minutes: minute,
    seconds: 0,
    milliseconds: 0
  })

async function main() {
  await prisma.timelineEntry.deleteMany()
  await prisma.appointment.deleteMany()
  await prisma.room.deleteMany()
  await prisma.doctor.deleteMany()
  await prisma.clinic.deleteMany()
  await prisma.patient.deleteMany()
  await prisma.user.deleteMany()

  const passwordHashes = await Promise.all([
    bcrypt.hash("nurse123", 10),
    bcrypt.hash("doctor123", 10),
    bcrypt.hash("mgr123", 10),
    bcrypt.hash("admin123", 10)
  ])

  const [nurse, doctorUser, manager, admin] = await Promise.all([
    prisma.user.create({
      data: {
        username: "nurse01",
        passwordHash: passwordHashes[0],
        firstName: "พิมพ์ใจ",
        lastName: "พยาบาล",
        role: Role.NURSE
      }
    }),
    prisma.user.create({
      data: {
        username: "doctor01",
        passwordHash: passwordHashes[1],
        firstName: "กิตติ",
        lastName: "แพทย์ดี",
        role: Role.DOCTOR
      }
    }),
    prisma.user.create({
      data: {
        username: "manager01",
        passwordHash: passwordHashes[2],
        firstName: "ณัฐวุฒิ",
        lastName: "บริหาร",
        role: Role.MANAGER
      }
    }),
    prisma.user.create({
      data: {
        username: "admin01",
        passwordHash: passwordHashes[3],
        firstName: "อภิชา",
        lastName: "ผู้ดูแลระบบ",
        role: Role.ADMIN
      }
    })
  ])

  const clinics = await Promise.all([
    prisma.clinic.create({ data: { name: "อายุรกรรม", nameEn: "Internal Medicine" } }),
    prisma.clinic.create({ data: { name: "กุมารเวช", nameEn: "Pediatrics" } }),
    prisma.clinic.create({ data: { name: "ศัลยกรรม", nameEn: "Surgery" } }),
    prisma.clinic.create({ data: { name: "สูตินรีเวช", nameEn: "Obstetrics and Gynecology" } }),
    prisma.clinic.create({ data: { name: "ตรวจโรคทั่วไป", nameEn: "General Practice" } }),
    prisma.clinic.create({ data: { name: "โรคหัวใจ", nameEn: "Cardiology" } })
  ])

  const rooms = await Promise.all(
    clinics.map((clinic, index) =>
      prisma.room.create({
        data: {
          name: `ห้องตรวจ ${index + 1}`,
          clinicId: clinic.id
        }
      })
    )
  )

  const doctors = await Promise.all([
    prisma.doctor.create({
      data: {
        prefix: "นพ.",
        firstName: "กมล",
        lastName: "สุขใจ",
        specialty: "อายุรกรรม",
        clinicId: clinics[0].id
      }
    }),
    prisma.doctor.create({
      data: {
        prefix: "พญ.",
        firstName: "วารี",
        lastName: "ดวงดาว",
        specialty: "กุมารเวช",
        clinicId: clinics[1].id
      }
    }),
    prisma.doctor.create({
      data: {
        prefix: "นพ.",
        firstName: "สมชาย",
        lastName: "รักษ์ดี",
        specialty: "ศัลยกรรม",
        clinicId: clinics[2].id
      }
    }),
    prisma.doctor.create({
      data: {
        prefix: "พญ.",
        firstName: "ปัทมา",
        lastName: "เจริญสุข",
        specialty: "โรคหัวใจ",
        clinicId: clinics[5].id
      }
    })
  ])

  const patientSeeds: SeedPatient[] = [
    {
      hn: "0001234",
      firstName: "สมชาย",
      lastName: "ทองดี",
      dateOfBirth: new Date("1974-04-14"),
      gender: "ชาย",
      bloodType: "B",
      phone: "0811112233",
      idCard: "1101700234567",
      insuranceType: "บัตรทอง",
      allergies: ["Penicillin"]
    },
    {
      hn: "0001235",
      firstName: "รัตนา",
      lastName: "มีสุข",
      dateOfBirth: new Date("1969-11-02"),
      gender: "หญิง",
      bloodType: "O",
      phone: "0822223344",
      idCard: "1101700234568",
      insuranceType: "ประกันสังคม",
      allergies: ["Ibuprofen"]
    },
    {
      hn: "0002891",
      firstName: "วิไล",
      lastName: "รักษ์ดี",
      dateOfBirth: new Date("1980-07-21"),
      gender: "หญิง",
      bloodType: "A",
      phone: "0833334455",
      idCard: "1101700234569",
      insuranceType: "ชำระเอง",
      allergies: ["Seafood"]
    },
    {
      hn: "0003102",
      firstName: "ประเสริฐ",
      lastName: "วงค์",
      dateOfBirth: new Date("1965-09-10"),
      gender: "ชาย",
      bloodType: "AB",
      phone: "0844445566",
      idCard: "1101700234570",
      insuranceType: "บัตรทอง",
      allergies: []
    },
    {
      hn: "0004120",
      firstName: "อรทัย",
      lastName: "ใจดี",
      dateOfBirth: new Date("1990-01-09"),
      gender: "หญิง",
      bloodType: "O",
      phone: "0855556677",
      idCard: "1101700234571",
      insuranceType: "ชำระเอง",
      allergies: ["Latex"]
    },
    {
      hn: "0004121",
      firstName: "ธีรภัทร",
      lastName: "พูนทรัพย์",
      dateOfBirth: new Date("1988-12-18"),
      gender: "ชาย",
      bloodType: "B",
      phone: "0866667788",
      idCard: "1101700234572",
      insuranceType: "ประกันสังคม",
      allergies: []
    },
    {
      hn: "0004122",
      firstName: "มธุรส",
      lastName: "ปัญญา",
      dateOfBirth: new Date("2001-05-05"),
      gender: "หญิง",
      bloodType: "A",
      phone: "0877778899",
      idCard: "1101700234573",
      insuranceType: "บัตรทอง",
      allergies: ["Aspirin"]
    },
    {
      hn: "0004123",
      firstName: "ณรงค์",
      lastName: "แสนดี",
      dateOfBirth: new Date("1978-03-19"),
      gender: "ชาย",
      bloodType: "O",
      phone: "0888889900",
      idCard: "1101700234574",
      insuranceType: "ชำระเอง",
      allergies: []
    },
    {
      hn: "0004124",
      firstName: "สุดา",
      lastName: "แสงทอง",
      dateOfBirth: new Date("1995-08-27"),
      gender: "หญิง",
      bloodType: "AB",
      phone: "0899990011",
      idCard: "1101700234575",
      insuranceType: "บัตรทอง",
      allergies: []
    },
    {
      hn: "0004125",
      firstName: "อนันต์",
      lastName: "พิทักษ์",
      dateOfBirth: new Date("1983-06-30"),
      gender: "ชาย",
      bloodType: "B",
      phone: "0800001122",
      idCard: "1101700234576",
      insuranceType: "ประกันสังคม",
      allergies: ["Sulfa"]
    }
  ]

  const patients = await Promise.all(
    patientSeeds.map((patient) =>
      prisma.patient.create({
        data: patient
      })
    )
  )

  const patientByHn = new Map(patients.map((patient) => [patient.hn, patient]))
  const clinicRotation = [clinics[0], clinics[5], clinics[2], clinics[4], clinics[1], clinics[3]]
  const doctorRotation = [doctors[0], doctors[3], doctors[2], doctors[0], doctors[1], doctors[2]]

  type AppointmentSeed = {
    patientHn: string
    date: Date
    timeFrom: string
    timeTo: string
    status: AppointmentStatus
    reason: string
    clinicIndex: number
    doctorIndex: number
    roomIndex: number
    createdById: string
    noShowReason?: NoShowReason
    notes?: string
    confirmedAt?: Date
    attendedAt?: Date
    cancelledAt?: Date
    overdueFlag?: boolean
    smsReminderSent?: boolean
    contactAttempts?: number
  }

  const today = new Date()
  const tomorrow = addDays(today, 1)

  const appointmentSeeds: AppointmentSeed[] = [
    {
      patientHn: "0001234",
      date: appointmentTime(subMonths(today, 5), 9),
      timeFrom: "09:00",
      timeTo: "09:30",
      status: AppointmentStatus.ATTENDED,
      reason: "ติดตามเบาหวาน",
      clinicIndex: 0,
      doctorIndex: 0,
      roomIndex: 0,
      createdById: nurse.id,
      attendedAt: appointmentTime(subMonths(today, 5), 9, 15),
      confirmedAt: subMonths(today, 5)
    },
    {
      patientHn: "0001234",
      date: appointmentTime(subMonths(today, 4), 10),
      timeFrom: "10:00",
      timeTo: "10:30",
      status: AppointmentStatus.NO_SHOW,
      reason: "ติดตามความดัน",
      clinicIndex: 0,
      doctorIndex: 0,
      roomIndex: 0,
      createdById: nurse.id,
      noShowReason: NoShowReason.FORGOT,
      contactAttempts: 1
    },
    {
      patientHn: "0001234",
      date: appointmentTime(subMonths(today, 3), 9),
      timeFrom: "09:00",
      timeTo: "09:30",
      status: AppointmentStatus.NO_SHOW,
      reason: "ตรวจเลือดติดตาม HbA1c",
      clinicIndex: 0,
      doctorIndex: 0,
      roomIndex: 0,
      createdById: nurse.id,
      noShowReason: NoShowReason.TRANSPORTATION,
      contactAttempts: 2
    },
    {
      patientHn: "0001234",
      date: appointmentTime(subMonths(today, 2), 11),
      timeFrom: "11:00",
      timeTo: "11:30",
      status: AppointmentStatus.NO_SHOW,
      reason: "ติดตามผลยา",
      clinicIndex: 0,
      doctorIndex: 0,
      roomIndex: 0,
      createdById: doctorUser.id,
      noShowReason: NoShowReason.NO_ANSWER,
      contactAttempts: 3
    },
    {
      patientHn: "0001234",
      date: appointmentTime(subDays(today, 20), 8),
      timeFrom: "08:00",
      timeTo: "08:30",
      status: AppointmentStatus.NO_SHOW,
      reason: "ประเมินภาวะแทรกซ้อน",
      clinicIndex: 5,
      doctorIndex: 3,
      roomIndex: 5,
      createdById: doctorUser.id,
      noShowReason: NoShowReason.SICK,
      contactAttempts: 2
    },
    {
      patientHn: "0001234",
      date: appointmentTime(today, 13),
      timeFrom: "13:00",
      timeTo: "13:30",
      status: AppointmentStatus.SCHEDULED,
      reason: "ติดตามอาการล่าสุด",
      clinicIndex: 0,
      doctorIndex: 0,
      roomIndex: 0,
      createdById: nurse.id
    },
    {
      patientHn: "0001234",
      date: appointmentTime(tomorrow, 9),
      timeFrom: "09:00",
      timeTo: "09:30",
      status: AppointmentStatus.CONFIRMED,
      reason: "นัดติดตามหลังขาดนัด",
      clinicIndex: 0,
      doctorIndex: 0,
      roomIndex: 0,
      createdById: nurse.id,
      confirmedAt: subHours(today, 4)
    },
    {
      patientHn: "0001235",
      date: appointmentTime(subMonths(today, 6), 9),
      timeFrom: "09:00",
      timeTo: "09:30",
      status: AppointmentStatus.NO_SHOW,
      reason: "ประเมินหัวใจ",
      clinicIndex: 5,
      doctorIndex: 3,
      roomIndex: 5,
      createdById: nurse.id,
      noShowReason: NoShowReason.FINANCIAL,
      contactAttempts: 1
    },
    {
      patientHn: "0001235",
      date: appointmentTime(subMonths(today, 5), 13),
      timeFrom: "13:00",
      timeTo: "13:30",
      status: AppointmentStatus.NO_SHOW,
      reason: "ติดตามคลื่นไฟฟ้าหัวใจ",
      clinicIndex: 5,
      doctorIndex: 3,
      roomIndex: 5,
      createdById: nurse.id,
      noShowReason: NoShowReason.TRANSPORTATION,
      contactAttempts: 2
    },
    {
      patientHn: "0001235",
      date: appointmentTime(subMonths(today, 3), 14),
      timeFrom: "14:00",
      timeTo: "14:30",
      status: AppointmentStatus.ATTENDED,
      reason: "ปรับยาหัวใจ",
      clinicIndex: 5,
      doctorIndex: 3,
      roomIndex: 5,
      createdById: doctorUser.id,
      attendedAt: appointmentTime(subMonths(today, 3), 14, 10),
      confirmedAt: subMonths(today, 3)
    },
    {
      patientHn: "0001235",
      date: appointmentTime(subMonths(today, 2), 14),
      timeFrom: "14:00",
      timeTo: "14:30",
      status: AppointmentStatus.NO_SHOW,
      reason: "ติดตามอาการแน่นหน้าอก",
      clinicIndex: 5,
      doctorIndex: 3,
      roomIndex: 5,
      createdById: doctorUser.id,
      noShowReason: NoShowReason.FORGOT,
      contactAttempts: 1
    },
    {
      patientHn: "0001235",
      date: appointmentTime(subDays(today, 25), 10),
      timeFrom: "10:00",
      timeTo: "10:30",
      status: AppointmentStatus.NO_SHOW,
      reason: "เจาะเลือดติดตามไขมัน",
      clinicIndex: 5,
      doctorIndex: 3,
      roomIndex: 5,
      createdById: nurse.id,
      noShowReason: NoShowReason.NO_ANSWER,
      contactAttempts: 3
    },
    {
      patientHn: "0001235",
      date: appointmentTime(subDays(today, 5), 15),
      timeFrom: "15:00",
      timeTo: "15:30",
      status: AppointmentStatus.NO_SHOW,
      reason: "ประเมินภาวะบวมน้ำ",
      clinicIndex: 0,
      doctorIndex: 0,
      roomIndex: 0,
      createdById: nurse.id,
      noShowReason: NoShowReason.SICK,
      contactAttempts: 2
    },
    {
      patientHn: "0001235",
      date: appointmentTime(tomorrow, 11),
      timeFrom: "11:00",
      timeTo: "11:30",
      status: AppointmentStatus.SCHEDULED,
      reason: "นัดติดตามกรณีเสี่ยงสูง",
      clinicIndex: 5,
      doctorIndex: 3,
      roomIndex: 5,
      createdById: admin.id
    },
    {
      patientHn: "0002891",
      date: appointmentTime(subMonths(today, 4), 8),
      timeFrom: "08:00",
      timeTo: "08:30",
      status: AppointmentStatus.ATTENDED,
      reason: "ตรวจสุขภาพประจำปี",
      clinicIndex: 4,
      doctorIndex: 0,
      roomIndex: 4,
      createdById: nurse.id,
      attendedAt: appointmentTime(subMonths(today, 4), 8, 10)
    },
    {
      patientHn: "0002891",
      date: appointmentTime(subMonths(today, 2), 8),
      timeFrom: "08:00",
      timeTo: "08:30",
      status: AppointmentStatus.NO_SHOW,
      reason: "ติดตามคอเลสเตอรอล",
      clinicIndex: 4,
      doctorIndex: 0,
      roomIndex: 4,
      createdById: nurse.id,
      noShowReason: NoShowReason.FORGOT,
      contactAttempts: 1
    },
    {
      patientHn: "0002891",
      date: appointmentTime(subDays(today, 40), 8),
      timeFrom: "08:00",
      timeTo: "08:30",
      status: AppointmentStatus.ATTENDED,
      reason: "ติดตามผลตรวจสุขภาพ",
      clinicIndex: 4,
      doctorIndex: 0,
      roomIndex: 4,
      createdById: doctorUser.id,
      attendedAt: appointmentTime(subDays(today, 40), 8, 20)
    },
    {
      patientHn: "0002891",
      date: appointmentTime(subDays(today, 7), 10),
      timeFrom: "10:00",
      timeTo: "10:30",
      status: AppointmentStatus.NO_SHOW,
      reason: "ประเมินอาการเวียนหัว",
      clinicIndex: 0,
      doctorIndex: 0,
      roomIndex: 0,
      createdById: doctorUser.id,
      noShowReason: NoShowReason.SICK,
      contactAttempts: 1
    },
    {
      patientHn: "0002891",
      date: appointmentTime(today, 10),
      timeFrom: "10:00",
      timeTo: "10:30",
      status: AppointmentStatus.CONFIRMED,
      reason: "ติดตามผล CBC",
      clinicIndex: 0,
      doctorIndex: 0,
      roomIndex: 0,
      createdById: nurse.id,
      confirmedAt: subHours(today, 3)
    },
    {
      patientHn: "0003102",
      date: appointmentTime(subMonths(today, 5), 13),
      timeFrom: "13:00",
      timeTo: "13:45",
      status: AppointmentStatus.NO_SHOW,
      reason: "ตรวจแผลหลังผ่าตัด",
      clinicIndex: 2,
      doctorIndex: 2,
      roomIndex: 2,
      createdById: doctorUser.id,
      noShowReason: NoShowReason.TRANSPORTATION,
      contactAttempts: 2
    },
    {
      patientHn: "0003102",
      date: appointmentTime(subMonths(today, 4), 13),
      timeFrom: "13:00",
      timeTo: "13:45",
      status: AppointmentStatus.ATTENDED,
      reason: "ติดตามแผลผ่าตัด",
      clinicIndex: 2,
      doctorIndex: 2,
      roomIndex: 2,
      createdById: doctorUser.id,
      attendedAt: appointmentTime(subMonths(today, 4), 13, 15)
    },
    {
      patientHn: "0003102",
      date: appointmentTime(subMonths(today, 3), 13),
      timeFrom: "13:00",
      timeTo: "13:45",
      status: AppointmentStatus.NO_SHOW,
      reason: "ปรับแผนดูแลแผล",
      clinicIndex: 2,
      doctorIndex: 2,
      roomIndex: 2,
      createdById: nurse.id,
      noShowReason: NoShowReason.FORGOT,
      contactAttempts: 1
    },
    {
      patientHn: "0003102",
      date: appointmentTime(subDays(today, 55), 13),
      timeFrom: "13:00",
      timeTo: "13:45",
      status: AppointmentStatus.ATTENDED,
      reason: "ตรวจแผลหายดี",
      clinicIndex: 2,
      doctorIndex: 2,
      roomIndex: 2,
      createdById: doctorUser.id,
      attendedAt: appointmentTime(subDays(today, 55), 13, 20)
    },
    {
      patientHn: "0003102",
      date: appointmentTime(subDays(today, 8), 14),
      timeFrom: "14:00",
      timeTo: "14:30",
      status: AppointmentStatus.NO_SHOW,
      reason: "นัดประเมินซ้ำ",
      clinicIndex: 2,
      doctorIndex: 2,
      roomIndex: 2,
      createdById: nurse.id,
      noShowReason: NoShowReason.NO_ANSWER,
      contactAttempts: 2
    },
    {
      patientHn: "0003102",
      date: appointmentTime(tomorrow, 14),
      timeFrom: "14:00",
      timeTo: "14:30",
      status: AppointmentStatus.SCHEDULED,
      reason: "ติดตามผลผ่าตัด",
      clinicIndex: 2,
      doctorIndex: 2,
      roomIndex: 2,
      createdById: nurse.id
    }
  ]

  const lowRiskPatients = ["0004120", "0004121", "0004122", "0004123", "0004124", "0004125"]

  lowRiskPatients.forEach((hn, index) => {
    appointmentSeeds.push(
      {
        patientHn: hn,
        date: appointmentTime(subMonths(today, 4 - (index % 2)), 9 + (index % 4)),
        timeFrom: `${String(9 + (index % 4)).padStart(2, "0")}:00`,
        timeTo: `${String(9 + (index % 4)).padStart(2, "0")}:30`,
        status: AppointmentStatus.ATTENDED,
        reason: "ติดตามอาการทั่วไป",
        clinicIndex: index % clinicRotation.length,
        doctorIndex: index % doctors.length,
        roomIndex: index % rooms.length,
        createdById: nurse.id,
        attendedAt: appointmentTime(subMonths(today, 4 - (index % 2)), 9 + (index % 4), 10)
      },
      {
        patientHn: hn,
        date: appointmentTime(subDays(today, 20 - index), 10 + (index % 3)),
        timeFrom: `${String(10 + (index % 3)).padStart(2, "0")}:00`,
        timeTo: `${String(10 + (index % 3)).padStart(2, "0")}:30`,
        status: index === 2 ? AppointmentStatus.CANCELLED : AppointmentStatus.ATTENDED,
        reason: index === 2 ? "ผู้ป่วยแจ้งเลื่อนนัด" : "ติดตามผลตรวจ",
        clinicIndex: (index + 1) % clinicRotation.length,
        doctorIndex: (index + 1) % doctors.length,
        roomIndex: (index + 1) % rooms.length,
        createdById: doctorUser.id,
        attendedAt:
          index === 2 ? undefined : appointmentTime(subDays(today, 20 - index), 10 + (index % 3), 15),
        cancelledAt: index === 2 ? subDays(today, 22) : undefined
      },
      {
        patientHn: hn,
        date: appointmentTime(index % 2 === 0 ? today : tomorrow, 8 + index),
        timeFrom: `${String(8 + index).padStart(2, "0")}:00`,
        timeTo: `${String(8 + index).padStart(2, "0")}:30`,
        status: index % 2 === 0 ? AppointmentStatus.SCHEDULED : AppointmentStatus.CONFIRMED,
        reason: "นัดติดตามครั้งถัดไป",
        clinicIndex: (index + 2) % clinicRotation.length,
        doctorIndex: (index + 2) % doctors.length,
        roomIndex: (index + 2) % rooms.length,
        createdById: admin.id,
        confirmedAt: index % 2 === 0 ? undefined : subHours(today, 2)
      }
    )
  })

  appointmentSeeds.push(
    {
      patientHn: "0004120",
      date: appointmentTime(subDays(today, 1), 8),
      timeFrom: "08:00",
      timeTo: "08:30",
      status: AppointmentStatus.RESCHEDULED,
      reason: "ย้ายเวลาตรวจครรภ์",
      clinicIndex: 3,
      doctorIndex: 1,
      roomIndex: 3,
      createdById: nurse.id,
      notes: "ผู้ป่วยขอเปลี่ยนวันนัด"
    },
    {
      patientHn: "0004122",
      date: appointmentTime(subHours(today, 4), 7),
      timeFrom: "07:00",
      timeTo: "07:30",
      status: AppointmentStatus.SCHEDULED,
      reason: "เจาะเลือดเช้า",
      clinicIndex: 4,
      doctorIndex: 0,
      roomIndex: 4,
      createdById: nurse.id,
      overdueFlag: true,
      smsReminderSent: true
    }
  )

  const createdAppointments = []
  for (const seed of appointmentSeeds) {
    const patient = patientByHn.get(seed.patientHn)
    if (!patient) continue

    const clinic = clinics[seed.clinicIndex]
    const doctor = doctors[seed.doctorIndex]
    const room = rooms[seed.roomIndex]

    const created = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        clinicId: clinic.id,
        doctorId: doctor.id,
        roomId: room.id,
        createdBy: seed.createdById,
        appointmentDate: seed.date,
        timeFrom: seed.timeFrom,
        timeTo: seed.timeTo,
        reason: seed.reason,
        notes: seed.notes,
        status: seed.status,
        noShowReason: seed.noShowReason,
        contactAttempts: seed.contactAttempts ?? 0,
        confirmedAt: seed.confirmedAt,
        attendedAt: seed.attendedAt,
        cancelledAt: seed.cancelledAt,
        overdueFlag: seed.overdueFlag ?? false,
        smsReminderSent: seed.smsReminderSent ?? false
      }
    })

    createdAppointments.push(created)
  }

  const appointmentsByPatient = new Map<string, typeof createdAppointments>()
  createdAppointments.forEach((appointment) => {
    const collection = appointmentsByPatient.get(appointment.patientId) ?? []
    collection.push(appointment)
    appointmentsByPatient.set(appointment.patientId, collection)
  })

  const timelineEntries = [
    {
      patientHn: "0001234",
      type: TimelineType.ALLERGY,
      entryDate: subMonths(today, 5),
      createdById: nurse.id,
      notes: "บันทึกแพ้ยา Penicillin",
      clinicName: "อายุรกรรม"
    },
    {
      patientHn: "0001234",
      type: TimelineType.ATTENDED,
      entryDate: subMonths(today, 5),
      createdById: doctorUser.id,
      notes: "มาพบแพทย์ตามนัด ค่าน้ำตาลยังสูง",
      clinicName: "อายุรกรรม",
      doctorName: "นพ.กมล สุขใจ"
    },
    {
      patientHn: "0001234",
      type: TimelineType.NO_SHOW,
      entryDate: subMonths(today, 4),
      createdById: nurse.id,
      notes: "ไม่มาตามนัด โทรติดตามหลังเวลานัด",
      noShowReason: NoShowReason.FORGOT,
      clinicName: "อายุรกรรม"
    },
    {
      patientHn: "0001234",
      type: TimelineType.PHONE_FOLLOWUP,
      entryDate: subMonths(today, 4),
      createdById: nurse.id,
      notes: "โทรติดตามแล้ว ผู้ป่วยแจ้งลืมนัด",
      clinicName: "อายุรกรรม"
    },
    {
      patientHn: "0001234",
      type: TimelineType.LAB_ORDER,
      entryDate: subMonths(today, 3),
      createdById: doctorUser.id,
      notes: "สั่ง HbA1c และ lipid profile",
      clinicName: "อายุรกรรม",
      doctorName: "นพ.กมล สุขใจ"
    },
    {
      patientHn: "0001234",
      type: TimelineType.NO_SHOW,
      entryDate: subDays(today, 20),
      createdById: nurse.id,
      notes: "ขาดนัดต่อเนื่องครั้งที่ 4",
      noShowReason: NoShowReason.SICK,
      clinicName: "โรคหัวใจ",
      doctorName: "พญ.ปัทมา เจริญสุข"
    },
    {
      patientHn: "0001235",
      type: TimelineType.NO_SHOW,
      entryDate: subMonths(today, 6),
      createdById: nurse.id,
      notes: "ผู้ป่วยไม่มาตามนัด ตรวจโรคหัวใจ",
      noShowReason: NoShowReason.FINANCIAL,
      clinicName: "โรคหัวใจ",
      doctorName: "พญ.ปัทมา เจริญสุข"
    },
    {
      patientHn: "0001235",
      type: TimelineType.PHONE_FOLLOWUP,
      entryDate: subMonths(today, 5),
      createdById: nurse.id,
      notes: "โทรติดตามแล้ว แจ้งปัญหาค่าเดินทาง",
      clinicName: "โรคหัวใจ"
    },
    {
      patientHn: "0001235",
      type: TimelineType.ATTENDED,
      entryDate: subMonths(today, 3),
      createdById: doctorUser.id,
      notes: "มาตามนัดและปรับยา furosemide",
      clinicName: "โรคหัวใจ",
      doctorName: "พญ.ปัทมา เจริญสุข"
    },
    {
      patientHn: "0001235",
      type: TimelineType.MEDICATION,
      entryDate: subMonths(today, 3),
      createdById: doctorUser.id,
      notes: "เพิ่มขนาดยาเพื่อลดอาการบวม",
      clinicName: "โรคหัวใจ",
      doctorName: "พญ.ปัทมา เจริญสุข"
    },
    {
      patientHn: "0001235",
      type: TimelineType.NO_SHOW,
      entryDate: subDays(today, 5),
      createdById: nurse.id,
      notes: "ไม่มาตามนัดครั้งล่าสุด",
      noShowReason: NoShowReason.SICK,
      clinicName: "อายุรกรรม"
    }
  ]

  for (const entry of timelineEntries) {
    const patient = patientByHn.get(entry.patientHn)
    if (!patient) continue

    const matchingAppointment = createdAppointments
      .filter((appointment) => appointment.patientId === patient.id)
      .sort((a, b) => Math.abs(a.appointmentDate.getTime() - entry.entryDate.getTime()) - Math.abs(b.appointmentDate.getTime() - entry.entryDate.getTime()))[0]

    await prisma.timelineEntry.create({
      data: {
        patientId: patient.id,
        appointmentId: matchingAppointment?.id,
        createdById: entry.createdById,
        type: entry.type,
        entryDate: entry.entryDate,
        clinicName: entry.clinicName,
        doctorName: entry.doctorName,
        notes: entry.notes,
        noShowReason: entry.noShowReason
      }
    })
  }

  for (const patient of patients) {
    const patientAppointments = appointmentsByPatient.get(patient.id) ?? []
    const summary = buildPatientRiskSummary(patientAppointments)

    await prisma.patient.update({
      where: { id: patient.id },
      data: {
        totalAppointments: summary.totalAppointments,
        totalAttended: patientAppointments.filter((appointment) => appointment.status === AppointmentStatus.ATTENDED).length,
        totalNoShows: summary.totalNoShows,
        noShowScore: summary.noShowScore,
        riskLevel: summary.riskLevel
      }
    })
  }

  const summaryCounts = await prisma.patient.groupBy({
    by: ["riskLevel"],
    _count: {
      id: true
    }
  })

  console.log("Seed completed successfully")
  console.table(
    summaryCounts.map((item) => ({
      riskLevel: item.riskLevel,
      patients: item._count.id
    }))
  )
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
