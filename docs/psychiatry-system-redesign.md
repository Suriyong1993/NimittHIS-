# NimittHIS Psychiatry Redesign

## Positioning

NimittHIS ควรเป็นระบบปฏิบัติการสำหรับคลินิกจิตเวชที่ทำงานร่วมกับ `HOSxP` ไม่ใช่แทน `HOSxP` ทั้งก้อน

- `HOSxP` ยังเป็นระบบหลักเรื่องทะเบียนผู้ป่วย, visit, สิทธิรักษา, charge, lab, x-ray, pharmacy, การเงิน, และเวชระเบียนหลัก
- `NimittHIS` ควรรับบทเป็น layer สำหรับงานติดตามนัดหมายและ continuity of care โดยเฉพาะงานที่ระบบหลักมักทำได้แต่ยังไม่ลึกพอสำหรับงานจิตเวช

## Why This Matters For Psychiatry

งานจิตเวชต่างจาก OPD ทั่วไปใน 5 จุด

1. การมารับบริการต่อเนื่องสำคัญต่อผลลัพธ์การรักษามากกว่าหลายคลินิก
2. ผู้ป่วยจำนวนหนึ่งขาดนัดซ้ำและต้องติดตามเชิงรุก
3. การประเมินอาการไม่ได้ดูแค่ visit เดียว แต่ต้องดู trend หลายสัปดาห์หรือหลายเดือน
4. งานรักษามีหลายบทบาทร่วมกัน เช่น พยาบาล, จิตแพทย์, นักจิตวิทยา, เภสัชกร, social worker
5. ต้องมีมุมมองครอบครัว ผู้ดูแล ยาเดิม ความเสี่ยง และเหตุผลการขาดนัด อยู่ในที่เดียว

## What HOSxP Already Covers

จากเอกสาร/หน้า feature ของ HOSxP และ ecosystem ที่เกี่ยวข้อง พบว่าระบบเดิมรองรับงานสำคัญอยู่แล้ว เช่น

- appointment and queue concepts
- registration / send-to-service point
- rights verification
- pre-confirmed lab/x-ray attached to appointments
- kiosk and appointment-center integration

ดังนั้น NimittHIS ไม่ควรเริ่มจากการทำซ้ำ registration หรือ billing แต่ควรเสริม workflow ที่หน้างานยังปวดจริง

## Real Workflow Model

### 1. ก่อนวันนัด

- ดึงรายชื่อนัดจาก HOSxP/MOPH Appointment
- คัดกรองความเสี่ยง no-show
- จัดกลุ่มเป็น `โทรยืนยัน`, `SMS เตือน`, `ให้ อสม./ชุมชนช่วยติดตาม`, `ต้องประสานญาติ`
- ตรวจความพร้อม เช่น ต้องทำ lab ก่อนพบแพทย์หรือไม่, มียาต้องทบทวนหรือไม่

### 2. วันนัดก่อนเข้าคลินิก

- พยาบาลเห็น morning board
- แยกคิวเป็น `มาแล้ว`, `ยังไม่มา`, `โทรแล้ว`, `เลื่อน`, `walk-in`
- เห็นเคสแดง เช่น ขาดนัดซ้ำ, medication adherence ต่ำ, มี risk note, มีประวัติ agitation หรือ suicide risk

### 3. ระหว่างรับบริการ

- พยาบาลบันทึก screening สั้น
- แพทย์เห็น timeline ต่อเนื่อง ไม่ใช่แค่ note ล่าสุด
- เห็นสรุปยาเดิม ผลข้างเคียง การมาตามนัด และ intervention ที่เคยใช้แล้วได้ผลหรือไม่ได้ผล

### 4. หลังตรวจ

- ตั้ง next appointment พร้อมเหตุผลนัด
- ระบุ follow-up mode เช่น `พบแพทย์`, `โทรติดตาม`, `video call`, `รับยาต่อ`
- สร้างงานติดตามให้พยาบาลกรณี high risk
- บันทึกเหตุผลถ้าผู้ป่วยเลื่อนหรือไม่พร้อมมาตามนัด

### 5. หลังขาดนัด

- เปลี่ยน status อัตโนมัติเมื่อเกินเวลา
- สร้าง task list ติดตาม
- จำแนกเหตุผลการขาดนัด
- วัดว่าติดตามกลับมาได้หรือไม่ภายใน 3, 7, 14 วัน

## Recommended Information Architecture

ระบบใหม่ควรมี 8 work areas

1. `Command Center`
- board กลางของวัน
- จำนวนคิว, คิวเสี่ยง, ผู้ป่วยค้างติดตาม, overdue update

2. `Appointment Operations`
- ตารางนัดแบบ role-based
- confirm / reschedule / cancel / walk-in merge
- room, doctor, session capacity

