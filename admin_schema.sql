-- 1. Home Checkup Plans
create table public.home_checkup_plans (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  price numeric,
  created_at timestamptz default now() not null
);

alter table public.home_checkup_plans enable row level security;
create policy "Public read home checkups" on public.home_checkup_plans for select using (true);

-- 2. Telehealth Services
create table public.telehealth_services (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  price numeric,
  created_at timestamptz default now() not null
);

alter table public.telehealth_services enable row level security;
create policy "Public read telehealth" on public.telehealth_services for select using (true);

-- 3. Camps
create table public.camps (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  location text not null,
  camp_date timestamptz,
  description text,
  created_at timestamptz default now() not null
);

alter table public.camps enable row level security;
create policy "Public read camps" on public.camps for select using (true);

-- 4. Membership Plans
create table public.membership_plans (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  price numeric,
  duration_months int,
  benefits text,
  created_at timestamptz default now() not null
);

alter table public.membership_plans enable row level security;
create policy "Public read memberships" on public.membership_plans for select using (true);
