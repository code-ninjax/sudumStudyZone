# Supabase Client Package

Shared Supabase client and helper functions for the academic platform.

## Installation

This package is part of the monorepo. Install dependencies:

```bash
npm install
```

## Usage

### Basic Import

```typescript
import { supabase, isAdmin, getCurrentUserProfile } from '@supabase/client';
```

### Authentication

```typescript
import { supabase } from '@supabase/client';

// Sign up
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

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});

// Sign out
await supabase.auth.signOut();
```

### Check Admin Status

```typescript
import { isAdmin } from '@supabase/client';

const admin = await isAdmin();
if (admin) {
  // User is admin
}
```

### Student Operations

```typescript
import { 
  getStudentEnrolledCourses, 
  getCourseMaterials,
  getCourseAnnouncements 
} from '@supabase/client';

// Get enrolled courses
const courses = await getStudentEnrolledCourses();

// Get materials for a course
const materials = await getCourseMaterials(courseId);

// Get announcements
const announcements = await getCourseAnnouncements(courseId);
```

### Admin Operations

```typescript
import {
  createCourse,
  enrollStudent,
  createMaterial,
  createAnnouncement,
  uploadMaterial,
  STORAGE_BUCKETS
} from '@supabase/client';

// Create a course
const course = await createCourse(adminId, {
  title: 'Physics 101',
  slug: 'physics-101',
  description: 'Introduction to Physics'
});

// Enroll a student
await enrollStudent(studentId, courseId);

// Upload material
const filePath = `course-${courseId}/${fileName}`;
await uploadMaterial('MATERIALS', filePath, file);

// Create material record
await createMaterial(courseId, {
  title: 'Lecture Notes',
  type: 'pdf',
  file_path: filePath,
  file_size: file.size
});

// Create announcement
await createAnnouncement(adminId, {
  title: 'Important Notice',
  content: 'Midterm exam next week',
  courseId: courseId,
  isGlobal: false
});
```

## API Reference

### Client

- `supabase` - Regular Supabase client (respects RLS)
- `supabaseAdmin` - Admin client (bypasses RLS, use sparingly)

### Helper Functions

- `isAdmin()` - Check if current user is admin
- `getCurrentUserProfile()` - Get current user's profile
- `getAllStudents()` - Get all students (admin only)
- `getAllCourses()` - Get all courses
- `getCourseBySlug(slug)` - Get course by slug
- `getStudentEnrolledCourses()` - Get courses for current student
- `isEnrolledInCourse(courseId)` - Check enrollment
- `getCourseMaterials(courseId)` - Get materials for a course
- `getCourseAnnouncements(courseId?)` - Get announcements
- `getEnrollmentDetails(studentId)` - Get enrollment details

### Admin Functions

- `createCourse(adminId, data)` - Create course
- `updateCourse(courseId, data)` - Update course
- `deleteCourse(courseId)` - Delete course
- `enrollStudent(studentId, courseId)` - Enroll student
- `unenrollStudent(studentId, courseId)` - Unenroll student
- `bulkEnrollStudents(courseId, studentIds)` - Bulk enroll
- `getCourseEnrollments(courseId)` - Get course enrollments
- `createMaterial(courseId, data)` - Create material
- `updateMaterial(materialId, data)` - Update material
- `deleteMaterial(materialId)` - Delete material
- `createAnnouncement(adminId, data)` - Create announcement
- `updateAnnouncement(announcementId, data)` - Update announcement
- `deleteAnnouncement(announcementId)` - Delete announcement

### Storage Functions

- `uploadMaterial(bucket, filePath, file)` - Upload file
- `deleteMaterialFile(bucket, filePath)` - Delete file
- `getMaterialUrl(bucket, filePath)` - Get public URL
- `getSignedUrl(bucket, filePath, expiresIn)` - Get signed URL
- `listMaterialFiles(bucket, path?)` - List files
- `downloadMaterial(bucket, filePath)` - Download file
- `STORAGE_BUCKETS` - Bucket name constants

## Types

All TypeScript types are exported from the package:

```typescript
import type {
  Profile,
  Course,
  Enrollment,
  Material,
  MaterialType,
  Announcement,
  CreateCourseInput,
  UpdateCourseInput,
  CreateMaterialInput,
  CreateAnnouncementInput
} from '@supabase/client';
```

## Examples

See `src/examples.ts` for comprehensive usage examples.

## Environment Variables

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (optional, for admin operations)

