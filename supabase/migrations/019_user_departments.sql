-- Add department_id to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_department_id ON public.profiles(department_id);

-- Drop the existing faculty column
ALTER TABLE public.profiles DROP COLUMN IF EXISTS faculty;

-- Update the handle_new_user function to no longer collect faculty, 
-- and correctly cast department_id from raw_user_meta_data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    full_name,
    role,
    department,
    department_id,
    level,
    matric_number
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NULL),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')::TEXT,
    COALESCE(NEW.raw_user_meta_data->>'department', NULL),
    NULLIF(NEW.raw_user_meta_data->>'department_id', '')::UUID,
    COALESCE(NEW.raw_user_meta_data->>'level', NULL),
    COALESCE(NEW.raw_user_meta_data->>'matric_number', NULL)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
