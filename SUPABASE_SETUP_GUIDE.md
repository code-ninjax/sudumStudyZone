# Supabase Backend Setup Guide

This guide will help you set up the Supabase backend for the academic platform.

## Prerequisites

1. A Supabase project (create one at [supabase.com](https://supabase.com))
2. Your project's URL and API keys

## Step 1: Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

You can find these in your Supabase Dashboard under **Settings > API**.

## Step 2: Run Database Migrations

Run the SQL migrations in order from the `supabase/migrations/` folder:

1. **001_initial_schema.sql** - Creates all tables
2. **002_rls_policies.sql** - Sets up Row Level Security policies
3. **003_triggers.sql** - Creates triggers for profile creation and updated_at
4. **004_storage_policies.sql** - Sets up storage bucket policies

### How to Run Migrations

**Option 1: Supabase Dashboard (Recommended)**
1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste each migration file's contents
4. Run them in order (001, 002, 003, 004)

**Option 2: Supabase CLI**
```bash
supabase db push
```

## Step 3: Create Storage Buckets

1. Go to **Storage** in your Supabase Dashboard
2. Create two public buckets:
   - `course-materials` (Public bucket)
   - `ebooks` (Public bucket)

**Important:** Make sure the bucket names match exactly:
- `course-materials`
- `ebooks`

## Step 4: Create Your First Admin User

After running the migrations, you need to create an admin user. You have two options:

### Option 1: Via Signup (Recommended)

1. Sign up a new user through your app's signup page
2. The trigger will automatically create a profile with role 'student'
3. Manually update the profile to 'admin' in the Supabase Dashboard:
   ```sql
   UPDATE profiles 
   SET role = 'admin' 
   WHERE id = 'user-uuid-here';
   ```

### Option 2: Direct SQL (Using Service Role)

If you have the service role key, you can create an admin directly:

```sql
-- First, create the auth user (you'll need to do this via Supabase Auth API or Dashboard)
-- Then update the profile:
UPDATE profiles 
SET role = 'admin' 
WHERE id = 'user-uuid-here';
```

## Step 5: Verify Setup

Test that everything is working:

1. **Test Authentication:**
   ```typescript
   import { supabase } from '@supabase/client';
   
   const { data, error } = await supabase.auth.signUp({
     email: 'test@example.com',
     password: 'password123',
     options: {
       data: {
         full_name: 'Test User',
         role: 'student'
       }
     }
   });
   ```

2. **Check Profile Creation:**
   - After signup, check the `profiles` table in Supabase Dashboard
   - A profile should be automatically created

3. **Test Admin Functions:**
   ```typescript
   import { isAdmin, createCourse } from '@supabase/client';
   
   const admin = await isAdmin();
   if (admin) {
     const course = await createCourse(userId, {
       title: 'Test Course',
       slug: 'test-course',
       description: 'A test course'
     });
   }
   ```

## Database Schema Overview

### Tables

1. **profiles** - User profiles linked to auth.users
   - `id` (UUID, references auth.users)
   - `full_name` (TEXT)
   - `role` ('admin' | 'student')
   - `created_at`, `updated_at`

2. **courses** - Course information
   - `id` (UUID)
   - `title`, `description`, `slug`
   - `instructor_id` (references profiles)
   - `created_at`, `updated_at`

3. **enrollments** - Student-course relationships
   - `id` (UUID)
   - `student_id`, `course_id`
   - `enrolled_at`

4. **materials** - Course materials metadata
   - `id` (UUID)
   - `course_id`, `title`, `description`
   - `type` ('pdf' | 'ebook' | 'document' | 'video' | 'other')
   - `file_path`, `file_size`
   - `created_at`, `updated_at`

5. **announcements** - Course and global announcements
   - `id` (UUID)
   - `course_id` (nullable), `created_by`
   - `title`, `content`
   - `is_global` (boolean)
   - `created_at`, `updated_at`

## Security Model

### Row Level Security (RLS)

- **Admin**: Can read/write everything
- **Student**: 
  - Can read their own profile
  - Can read courses they're enrolled in
  - Can read materials for enrolled courses
  - Can read announcements (course-specific or global)
  - Cannot create, update, or delete any data

### Storage Policies

- **Authenticated users**: Can read (download) files
- **Admin only**: Can upload, update, and delete files

## Common Tasks

### Enrolling a Student in a Course

```typescript
import { enrollStudent } from '@supabase/client';

await enrollStudent(studentId, courseId);
```

### Uploading Course Material

```typescript
import { uploadMaterial, createMaterial, STORAGE_BUCKETS } from '@supabase/client';

// 1. Upload file
const filePath = `course-${courseId}/${fileName}`;
await uploadMaterial('MATERIALS', filePath, file);

// 2. Create material record
await createMaterial(courseId, {
  title: 'Material Title',
  type: 'pdf',
  file_path: filePath,
  file_size: file.size
});
```

### Fetching Student's Enrolled Courses

```typescript
import { getStudentEnrolledCourses } from '@supabase/client';

const courses = await getStudentEnrolledCourses();
```

## Troubleshooting

### Profile not created on signup
- Check that the trigger function `handle_new_user()` exists
- Verify the trigger `on_auth_user_created` is active
- Check Supabase logs for errors

### RLS blocking admin operations
- Verify the user's profile has `role = 'admin'`
- Check that RLS policies are correctly applied
- Ensure you're using the authenticated client (not service role for normal operations)

### Storage upload fails
- Verify storage buckets exist and are public
- Check storage policies are applied
- Ensure user is authenticated and has admin role

## Next Steps

1. Set up your environment variables
2. Run all migrations
3. Create storage buckets
4. Create your first admin user
5. Start building your admin panel and student app!

For code examples, see `packages/supabase/src/examples.ts`

