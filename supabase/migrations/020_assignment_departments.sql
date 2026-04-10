-- Create junction table for assignments and departments
CREATE TABLE IF NOT EXISTS public.assignment_departments (
  assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
  department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
  PRIMARY KEY (assignment_id, department_id)
);

-- Enable RLS
ALTER TABLE public.assignment_departments ENABLE ROW LEVEL SECURITY;

-- Admins can do anything
CREATE POLICY "Admins can manage assignment_departments" ON public.assignment_departments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Students can read assignment_departments
CREATE POLICY "Students can view assignment_departments" ON public.assignment_departments
  FOR SELECT USING (true);
