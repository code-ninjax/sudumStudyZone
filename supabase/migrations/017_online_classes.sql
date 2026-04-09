-- Create online_classes table
CREATE TABLE IF NOT EXISTS public.online_classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    course_code TEXT NOT NULL,
    course_title TEXT,
    level TEXT NOT NULL, -- e.g., '100L', '200L', etc.
    date DATE NOT NULL,
    time TIME NOT NULL,
    meet_link TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.online_classes ENABLE ROW LEVEL SECURITY;

-- Policies
-- Admins can do everything
CREATE POLICY "Admins have full access to online_classes" 
ON public.online_classes 
FOR ALL 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Students can view classes for their level
CREATE POLICY "Students can view online_classes for their level" 
ON public.online_classes 
FOR SELECT 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND (
            profiles.role = 'admin' -- Admins can see all
            OR profiles.level = online_classes.level -- Students see their level
        )
    )
);

-- Public view (if needed, but usually authenticated)
-- CREATE POLICY "Public can view online_classes" ON public.online_classes FOR SELECT USING (true);
