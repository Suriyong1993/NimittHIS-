create extension if not exists pgcrypto;

create type public.role as enum (
  'NURSE',
  'DOCTOR',
  'MANAGER',
  'ADMIN'
);

create type public.appointment_status as enum (
  'SCHEDULED',
  'CONFIRMED',
  'ATTENDED',
  'NO_SHOW',
  'CANCELLED',
  'RESCHEDULED'
);

create type public.timeline_type as enum (
  'ATTENDED',
  'NO_SHOW',
  'RESCHEDULED',
  'PHONE_FOLLOWUP',
  'NOTE',
  'LAB_ORDER',
  'XRAY_ORDER',
  'SURGERY',
  'ALLERGY',
  'MEDICATION'
);

create type public.no_show_reason as enum (
  'FORGOT',
  'SICK',
  'TRANSPORTATION',
  'FINANCIAL',
  'NO_ANSWER',
  'OTHER'
);

create type public.risk_level as enum (
  'LOW',
  'MEDIUM',
  'HIGH'
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.users (
  id text primary key default gen_random_uuid()::text,
  username text not null unique,
  password_hash text not null,
  first_name text not null,
  last_name text not null,
  role public.role not null,
  clinic_id text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists users_username_idx on public.users (username);

create table if not exists public.patients (
  id text primary key default gen_random_uuid()::text,
  hn text not null unique,
  first_name text not null,
  last_name text not null,
  date_of_birth timestamptz not null,
  gender text not null,
  blood_type text,
  phone text,
  id_card text unique,
  passport_no text,
  insurance_type text,
  allergies text[] not null default '{}',
  total_appointments integer not null default 0,
  total_attended integer not null default 0,
  total_no_shows integer not null default 0,
  no_show_score double precision not null default 0,
  risk_level public.risk_level not null default 'LOW',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists patients_hn_idx on public.patients (hn);
create index if not exists patients_name_idx on public.patients (first_name, last_name);
create index if not exists patients_risk_level_idx on public.patients (risk_level);

create table if not exists public.clinics (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  name_en text,
  is_active boolean not null default true
);

create table if not exists public.rooms (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  clinic_id text not null references public.clinics(id) on delete restrict
);

create table if not exists public.doctors (
  id text primary key default gen_random_uuid()::text,
  prefix text not null,
  first_name text not null,
  last_name text not null,
  specialty text,
  clinic_id text,
  is_active boolean not null default true
);

create table if not exists public.appointments (
  id text primary key default gen_random_uuid()::text,
  patient_id text not null references public.patients(id) on delete restrict,
  clinic_id text not null references public.clinics(id) on delete restrict,
  doctor_id text references public.doctors(id) on delete set null,
  room_id text references public.rooms(id) on delete set null,
  created_by text not null references public.users(id) on delete restrict,
  appointment_date timestamptz not null,
  time_from text not null,
  time_to text not null,
  reason text not null,
  notes text,
  status public.appointment_status not null default 'SCHEDULED',
  no_show_reason public.no_show_reason,
  contact_attempts integer not null default 0,
  confirmed_at timestamptz,
  attended_at timestamptz,
  cancelled_at timestamptz,
  overdue_flag boolean not null default false,
  sms_reminder_sent boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists appointments_patient_id_idx on public.appointments (patient_id);
create index if not exists appointments_appointment_date_idx on public.appointments (appointment_date);
create index if not exists appointments_status_idx on public.appointments (status);
create index if not exists appointments_overdue_flag_idx on public.appointments (overdue_flag);

create table if not exists public.timeline_entries (
  id text primary key default gen_random_uuid()::text,
  patient_id text not null references public.patients(id) on delete cascade,
  appointment_id text references public.appointments(id) on delete set null,
  created_by_id text not null references public.users(id) on delete restrict,
  type public.timeline_type not null,
  entry_date timestamptz not null,
  clinic_name text,
  doctor_name text,
  notes text,
  no_show_reason public.no_show_reason,
  original_created_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_edited_by text,
  last_edited_at timestamptz
);

create index if not exists timeline_entries_patient_id_idx on public.timeline_entries (patient_id);
create index if not exists timeline_entries_entry_date_idx on public.timeline_entries (entry_date);

drop trigger if exists set_users_updated_at on public.users;
create trigger set_users_updated_at
before update on public.users
for each row
execute function public.set_updated_at();

drop trigger if exists set_patients_updated_at on public.patients;
create trigger set_patients_updated_at
before update on public.patients
for each row
execute function public.set_updated_at();

drop trigger if exists set_appointments_updated_at on public.appointments;
create trigger set_appointments_updated_at
before update on public.appointments
for each row
execute function public.set_updated_at();

drop trigger if exists set_timeline_entries_updated_at on public.timeline_entries;
create trigger set_timeline_entries_updated_at
before update on public.timeline_entries
for each row
execute function public.set_updated_at();

alter table public.users disable row level security;
alter table public.patients disable row level security;
alter table public.clinics disable row level security;
alter table public.rooms disable row level security;
alter table public.doctors disable row level security;
alter table public.appointments disable row level security;
alter table public.timeline_entries disable row level security;
