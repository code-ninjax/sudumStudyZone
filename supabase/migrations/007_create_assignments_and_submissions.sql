-- ===============================
-- EXTENSIONS
-- ===============================
create extension if not exists "pgcrypto";

-- ===============================
-- ASSIGNMENTS TABLE
-- ===============================
create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),

  title text not null,
  description text,

  course_code text,
  level text,

  due_date timestamptz,
  max_score integer default 100,

  instructor_id uuid not null -- auth.users.id
    references public.profiles(id)
    on delete cascade,

  is_published boolean default false,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ===============================
-- ASSIGNMENT SUBMISSIONS TABLE
-- ===============================
create table if not exists public.assignment_submissions (
  id uuid primary key default gen_random_uuid(),

  assignment_id uuid not null
    references public.assignments(id)
    on delete cascade,

  student_id uuid not null, -- auth.users.id

  file_url text not null,
  file_type text,           -- pdf / jpeg / jpg
  file_name text,

  score integer,
  feedback text,

  submitted_at timestamptz default now(),
  graded_at timestamptz
);

-- ===============================
-- CONSTRAINTS
-- ===============================
-- One submission per student per assignment
alter table public.assignment_submissions
add constraint unique_assignment_submission
unique (assignment_id, student_id);

-- ===============================
-- INDEXES
-- ===============================
create index if not exists idx_assignments_course
on public.assignments (course_code);

create index if not exists idx_assignments_level
on public.assignments (level);

create index if not exists idx_submissions_assignment
on public.assignment_submissions (assignment_id);

create index if not exists idx_submissions_student
on public.assignment_submissions (student_id);

-- ===============================
-- ENABLE ROW LEVEL SECURITY
-- ===============================
alter table public.assignments enable row level security;
alter table public.assignment_submissions enable row level security;

-- ===============================
-- POLICIES: ASSIGNMENTS (ADMIN ONLY)
-- ===============================

-- Admin can CREATE assignments
create policy "Admin can create assignments"
on public.assignments
for insert
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
    and p.role = 'admin'
  )
);

-- Admin can UPDATE assignments
create policy "Admin can update assignments"
on public.assignments
for update
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
    and p.role = 'admin'
  )
);

-- Admin can VIEW all assignments
create policy "Admin can view all assignments"
on public.assignments
for select
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
    and p.role = 'admin'
  )
);

-- Students can VIEW published assignments only
create policy "Students can view published assignments"
on public.assignments
for select
using (is_published = true);

-- ===============================
-- POLICIES: ASSIGNMENT SUBMISSIONS
-- ===============================

-- Students can SUBMIT assignments
create policy "Students can submit assignments"
on public.assignment_submissions
for insert
with check (auth.uid() = student_id);

-- Students can VIEW their own submissions
create policy "Students can view own submissions"
on public.assignment_submissions
for select
using (auth.uid() = student_id);

-- Admin can VIEW all submissions
create policy "Admin can view submissions"
on public.assignment_submissions
for select
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
    and p.role = 'admin'
  )
);

-- Admin can GRADE submissions
create policy "Admin can grade submissions"
on public.assignment_submissions
for update
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
    and p.role = 'admin'
  )
);
