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

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload course materials"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'course-materials'
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update files
CREATE POLICY "Authenticated users can update course materials"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'course-materials'
  AND auth.role() = 'authenticated'
)
WITH CHECK (
  bucket_id = 'course-materials'
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete course materials"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'course-materials'
  AND auth.role() = 'authenticated'
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

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload ebooks"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'ebooks'
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update files
CREATE POLICY "Authenticated users can update ebooks"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'ebooks'
  AND auth.role() = 'authenticated'
)
WITH CHECK (
  bucket_id = 'ebooks'
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete ebooks"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'ebooks'
  AND auth.role() = 'authenticated'
);