3. `No-show Command`
- risk stratification
- outreach queue
- outcome tracking of follow-up

4. `Patient Continuity Profile`
- demographics
- last 6 visits
- symptom / adherence / crisis / family notes
- medication and follow-up plan

5. `Clinical Timeline`
- visit summary
- phone follow-up
- missed appointment
- medication change
- suicide or safety flag

6. `Care Coordination`
- งานที่ส่งต่อให้พยาบาล, case manager, social worker
- checklist per patient

7. `Analytics`
- no-show by clinic/doctor/day-of-week/time-slot
- follow-up conversion rate
- revisit within 30 days
- medication pickup gap

8. `Integration & Audit`
- sync status with HOSxP
- import errors
- audit trail

## Feature Gaps To Add Beyond The Current Build

### A. Psychiatry-specific patient summary

- diagnosis cluster
- current risk status
- medication adherence summary
- caregiver/contact person
- preferred communication channel
- history of repeated missed appointments
- social determinants affecting attendance

### B. Team-based workflow

- assign follow-up owner
- task queue by role
- nurse handoff notes
- doctor pending review
- manager escalation queue

### C. Missed appointment intelligence

- score by time slot, clinic, transport pattern, prior follow-up success
- distinguish `forgot`, `refused`, `financial`, `transport`, `symptom relapse`, `family barrier`
- recurrence pattern within 30 / 90 / 180 days

### D. Medication continuity

- show last prescription date
- expected medication runout date
- flag if likely out of medicine before next visit
- connect missed visit to medication interruption risk

### E. Safety workflows

- crisis flag
- self-harm / suicide follow-up workflow
- emergency contact verification
- mandatory callback or escalation protocol

### F. Integration-facing requirements

- import appointment from HOSxP
- sync patient master from HN
- sync visit result or status back
- keep NimittHIS as operational layer, not duplicate EMR authority

## Redesign Direction For The UI

### Principles

- calm and clinical, not flashy
- readable in a busy ward/clinic environment
- one screen should answer: `who needs attention now`
- visual hierarchy must favor urgency and continuity
- minimal animation, only to support focus

### Role-first layout

#### Nurse view

- today's queue
- arrivals / no-arrivals
- outreach tasks
- screening pending

#### Doctor view

- current schedule
- patient continuity summary
- timeline and risk alerts
- previous interventions and medication adherence

#### Manager view

- clinic performance
- no-show trends
- staffing / slot utilization
- unresolved follow-up backlog

## Recommended Screen Redesign

### Dashboard

Current role: high-level summary

Redesign:
- `Morning Command Center`
- left: clinic load, arrivals, overdue status updates
- middle: high-risk outreach queue
- right: today session readiness and unresolved alerts

### Appointments

Current role: simple list

Redesign:
- split by clinic session
- show capacity, confirmed, arrived, waiting, completed, missed
- quick actions: confirm, reschedule, call, mark arrived, mark missed
- show special icons for first visit, medication refill, family conference

### No-show Tracking

Current role: list of risk/high-risk

Redesign:
- convert to operational board
- columns: `ต้องโทรวันนี้`, `ติดต่อแล้ว`, `ขอเลื่อน`, `กลับเข้าระบบแล้ว`, `ส่งต่อชุมชน`
- include follow-up outcome metrics

### Analytics

Current role: generic charts

Redesign:
- operational analytics, not just decorative charts
- best/worst time slots
- clinic/day comparison
- re-engagement rate after missed appointment
- staff workload and unresolved queue

## Suggested Data Additions

Add these entities or fields in later phases

- `CareTask`
- `FollowUpOutcome`
- `MedicationAdherenceSnapshot`
- `CaregiverContact`
- `RiskFlag`
- `VisitReadiness`
- `CommunicationPreference`
- `AttendanceBarrier`
- `ReferralSource`

## Suggested Integration Strategy With HOSxP

Safe integration approach

1. HOSxP remains source of truth for:
- HN
- visit
- rights
- orders
- pharmacy
- billing

2. NimittHIS becomes source of truth for:
- no-show scoring
- follow-up workflow
- outreach outcomes
- psychiatry continuity timeline
- operational analytics

3. Sync model
- read appointments and patient core data from HOSxP
- write back appointment status where appropriate
- keep audit log on every sync event

## Next Design Iteration

The next full redesign should implement:

1. role-aware dashboard cards and task lanes
2. appointment board with session capacity
3. no-show outreach Kanban
4. richer patient continuity page
5. safety flags and medication continuity widgets
6. manager analytics focused on actionability

## Sources

- HOSxP Mini Kiosk feature page: https://hosxp.net/wordpress/?page_id=5170
- HOSxP Smart Hospital Kiosk page: https://hosxp.net/wordpress/?page_id=18016
