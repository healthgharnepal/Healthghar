-- Create detailed Camp Reports Table
create table public.camp_reports (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid references public.camp_bookings(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  
  -- Patient Information
  patient_name text not null,
  patient_age int,
  patient_gender text,
  patient_address text,
  patient_phone text,
  patient_ward text,
  departments text[], -- Stores multiple selections: Dental, ENT, General
  
  -- Vitals
  vital_bp text,
  vital_blood_sugar numeric,
  vital_weight numeric,
  vital_temp numeric,
  vital_spo2 numeric,
  vital_pulse numeric,
  
  -- Advice & Auth
  doctors_advice text not null,
  doctor_signature text not null,
  doctor_name text not null,
  
  created_at timestamptz default now() not null
);

-- Enable RLS
alter table public.camp_reports enable row level security;

-- Users can only view reports belonging to them
create policy "Users can view own camp reports"
  on public.camp_reports for select
  using (auth.uid() = user_id);
