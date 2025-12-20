/**
 * Type definitions for Supabase tables and related types
 */

export interface Profile {
  id: string;
  full_name: string | null;
  role: 'admin' | 'student';
  faculty: string | null;
  department: string | null;
  matric_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  instructor_id: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string | null;
  };
}

export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  enrolled_at: string;
  courses?: Course;
  profiles?: Profile;
}

export type MaterialType = 'pdf' | 'ebook' | 'document' | 'video' | 'other';

export interface Material {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  type: MaterialType;
  file_path: string | null;
  file_size: number | null;
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: string;
  course_id: string | null;
  created_by: string;
  title: string;
  content: string;
  is_global: boolean;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string | null;
  };
}

export interface CreateCourseInput {
  title: string;
  description?: string;
  slug: string;
}

export interface UpdateCourseInput {
  title?: string;
  description?: string;
  slug?: string;
}

export interface CreateMaterialInput {
  title: string;
  description?: string;
  type: MaterialType;
  file_path: string;
  file_size?: number;
}

export interface UpdateMaterialInput {
  title?: string;
  description?: string;
  type?: MaterialType;
  file_path?: string;
  file_size?: number;
}

export interface CreateAnnouncementInput {
  title: string;
  content: string;
  courseId?: string;
  isGlobal?: boolean;
}

export interface UpdateAnnouncementInput {
  title?: string;
  content?: string;
  is_global?: boolean;
}

