-- Create faculties table
CREATE TABLE IF NOT EXISTS public.faculties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Turn on row level security
ALTER TABLE public.faculties ENABLE ROW LEVEL SECURITY;

-- Everyone can read faculties
CREATE POLICY "Public can view faculties" ON public.faculties
  FOR SELECT USING (true);

-- Only admins can insert/update/delete faculties
CREATE POLICY "Admins can insert faculties" ON public.faculties
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update faculties" ON public.faculties
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete faculties" ON public.faculties
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_faculties_name ON public.faculties(name);
CREATE INDEX IF NOT EXISTS idx_faculties_code ON public.faculties(code);
