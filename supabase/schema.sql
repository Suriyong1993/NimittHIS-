-- ============ ENUMS ============
CREATE TYPE role AS ENUM (
  'ADMIN','DOCTOR','NURSE','PSYCHOLOGIST','PATIENT'
);

CREATE TYPE appointment_status AS ENUM (
  'SCHEDULED','CONFIRMED','ATTENDED',
  'NO_SHOW','CANCELLED','RESCHEDULED'
);

CREATE TYPE risk_level AS ENUM ('LOW','MEDIUM','HIGH','CRITICAL');

CREATE TYPE mood_level AS ENUM ('1','2','3','4','5');

CREATE TYPE notification_channel AS ENUM ('PUSH','SMS','LINE','EMAIL');

CREATE TYPE followup_type AS ENUM (
  'PHONE_CALL','SMS','LINE','EMAIL','HOME_VISIT','EMERGENCY'
);

CREATE TYPE no_show_reason AS ENUM (
  'FORGOT','SICK','TRANSPORTATION',
  'FINANCIAL','NO_ANSWER','FAMILY','OTHER'
);

-- ============ CORE TABLES ============

-- Clinics / Departments
CREATE TABLE clinics (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,       -- "คลินิกจิตเวช"
  description TEXT,
  location    TEXT,
  is_active   BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Users (staff)
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  first_name    TEXT NOT NULL,
  last_name     TEXT NOT NULL,
  role          role NOT NULL,
  phone         TEXT,
  avatar_url    TEXT,
  license_no    TEXT,              -- เลขใบประกอบวิชาชีพ
  specialty     TEXT,              -- สาขาเฉพาะทาง
  clinic_id     UUID REFERENCES clinics(id),
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Patients
CREATE TABLE patients (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hn                TEXT UNIQUE NOT NULL,  -- auto-generated
  first_name        TEXT NOT NULL,
  last_name         TEXT NOT NULL,
  date_of_birth     DATE NOT NULL,
  gender            TEXT NOT NULL,
  phone             TEXT,
  email             TEXT,
  address           TEXT,
  emergency_contact_name  TEXT,
  emergency_contact_phone TEXT,
  primary_doctor_id UUID REFERENCES users(id),
  risk_level        risk_level DEFAULT 'LOW',
  no_show_score     INT DEFAULT 0,         -- 0-100
  is_active         BOOLEAN DEFAULT true,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

-- Diagnoses
CREATE TABLE diagnoses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id  UUID REFERENCES patients(id) ON DELETE CASCADE,
  icd10_code  TEXT,                -- F32.1 etc.
  name        TEXT NOT NULL,       -- "โรคซึมเศร้า"
  severity    TEXT,
  noted_by    UUID REFERENCES users(id),
  noted_at    TIMESTAMPTZ DEFAULT now(),
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Appointments
CREATE TABLE appointments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id      UUID REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id       UUID REFERENCES users(id),
  clinic_id       UUID REFERENCES clinics(id),
  scheduled_at    TIMESTAMPTZ NOT NULL,
  duration_min    INT DEFAULT 50,
  status          appointment_status DEFAULT 'SCHEDULED',
  type            TEXT DEFAULT 'IN_PERSON', -- IN_PERSON/ONLINE/PHONE
  no_show_reason  no_show_reason,
  notes           TEXT,
  created_by      UUID REFERENCES users(id),
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Follow-up Actions (เมื่อผู้ป่วยขาดนัด)
CREATE TABLE followup_actions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id  UUID REFERENCES appointments(id),
  patient_id      UUID REFERENCES patients(id),
  type            followup_type NOT NULL,
  performed_by    UUID REFERENCES users(id),
  result          TEXT,            -- "ติดต่อได้ / ไม่รับสาย / นัดใหม่แล้ว"
  notes           TEXT,
  performed_at    TIMESTAMPTZ DEFAULT now(),
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Mood Logs (Patient)
CREATE TABLE mood_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id    UUID REFERENCES patients(id) ON DELETE CASCADE,
  mood          mood_level NOT NULL,   -- 1=แย่มาก 5=ดีมาก
  intensity     INT CHECK (intensity BETWEEN 1 AND 10),
  emotions      TEXT[],               -- ['วิตกกังวล','เหนื่อย']
  sleep_hours   DECIMAL(3,1),
  exercised     BOOLEAN DEFAULT false,
  exercise_min  INT,
  note          TEXT,
  is_private    BOOLEAN DEFAULT false,
  logged_at     TIMESTAMPTZ DEFAULT now(),
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Journal Entries (Patient diary)
CREATE TABLE journal_entries (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id  UUID REFERENCES patients(id) ON DELETE CASCADE,
  title       TEXT,
  body        TEXT NOT NULL,
  mood        mood_level,
  emotions    TEXT[],
  is_private  BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Assessments (PHQ-9, GAD-7 etc.)
CREATE TABLE assessments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id  UUID REFERENCES patients(id),
  type        TEXT NOT NULL,        -- 'PHQ9','GAD7','AUDIT'
  answers     JSONB NOT NULL,       -- {q1:2, q2:1, ...}
  score       INT NOT NULL,
  severity    TEXT NOT NULL,        -- 'minimal','mild','moderate','severe'
  taken_by    UUID REFERENCES users(id),
  taken_at    TIMESTAMPTZ DEFAULT now(),
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Medications
CREATE TABLE medications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id  UUID REFERENCES patients(id),
  drug_name   TEXT NOT NULL,
  dosage      TEXT NOT NULL,
  frequency   TEXT NOT NULL,
  prescribed_by UUID REFERENCES users(id),
  start_date  DATE NOT NULL,
  end_date    DATE,
  is_active   BOOLEAN DEFAULT true,
  notes       TEXT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Notifications
CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id  UUID REFERENCES patients(id),
  type        TEXT NOT NULL,        -- 'REMINDER','NO_SHOW','FOLLOWUP'
  channel     notification_channel NOT NULL,
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  sent_at     TIMESTAMPTZ,
  read_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Patient Risk Score History
CREATE TABLE risk_score_history (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id      UUID REFERENCES patients(id),
  score           INT NOT NULL,     -- 0-100
  factors         JSONB,            -- {no_show_count:3, severity:'HIGH'}
  calculated_at   TIMESTAMPTZ DEFAULT now(),
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Audit Log
CREATE TABLE audit_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id),
  action      TEXT NOT NULL,        -- 'CREATE','UPDATE','DELETE'
  table_name  TEXT NOT NULL,
  record_id   UUID,
  old_data    JSONB,
  new_data    JSONB,
  ip_address  TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Helper: Updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_clinics_updated_at BEFORE UPDATE ON clinics FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_patients_updated_at BEFORE UPDATE ON patients FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_diagnoses_updated_at BEFORE UPDATE ON diagnoses FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_followup_actions_updated_at BEFORE UPDATE ON followup_actions FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_journal_entries_updated_at BEFORE UPDATE ON journal_entries FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_medications_updated_at BEFORE UPDATE ON medications FOR EACH ROW EXECUTE FUNCTION set_updated_at();
