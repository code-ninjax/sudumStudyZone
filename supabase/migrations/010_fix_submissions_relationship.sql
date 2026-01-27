-- Migration 010: Fix Submissions Relationship and RLS Recursion
-- This migration ensures admin can see submissions and avoids infinite recursion in policies.

-- 1. Add missing foreign key to assignment_submissions if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'assignment_submissions_student_id_fkey'
    ) THEN
        ALTER TABLE public.assignment_submissions
        ADD CONSTRAINT assignment_submissions_student_id_fkey
        FOREIGN KEY (student_id) REFERENCES public.profiles(id)
        ON DELETE CASCADE;
    END IF;
END $$;

-- 2. Create a recursion-proof is_admin function using JWT metadata
-- This avoids querying the profiles table during every RLS check
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check 'role' in the user's JWT metadata
  -- This set by auth.users metadata -> identity -> token
  RETURN (
    auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
    OR 
    auth.jwt() ->> 'role' = 'service_role'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Update RLS policies for common tables to use the metadata check
-- This significantly improves performance and prevents recursion

-- Assignments
DROP POLICY IF EXISTS "Admins have full access to assignments" ON public.assignments;
CREATE POLICY "Admins have full access to assignments"
ON public.assignments FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Assignment Submissions
DROP POLICY IF EXISTS "Admins have full access to assignment_submissions" ON public.assignment_submissions;
DROP POLICY IF EXISTS "Students can submit" ON public.assignment_submissions;
DROP POLICY IF EXISTS "Students can view own" ON public.assignment_submissions;

CREATE POLICY "Admins have full access to assignment_submissions"
ON public.assignment_submissions FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Students can submit" 
ON public.assignment_submissions FOR INSERT 
WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can view own" 
ON public.assignment_submissions FOR SELECT 
USING (auth.uid() = student_id);

-- Profiles
DROP POLICY IF EXISTS "Admins have full access to profiles" ON public.profiles;
CREATE POLICY "Admins have full access to profiles"
ON public.profiles FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 4. Sync metadata for existing admin users
-- This ensures the metadata-based check works for current admins
UPDATE auth.users 
SET raw_user_meta_data = 
  CASE 
    WHEN raw_user_meta_data IS NULL THEN jsonb_build_object('role', 'admin')
    ELSE raw_user_meta_data || jsonb_build_object('role', 'admin')
  END
WHERE id IN (
  SELECT id FROM public.profiles WHERE role = 'admin'
);
