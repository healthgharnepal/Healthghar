-- Run these commands in your Supabase SQL Editor to fix the Booking Error (42501)

-- Allow users to view their own telehealth bookings
create policy "User view own tele bookings" on public.telehealth_bookings for select using (auth.uid() = user_id);

-- Allow users to create their own telehealth bookings
create policy "User create tele bookings" on public.telehealth_bookings for insert with check (auth.uid() = user_id);

-- Allow users to view their own camp bookings
create policy "User view own camp bookings" on public.camp_bookings for select using (auth.uid() = user_id);

-- Allow users to create their own camp bookings
create policy "User create camp bookings" on public.camp_bookings for insert with check (auth.uid() = user_id);
