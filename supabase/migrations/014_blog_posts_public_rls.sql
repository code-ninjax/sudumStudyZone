-- Enable RLS on blog_posts (it might already be enabled or disabled)
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Drop existing restricted select policies if any (except admin)
-- DROP POLICY IF EXISTS "Anyone can read published blog posts" ON public.blog_posts;

-- Allow anyone to read published blog posts
CREATE POLICY "Anyone can read published blog posts"
ON public.blog_posts
FOR SELECT
USING (published = true);

-- Ensure admins can still see everything (this should already exist from migration 008, but being explicit is safer)
-- If migration 008 was applied correctly, public.is_admin() handles it.
-- But the student side needs the public policy specifically.
