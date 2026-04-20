-- Add department_id to assignment_submissions
ALTER TABLE public.assignment_submissions 
ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_submissions_department_id ON public.assignment_submissions(department_id);

-- Comment explaining the column
COMMENT ON COLUMN public.assignment_submissions.department_id IS 'The department the student selected when submitting this assignment';
