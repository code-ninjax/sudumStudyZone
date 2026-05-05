/**
 * Type definitions for Supabase tables and related types
 */

export interface Profile {
  id: string;
  full_name: string | null;
  role: 'admin' | 'student';
  faculty: string | null;
  faculty_id: string | null;
  department: string | null;
  department_id: string | null;
  level: string | null;
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

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string;
  category_id: string | null;
  featured_image_url: string | null;
  attachment_url: string | null;
  attachment_name: string | null;
  author_id: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
  };
  blog_categories?: BlogCategory;
}

export interface CreateBlogPostInput {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  category?: string;
  category_id?: string;
  featured_image_url?: string;
  attachment_url?: string;
  attachment_name?: string;
  published?: boolean;
}

export interface UpdateBlogPostInput extends Partial<CreateBlogPostInput> { }

export interface EBook {
  id: string;
  title: string;
  author: string | null;
  category: string | null;
  pages: number | null;
  pulls: number;
  rating: number;
  rating_count: number;
  rating_sum: number;
  cover_image_url: string | null;
  file_url: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateEBookInput {
  title: string;
  author?: string;
  category?: string;
  pages?: number;
  cover_image_url?: string;
  file_url: string;
  description?: string;
}


export interface Assignment {
  id: string;
  title: string;
  description: string | null;
  course_code: string | null;
  level: string | null;
  due_date: string | null;
  max_score: number;
  instructor_id: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string | null;
  };
}

export interface AssignmentSubmission {
  id: string;
  assignment_id: string;
  student_id: string;
  file_url: string;
  file_name: string | null;
  file_size: number | null;
  score: number | null;
  feedback: string | null;
  department_id: string | null;
  submitted_at: string;
  profiles?: {
    full_name: string | null;
    matric_number: string | null;
  };
  assignments?: {
    title: string;
  };
}

export interface CreateAssignmentInput {
  title: string;
  description?: string;
  course_code?: string;
  level?: string;
  due_date?: string;
  max_score?: number;
}
