import { supabase } from "./client";
import type { CreateCourseInput, UpdateCourseInput, CreateMaterialInput, UpdateMaterialInput, CreateAnnouncementInput } from "./types";

/**
 * Admin: Create a new course
 * Uses regular client - RLS policies allow admins to create courses
 */
export async function createCourse(
  adminId: string,
  courseData: CreateCourseInput
) {
  const { data, error } = await supabase
    .from("courses")
    .insert({
      title: courseData.title,
      description: courseData.description,
      slug: courseData.slug,
      instructor_id: adminId,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating course:", error);
    throw error;
  }

  return data;
}

/**
 * Admin: Update a course
 */
export async function updateCourse(
  courseId: string,
  courseData: UpdateCourseInput
) {
  const { data, error } = await supabase
    .from("courses")
    .update(courseData)
    .eq("id", courseId)
    .select()
    .single();

  if (error) {
    console.error("Error updating course:", error);
    throw error;
  }

  return data;
}

/**
 * Admin: Delete a course
 */
export async function deleteCourse(courseId: string) {
  const { error } = await supabase
    .from("courses")
    .delete()
    .eq("id", courseId);

  if (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
}

/**
 * Admin: Enroll a student in a course
 */
export async function enrollStudent(studentId: string, courseId: string) {
  const { data, error } = await supabase
    .from("enrollments")
    .insert({
      student_id: studentId,
      course_id: courseId,
    })
    .select()
    .single();

  if (error) {
    console.error("Error enrolling student:", error);
    throw error;
  }

  return data;
}

/**
 * Admin: Unenroll a student from a course
 */
export async function unenrollStudent(studentId: string, courseId: string) {
  const { error } = await supabase
    .from("enrollments")
    .delete()
    .eq("student_id", studentId)
    .eq("course_id", courseId);

  if (error) {
    console.error("Error unenrolling student:", error);
    throw error;
  }
}

/**
 * Admin: Create course material (metadata)
 * Note: File upload should be handled separately using Supabase Storage
 */
export async function createMaterial(
  courseId: string,
  materialData: CreateMaterialInput
) {
  const { data, error } = await supabase
    .from("materials")
    .insert({
      course_id: courseId,
      title: materialData.title,
      description: materialData.description,
      type: materialData.type,
      file_path: materialData.file_path,
      file_size: materialData.file_size,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating material:", error);
    throw error;
  }

  return data;
}

/**
 * Admin: Update course material
 */
export async function updateMaterial(
  materialId: string,
  materialData: UpdateMaterialInput
) {
  const { data, error } = await supabase
    .from("materials")
    .update(materialData)
    .eq("id", materialId)
    .select()
    .single();

  if (error) {
    console.error("Error updating material:", error);
    throw error;
  }

  return data;
}

/**
 * Admin: Delete course material
 */
export async function deleteMaterial(materialId: string) {
  const { error } = await supabase
    .from("materials")
    .delete()
    .eq("id", materialId);

  if (error) {
    console.error("Error deleting material:", error);
    throw error;
  }
}

/**
 * Admin: Create announcement
 */
export async function createAnnouncement(
  createdBy: string,
  announcementData: CreateAnnouncementInput
) {
  const { data, error } = await supabase
    .from("announcements")
    .insert({
      title: announcementData.title,
      content: announcementData.content,
      course_id: announcementData.courseId || null,
      is_global: announcementData.isGlobal || false,
      created_by: createdBy,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating announcement:", error);
    throw error;
  }

  return data;
}

/**
 * Admin: Update announcement
 */
export async function updateAnnouncement(
  announcementId: string,
  announcementData: Partial<{
    title: string;
    content: string;
    is_global: boolean;
  }>
) {
  const { data, error } = await supabase
    .from("announcements")
    .update(announcementData)
    .eq("id", announcementId)
    .select()
    .single();

  if (error) {
    console.error("Error updating announcement:", error);
    throw error;
  }

  return data;
}

/**
 * Admin: Delete announcement
 */
export async function deleteAnnouncement(announcementId: string) {
  const { error } = await supabase
    .from("announcements")
    .delete()
    .eq("id", announcementId);

  if (error) {
    console.error("Error deleting announcement:", error);
    throw error;
  }
}

/**
 * Admin: Get all enrollments for a course
 */
export async function getCourseEnrollments(courseId: string) {
  const { data, error } = await supabase
    .from("enrollments")
    .select("*, profiles:student_id(id, full_name, role)")
    .eq("course_id", courseId)
    .order("enrolled_at", { ascending: false });

  if (error) {
    console.error("Error fetching course enrollments:", error);
    return [];
  }

  return data || [];
}

/**
 * Admin: Bulk enroll students to a course
 */
export async function bulkEnrollStudents(courseId: string, studentIds: string[]) {
  const enrollments = studentIds.map((studentId) => ({
    student_id: studentId,
    course_id: courseId,
  }));

  const { data, error } = await supabase
    .from("enrollments")
    .insert(enrollments)
    .select();

  if (error) {
    console.error("Error bulk enrolling students:", error);
    throw error;
  }

  return data || [];
}

