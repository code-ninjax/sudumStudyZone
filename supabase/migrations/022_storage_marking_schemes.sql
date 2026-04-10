-- Create the marking-schemes bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('marking-schemes', 'marking-schemes', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Note: RLS is enabled by default on storage.objects

-- Allow public read access to the marking-schemes bucket
CREATE POLICY "Public can view marking schemes" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'marking-schemes');

-- Allow admins to insert into marking-schemes bucket
CREATE POLICY "Admins can upload marking schemes" 
  ON storage.objects FOR INSERT 
  WITH CHECK (
    bucket_id = 'marking-schemes' AND
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow admins to update marking schemes
CREATE POLICY "Admins can update marking schemes" 
  ON storage.objects FOR UPDATE 
  USING (
    bucket_id = 'marking-schemes' AND
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow admins to delete marking schemes
CREATE POLICY "Admins can delete marking schemes" 
  ON storage.objects FOR DELETE 
  USING (
    bucket_id = 'marking-schemes' AND
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );
