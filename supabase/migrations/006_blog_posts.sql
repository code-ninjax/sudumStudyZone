-- Blog Posts table
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  featured_image_url TEXT,
  attachment_url TEXT,
  attachment_name TEXT,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_created_at ON blog_posts(created_at DESC);

-- Enable Row Level Security
-- ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
-- RLS is currently DISABLED for development - enable in production
ALTER TABLE blog_posts DISABLE ROW LEVEL SECURITY;

-- RLS POLICIES FOR BLOG_POSTS TABLE (Kept for reference but not active)
-- NOTE: These policies are not enforced because RLS is disabled
-- CREATE POLICY "Anyone can read published blog posts"
--   ON blog_posts FOR SELECT
--   USING (published = true);

-- -- Admins can read all blog posts (including drafts)
-- CREATE POLICY "Admins can read all blog posts"
--   ON blog_posts FOR SELECT
--   USING (
--     (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
--   );

-- -- Only admin can create blog posts
-- CREATE POLICY "Only admin can create blog posts"
--   ON blog_posts FOR INSERT
--   WITH CHECK (
--     (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
--   );

-- -- Only admin can update blog posts
-- CREATE POLICY "Only admin can update blog posts"
--   ON blog_posts FOR UPDATE
--   USING (
--     (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
--   )
--   WITH CHECK (
--     (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
--   );

-- -- Only admin can delete blog posts
-- CREATE POLICY "Only admin can delete blog posts"
--   ON blog_posts FOR DELETE
--   USING (
--     (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
--   );

-- Create trigger for updated_at
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

