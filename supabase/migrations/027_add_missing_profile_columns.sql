-- Add missing columns to profiles table
-- These columns are referenced in the handle_new_user trigger but were never created

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS matric_number TEXT;

-- Create indexes for these columns
CREATE INDEX IF NOT EXISTS idx_profiles_department ON public.profiles(department);
CREATE INDEX IF NOT EXISTS idx_profiles_matric_number ON public.profiles(matric_number);
