-- STORAGE BUCKET POLICIES
-- Note: Storage buckets must be created in Supabase Dashboard first
-- Buckets: 'course-materials' and 'ebooks'

-- ============================================================
-- COURSE MATERIALS BUCKET POLICIES
-- ============================================================

-- Allow authenticated users to read (download) files
CREATE POLICY "Anyone authenticated can read course materials"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'course-materials' 
  AND auth.role() = 'authenticated'
);

-- Only admins can upload files
CREATE POLICY "Only admins can upload course materials"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'course-materials'
  AND (
    SELECT role FROM profiles WHERE id = auth.uid()
  ) = 'admin'
);

-- Only admins can update files
CREATE POLICY "Only admins can update course materials"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'course-materials'
  AND (
    SELECT role FROM profiles WHERE id = auth.uid()
  ) = 'admin'
)
WITH CHECK (
  bucket_id = 'course-materials'
  AND (
    SELECT role FROM profiles WHERE id = auth.uid()
  ) = 'admin'
);

-- Only admins can delete files
CREATE POLICY "Only admins can delete course materials"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'course-materials'
  AND (
    SELECT role FROM profiles WHERE id = auth.uid()
  ) = 'admin'
);

-- ============================================================
-- EBOOKS BUCKET POLICIES
-- ============================================================

-- Allow authenticated users to read (download) files
CREATE POLICY "Anyone authenticated can read ebooks"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'ebooks' 
  AND auth.role() = 'authenticated'
);

-- Only admins can upload files
CREATE POLICY "Only admins can upload ebooks"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'ebooks'
  AND (
    SELECT role FROM profiles WHERE id = auth.uid()
  ) = 'admin'
);

-- Only admins can update files
CREATE POLICY "Only admins can update ebooks"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'ebooks'
  AND (
    SELECT role FROM profiles WHERE id = auth.uid()
  ) = 'admin'
)
WITH CHECK (
  bucket_id = 'ebooks'
  AND (
    SELECT role FROM profiles WHERE id = auth.uid()
  ) = 'admin'
);

-- Only admins can delete files
CREATE POLICY "Only admins can delete ebooks"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'ebooks'
  AND (
    SELECT role FROM profiles WHERE id = auth.uid()
  ) = 'admin'
);

