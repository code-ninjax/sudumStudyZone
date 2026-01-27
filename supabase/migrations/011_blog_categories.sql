-- Migration 011: Blog Categories and Post Relationship

-- 1. Create Blog Categories Table
CREATE TABLE IF NOT EXISTS public.blog_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    slug text NOT NULL UNIQUE,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 2. Add category_id to blog_posts
-- Note: We check if it exists first because blog_posts was created in migration 006
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'blog_posts' AND column_name = 'category_id'
    ) THEN
        ALTER TABLE public.blog_posts 
        ADD COLUMN category_id uuid REFERENCES public.blog_categories(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 3. Enable RLS
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for Categories
CREATE POLICY "Categories are public" 
ON public.blog_categories FOR SELECT 
USING (true);

CREATE POLICY "Admins have full access to blog_categories"
ON public.blog_categories FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 5. Seed initial categories
INSERT INTO public.blog_categories (name, slug) 
VALUES 
    ('Study Tips', 'study-tips'),
    ('Computer Science', 'computer-science'),
    ('Career', 'career'),
    ('Algorithms', 'algorithms'),
    ('Programming', 'programming'),
    ('Announcements', 'announcements')
ON CONFLICT (name) DO NOTHING;
