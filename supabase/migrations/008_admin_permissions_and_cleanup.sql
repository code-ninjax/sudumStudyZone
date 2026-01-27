-- Migration 008: Admin Permissions and Cleanup

-- 1. Ensure the 'admin' role has full permissions on all tables in the public schema
-- This script grants full access to any user with the 'admin' role in the profiles table.

-- Create a helper function to check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Update RLS policies for all tables to allow admins full access
-- We'll do this for the existing tables: profiles, courses, enrollments, materials, announcements, assignments, assignment_submissions

-- ASSIGNMENTS
DROP POLICY IF EXISTS "Admin can create assignments" ON public.assignments;
DROP POLICY IF EXISTS "Admin can update assignments" ON public.assignments;
DROP POLICY IF EXISTS "Admin can view all assignments" ON public.assignments;

CREATE POLICY "Admins have full access to assignments"
ON public.assignments
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ASSIGNMENT SUBMISSIONS
DROP POLICY IF EXISTS "Admin can view submissions" ON public.assignment_submissions;
DROP POLICY IF EXISTS "Admin can grade submissions" ON public.assignment_submissions;

CREATE POLICY "Admins have full access to assignment_submissions"
ON public.assignment_submissions
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- COURSES
CREATE POLICY "Admins have full access to courses"
ON public.courses
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- MATERIALS
CREATE POLICY "Admins have full access to materials"
ON public.materials
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ANNOUNCEMENTS
CREATE POLICY "Admins have full access to announcements"
ON public.announcements
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ENROLLMENTS
CREATE POLICY "Admins have full access to enrollments"
ON public.enrollments
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- PROFILES
CREATE POLICY "Admins have full access to profiles"
ON public.profiles
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- BLOG POSTS (assuming they exist from migration 006)
-- Let's check if blog_posts table exists
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'blog_posts') THEN
        CREATE POLICY "Admins have full access to blog_posts"
        ON public.blog_posts
        FOR ALL
        USING (public.is_admin())
        WITH CHECK (public.is_admin());
    END IF;
END $$;
