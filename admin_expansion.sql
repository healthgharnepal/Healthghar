-- ==========================================
-- 1. HOME CHECKUP SYSTEM
-- ==========================================

-- Packages Table
create table public.home_checkup_packages (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  price numeric not null,
  created_at timestamptz default now() not null
);

-- Home Checkup Bookings (Record of patients)
create table public.home_checkup_bookings (
  id uuid primary key default uuid_generate_v4(),
  package_id uuid references public.home_checkup_packages(id) on delete set null,
  user_id uuid references auth.users(id), -- The account that made the booking
  
  -- Patient Details Entered at Booking
  patient_name text not null,
  patient_age int,
  patient_address text,
  patient_contact text,
  preferred_date date,
  preferred_time time,
  
  status text default 'pending', -- pending, completed, cancelled
  created_at timestamptz default now() not null
);

-- RLS
alter table public.home_checkup_packages enable row level security;
create policy "Public view packages" on public.home_checkup_packages for select using (true);
alter table public.home_checkup_bookings enable row level security;
create policy "Admin view all bookings" on public.home_checkup_bookings for select using (true); -- Simplify for admin demo
create policy "User view own bookings" on public.home_checkup_bookings for select using (auth.uid() = user_id);
create policy "User create bookings" on public.home_checkup_bookings for insert with check (auth.uid() = user_id);

-- ==========================================
-- 2. TELEHEALTH SYSTEM
-- ==========================================

-- Telehealth Doctor Profiles (Linked to authorized emails)
create table public.telehealth_doctors (
  id uuid primary key default uuid_generate_v4(),
  email text not null, -- To link/search existing doctors
  name text not null,
  description text,
  category text, -- Dropdown value (e.g. 'Cardiology')
  specialization text, -- Dropdown value (e.g. 'Heart Surgeon')
  image_url text, -- Optional
  created_at timestamptz default now() not null,
  unique(email)
);

-- Doctor Slots (Recurring or One-time)
create table public.telehealth_slots (
  id uuid primary key default uuid_generate_v4(),
  doctor_id uuid references public.telehealth_doctors(id) on delete cascade,
  start_time time not null,
  end_time time not null,
  is_active boolean default true,
  created_at timestamptz default now() not null
);

-- Telehealth Bookings
create table public.telehealth_bookings (
  id uuid primary key default uuid_generate_v4(),
  doctor_id uuid references public.telehealth_doctors(id),
  user_id uuid references auth.users(id),
  slot_id uuid references public.telehealth_slots(id), -- Optional reference
  
  booking_date date not null, -- The specific date booked
  slot_time_start time not null,
  
  -- Patient Details
  patient_name text not null,
  patient_age int,
  patient_notes text,
  
  status text default 'confirmed',
  created_at timestamptz default now() not null
);

-- RLS
alter table public.telehealth_doctors enable row level security;
create policy "Public view doctors" on public.telehealth_doctors for select using (true);
alter table public.telehealth_slots enable row level security;
create policy "Public view slots" on public.telehealth_slots for select using (true);
alter table public.telehealth_bookings enable row level security;
create policy "Admin view all tele bookings" on public.telehealth_bookings for select using (true);
create policy "User view own tele bookings" on public.telehealth_bookings for select using (auth.uid() = user_id);
create policy "User create tele bookings" on public.telehealth_bookings for insert with check (auth.uid() = user_id);

-- ==========================================
-- 3. UPCOMING CAMPS SYSTEM
-- ==========================================

create table public.upcoming_camps (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  camp_date date,
  camp_time time,
  venue text,
  price numeric default 0,
  google_map_link text,
  created_at timestamptz default now() not null
);

create table public.camp_bookings (
  id uuid primary key default uuid_generate_v4(),
  camp_id uuid references public.upcoming_camps(id) on delete cascade,
  user_id uuid references auth.users(id),
  
  patient_name text not null,
  patient_age int,
  patient_contact text,
  patient_gender text,
  
  status text default 'registered',
  created_at timestamptz default now() not null
);

-- RLS
alter table public.upcoming_camps enable row level security;
create policy "Public view camps" on public.upcoming_camps for select using (true);
alter table public.camp_bookings enable row level security;
create policy "Admin view camp bookings" on public.camp_bookings for select using (true);
create policy "User view own camp bookings" on public.camp_bookings for select using (auth.uid() = user_id);
create policy "User create camp bookings" on public.camp_bookings for insert with check (auth.uid() = user_id);

-- ==========================================
-- 4. MEMBERSHIPS (Simple)
-- ==========================================
-- Re-using previous if compatible, or redefining for clarity
create table if not exists public.membership_plans (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  price numeric,
  duration_months int,
  benefits text,
  created_at timestamptz default now() not null
);
