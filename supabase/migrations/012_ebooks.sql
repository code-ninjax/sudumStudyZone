-- Create ebooks table
CREATE TABLE IF NOT EXISTS public.ebooks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    author text,
    category text,
    pages integer,
    pulls integer DEFAULT 0,
    rating numeric(2,1) DEFAULT 0,
    cover_image_url text,
    file_url text NOT NULL,
    description text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ebooks ENABLE ROW LEVEL SECURITY;

-- Policies for public access (Read-only)
CREATE POLICY "Anyone can view ebooks" ON public.ebooks
    FOR SELECT USING (true);

-- Policies for admin access (Full control)
CREATE POLICY "Admins can manage ebooks" ON public.ebooks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Seed some initial data
INSERT INTO public.ebooks (title, author, category, pages, pulls, rating, cover_image_url, file_url)
VALUES 
('Introduction to Algorithms', 'Thomas H. Cormen', 'Computer Science', 1312, 1250, 4.8, 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&auto=format&fit=crop&q=60', '#'),
('Clean Code', 'Robert C. Martin', 'Software Engineering', 464, 2100, 4.9, 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60', '#'),
('Design Patterns', 'Gang of Four', 'Software Engineering', 395, 980, 4.7, 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=60', '#');
