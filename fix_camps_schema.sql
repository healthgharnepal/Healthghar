-- Fix upcoming_camps table schema
-- Run this in Supabase SQL Editor

-- 1. Ensure Table Exists
CREATE TABLE IF NOT EXISTS public.upcoming_camps (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamptz DEFAULT now(),
    title text NOT NULL,
    camp_date date NOT NULL,
    description text
);

-- 2. Add potentially missing columns
DO $$
BEGIN
    ALTER TABLE public.upcoming_camps ADD COLUMN location text;
EXCEPTION
    WHEN duplicate_column THEN RAISE NOTICE 'location column already exists';
END $$;

DO $$
BEGIN
    ALTER TABLE public.upcoming_camps ADD COLUMN venue text;
EXCEPTION
    WHEN duplicate_column THEN RAISE NOTICE 'venue column already exists';
END $$;

DO $$
BEGIN
    ALTER TABLE public.upcoming_camps ADD COLUMN camp_time text;
EXCEPTION
    WHEN duplicate_column THEN RAISE NOTICE 'camp_time column already exists';
END $$;

DO $$
BEGIN
    ALTER TABLE public.upcoming_camps ADD COLUMN price numeric DEFAULT 0;
EXCEPTION
    WHEN duplicate_column THEN RAISE NOTICE 'price column already exists';
END $$;

DO $$
BEGIN
    ALTER TABLE public.upcoming_camps ADD COLUMN google_map_link text;
EXCEPTION
    WHEN duplicate_column THEN RAISE NOTICE 'google_map_link column already exists';
END $$;

-- 3. Enable RLS and Add Public Read Policy
ALTER TABLE public.upcoming_camps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read camps" ON public.upcoming_camps;

CREATE POLICY "Public read camps" 
ON public.upcoming_camps 
FOR SELECT 
USING (true);
