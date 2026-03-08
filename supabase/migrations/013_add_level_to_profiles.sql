-- Persist academic level on student profiles and signup trigger

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS level TEXT;

CREATE INDEX IF NOT EXISTS idx_profiles_level ON public.profiles(level);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    full_name,
    role,
    faculty,
    department,
    level,
    matric_number
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NULL),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')::TEXT,
    COALESCE(NEW.raw_user_meta_data->>'faculty', NULL),
    COALESCE(NEW.raw_user_meta_data->>'department', NULL),
    COALESCE(NEW.raw_user_meta_data->>'level', NULL),
    COALESCE(NEW.raw_user_meta_data->>'matric_number', NULL)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
