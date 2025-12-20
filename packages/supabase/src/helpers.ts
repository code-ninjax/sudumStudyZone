import { supabase } from "./client";
import type { Profile } from "./types";

/**
 * Check if current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error checking admin status:", error);
    return false;
  }

  return data?.role === "admin";
}

/**
 * Get current user's profile
 */
export async function getCurrentUserProfile(): Promise<Profile | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  return data;
}

/**
 * Fetch all students (admin only)
 */
export async function getAllStudents(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "student")
    .order("full_name", { ascending: true });

  if (error) {
    console.error("Error fetching students:", error);
    return [];
  }

  return data || [];
}

/**
 * Fetch all courses
 */
export async function getAllCourses() {
  const { data, error } = await supabase
    .from("courses")
    .select("*, profiles:instructor_id(full_name)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching courses:", error);
    return [];
  }

  return data || [];
}

/**
 * Fetch a single course by slug
 */
export async function getCourseBySlug(slug: string) {
  const { data, error } = await supabase
    .from("courses")
    .select("*, profiles:instructor_id(full_name)")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching course:", error);
    return null;
  }

  return data;
}

/**
 * Fetch courses enrolled by current student
 */
export async function getStudentEnrolledCourses() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("enrollments")
    .select("courses(*, profiles:instructor_id(full_name))")
    .eq("student_id", user.id)
    .order("enrolled_at", { ascending: false });

  if (error) {
    console.error("Error fetching enrolled courses:", error);
    return [];
  }

  return data?.map((e) => e.courses).filter(Boolean) || [];
}

/**
 * Check if student is enrolled in a course
 */
export async function isEnrolledInCourse(courseId: string): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data, error } = await supabase
    .from("enrollments")
    .select("id")
    .eq("student_id", user.id)
    .eq("course_id", courseId)
    .single();

  return !error && !!data;
}

/**
 * Fetch materials for a course
 */
export async function getCourseMaterials(courseId: string) {
  const { data, error } = await supabase
    .from("materials")
    .select("*")
    .eq("course_id", courseId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching materials:", error);
    return [];
  }

  return data || [];
}

/**
 * Fetch announcements for a course or global announcements
 */
export async function getCourseAnnouncements(courseId?: string) {
  let query = supabase
    .from("announcements")
    .select("*, profiles:created_by(full_name)")
    .order("created_at", { ascending: false });

  if (courseId) {
    query = query.or(
      `course_id.eq.${courseId},is_global.eq.true`
    );
  } else {
    query = query.eq("is_global", true);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching announcements:", error);
    return [];
  }

  return data || [];
}

/**
 * Get enrollment details including course info
 */
export async function getEnrollmentDetails(studentId: string) {
  const { data, error } = await supabase
    .from("enrollments")
    .select("id, course_id, enrolled_at, courses(id, title, slug, description)")
    .eq("student_id", studentId);

  if (error) {
    console.error("Error fetching enrollment details:", error);
    return [];
  }

  return data || [];
}

