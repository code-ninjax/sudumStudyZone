-- RLS POLICIES

-- PROFILES TABLE POLICIES
-- Users can read their own profile
CREATE POLICY "Users can read their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Admins can read all profiles
CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Only trigger function can insert profiles (on signup)
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- COURSES TABLE POLICIES
-- Anyone can read courses
CREATE POLICY "Anyone can read courses"
  ON courses FOR SELECT
  USING (true);

-- Only admin can create courses
CREATE POLICY "Only admin can create courses"
  ON courses FOR INSERT
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Only admin can update courses
CREATE POLICY "Only admin can update courses"
  ON courses FOR UPDATE
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  )
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Only admin can delete courses
CREATE POLICY "Only admin can delete courses"
  ON courses FOR DELETE
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- ENROLLMENTS TABLE POLICIES
-- Students can read their own enrollments
CREATE POLICY "Students can read their own enrollments"
  ON enrollments FOR SELECT
  USING (auth.uid() = student_id);

-- Admins can read all enrollments
CREATE POLICY "Admins can read all enrollments"
  ON enrollments FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Only admin can create enrollments
CREATE POLICY "Only admin can create enrollments"
  ON enrollments FOR INSERT
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Only admin can update enrollments
CREATE POLICY "Only admin can update enrollments"
  ON enrollments FOR UPDATE
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  )
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Only admin can delete enrollments
CREATE POLICY "Only admin can delete enrollments"
  ON enrollments FOR DELETE
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- MATERIALS TABLE POLICIES
-- Students can read materials for enrolled courses
CREATE POLICY "Students can read materials for enrolled courses"
  ON materials FOR SELECT
  USING (
    course_id IN (
      SELECT course_id FROM enrollments WHERE student_id = auth.uid()
    )
    OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Admins can read all materials
CREATE POLICY "Admins can read all materials"
  ON materials FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Only admin can create materials
CREATE POLICY "Only admin can create materials"
  ON materials FOR INSERT
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Only admin can update materials
CREATE POLICY "Only admin can update materials"
  ON materials FOR UPDATE
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  )
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Only admin can delete materials
CREATE POLICY "Only admin can delete materials"
  ON materials FOR DELETE
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- ANNOUNCEMENTS TABLE POLICIES
-- Students can read announcements for enrolled courses or global announcements
CREATE POLICY "Students can read course and global announcements"
  ON announcements FOR SELECT
  USING (
    is_global = TRUE
    OR course_id IN (
      SELECT course_id FROM enrollments WHERE student_id = auth.uid()
    )
    OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Admins can read all announcements
CREATE POLICY "Admins can read all announcements"
  ON announcements FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Only admin can create announcements
CREATE POLICY "Only admin can create announcements"
  ON announcements FOR INSERT
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Only admin can update announcements
CREATE POLICY "Only admin can update announcements"
  ON announcements FOR UPDATE
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  )
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Only admin can delete announcements
CREATE POLICY "Only admin can delete announcements"
  ON announcements FOR DELETE
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

