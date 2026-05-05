-- Link departments to faculties
-- Add faculty_id to departments table to create the hierarchical relationship

ALTER TABLE public.departments ADD COLUMN IF NOT EXISTS faculty_id UUID REFERENCES public.faculties(id) ON DELETE CASCADE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_departments_faculty_id ON public.departments(faculty_id);

-- Add a comment explaining the relationship
COMMENT ON COLUMN public.departments.faculty_id IS 'The faculty that this department belongs to';
