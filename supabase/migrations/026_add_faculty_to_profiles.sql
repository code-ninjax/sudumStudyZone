-- Add faculty_id to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS faculty_id UUID REFERENCES public.faculties(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_faculty_id ON public.profiles(faculty_id);

-- Update the handle_new_user function to include faculty_id
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    full_name,
    role,
    department,
    department_id,
    faculty_id,
    level,
    matric_number
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NULL),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')::TEXT,
    COALESCE(NEW.raw_user_meta_data->>'department', NULL),
    NULLIF(NEW.raw_user_meta_data->>'department_id', '')::UUID,
    NULLIF(NEW.raw_user_meta_data->>'faculty_id', '')::UUID,
    COALESCE(NEW.raw_user_meta_data->>'level', NULL),
    COALESCE(NEW.raw_user_meta_data->>'matric_number', NULL)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
