-- Add location column to upcoming_camps table
ALTER TABLE public.upcoming_camps 
ADD COLUMN IF NOT EXISTS location text;

-- Verify other columns exist just in case
-- title, camp_date, camp_time, venue, price, description, google_map_link

-- Refresh cache if needed (Supabase usually handles this)
NOTIFY pgrst, 'reload config';
