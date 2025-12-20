# Quick Reference Guide

## Common Queries

### Check if user is admin
```typescript
import { isAdmin } from '@supabase/client';
const admin = await isAdmin();
```

### Get current user profile
```typescript
import { getCurrentUserProfile } from '@supabase/client';
const profile = await getCurrentUserProfile();
```

### Fetch enrolled courses (student)
```typescript
import { getStudentEnrolledCourses } from '@supabase/client';
const courses = await getStudentEnrolledCourses();
```

### Fetch materials for a course
```typescript
import { getCourseMaterials } from '@supabase/client';
const materials = await getCourseMaterials(courseId);
```

### Fetch announcements
```typescript
import { getCourseAnnouncements } from '@supabase/client';
// Course-specific + global
const announcements = await getCourseAnnouncements(courseId);
// Global only
const global = await getCourseAnnouncements();
```

## Admin Operations

### Create course
```typescript
import { createCourse } from '@supabase/client';
const course = await createCourse(adminId, {
  title: 'Course Title',
  slug: 'course-slug',
  description: 'Course description'
});
```

### Enroll student
```typescript
import { enrollStudent } from '@supabase/client';
await enrollStudent(studentId, courseId);
```

### Upload and create material
```typescript
import { uploadMaterial, createMaterial, STORAGE_BUCKETS } from '@supabase/client';

// 1. Upload file
const filePath = `course-${courseId}/${Date.now()}-${file.name}`;
await uploadMaterial('MATERIALS', filePath, file);

// 2. Create material record
await createMaterial(courseId, {
  title: file.name,
  type: 'pdf',
  file_path: filePath,
  file_size: file.size
});
```

### Create announcement
```typescript
import { createAnnouncement } from '@supabase/client';

// Course-specific
await createAnnouncement(adminId, {
  title: 'Title',
  content: 'Content',
  courseId: courseId,
  isGlobal: false
});

// Global
await createAnnouncement(adminId, {
  title: 'Title',
  content: 'Content',
  isGlobal: true
});
```

## File Downloads

### Get public URL
```typescript
import { getMaterialUrl, STORAGE_BUCKETS } from '@supabase/client';
const url = getMaterialUrl(STORAGE_BUCKETS.MATERIALS, filePath);
```

### Download file
```typescript
import { downloadMaterial, STORAGE_BUCKETS } from '@supabase/client';
const blob = await downloadMaterial(STORAGE_BUCKETS.MATERIALS, filePath);
```

## Authentication

### Sign up
```typescript
import { supabase } from '@supabase/client';
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      full_name: 'John Doe',
      role: 'student'
    }
  }
});
```

### Sign in
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});
```

### Sign out
```typescript
await supabase.auth.signOut();
```

## Database Tables

- `profiles` - User profiles (id, full_name, role)
- `courses` - Courses (id, title, description, slug, instructor_id)
- `enrollments` - Student-course relationships (student_id, course_id)
- `materials` - Course materials (course_id, title, type, file_path)
- `announcements` - Announcements (course_id, title, content, is_global)

## Storage Buckets

- `course-materials` - Course PDFs and documents
- `ebooks` - Ebook files

## RLS Summary

- **Admin**: Full read/write access to everything
- **Student**: 
  - Read own profile
  - Read enrolled courses
  - Read materials for enrolled courses
  - Read announcements (course + global)
  - No create/update/delete permissions

