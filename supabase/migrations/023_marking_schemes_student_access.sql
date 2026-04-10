-- Allow everyone (including students) to view marking schemes
CREATE POLICY "Public can view marking schemes" 
  ON public.marking_schemes FOR SELECT 
  USING (true);
