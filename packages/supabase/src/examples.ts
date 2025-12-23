/**
 * EXAMPLE QUERIES AND USAGE
 * 
 * This file shows practical examples of how to use the Supabase client
 * and helper functions throughout your application.
 */

// ============================================================
// AUTHENTICATION EXAMPLES
// ============================================================

import {
  supabase,
  isAdmin,
  getCurrentUserProfile,
  getStudentEnrolledCourses,
  getAllCourses,
  getCourseBySlug,
  getCourseMaterials,
  getCourseAnnouncements,
  isEnrolledInCourse,
} from "./index";

/**
 * Example: Sign up a new student
 * After signup, the trigger function will automatically create a profile
 */
export async function exampleSignUp(email: string, password: string, fullName?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: 'student', // Default role
      },
    },
  });

  if (error) {
    console.error("Signup error:", error);
    return null;
  }

  return data.user;
}

/**
 * Example: Sign in an existing user
 */
export async function exampleSignIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Signin error:", error);
    return null;
  }

  return data.session;
}

/**
 * Example: Sign out
 */
export async function exampleSignOut() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error("Signout error:", error);
    return false;
  }
  
  return true;
}

/**
 * Example: Check if current user is admin
 */
export async function exampleCheckAdminAccess() {
  const admin = await isAdmin();
  
  if (!admin) {
    console.log("User is not an admin");
    return false;
  }

  console.log("User has admin access");
  return true;
}

// ============================================================
// STUDENT APP EXAMPLES
// ============================================================

/**
 * Example: Student fetching their enrolled courses
 */
export async function exampleStudentViewCourses() {
  const courses = await getStudentEnrolledCourses();
  
  courses.forEach((course: any) => {
    console.log(`Course: ${course.title}`);
    console.log(`  Instructor: ${course.profiles?.full_name}`);
    console.log(`  Description: ${course.description}`);
  });

  return courses;
}

/**
 * Example: Student viewing materials for a course
 */
export async function exampleStudentViewMaterials(courseId: string) {
  // First check if student is enrolled
  const isEnrolled = await isEnrolledInCourse(courseId);
  
  if (!isEnrolled) {
    console.error("Student is not enrolled in this course");
    return [];
  }

  // Fetch materials (RLS will ensure they can only see enrolled courses)
  const materials = await getCourseMaterials(courseId);
  
  materials.forEach((material) => {
    console.log(`Material: ${material.title}`);
    console.log(`  Type: ${material.type}`);
    console.log(`  File: ${material.file_path}`);
  });

  return materials;
}

/**
 * Example: Student viewing course announcements
 */
export async function exampleStudentViewAnnouncements(courseId: string) {
  const announcements = await getCourseAnnouncements(courseId);
  
  announcements.forEach((announcement: any) => {
    console.log(`Announcement: ${announcement.title}`);
    console.log(`  By: ${announcement.profiles?.full_name}`);
    console.log(`  Content: ${announcement.content}`);
  });

  return announcements;
}

/**
 * Example: Student viewing a specific course page
 */
export async function exampleStudentViewCoursePage(slug: string) {
  // Get course by slug
  const course = await getCourseBySlug(slug);
  
  if (!course) {
    console.error("Course not found");
    return null;
  }

  // Check if enrolled
  const isEnrolled = await isEnrolledInCourse(course.id);
  
  if (!isEnrolled) {
    // Show preview but restrict content
    console.log(`Course: ${course.title} (Preview)`);
    return { course, isEnrolled: false };
  }

  // Get full course data
  const materials = await getCourseMaterials(course.id);
  const announcements = await getCourseAnnouncements(course.id);

  return {
    course,
    isEnrolled: true,
    materials,
    announcements,
  };
}

// ============================================================
// ADMIN PANEL EXAMPLES
// ============================================================

import {
  getAllStudents,
  createCourse,
  enrollStudent,
  createMaterial,
  createAnnouncement,
  getCourseEnrollments,
  bulkEnrollStudents,
  getMaterialUrl,
  uploadMaterial,
  STORAGE_BUCKETS,
} from "./index";

/**
 * Example: Admin fetching all students
 */
export async function exampleAdminListStudents() {
  const students = await getAllStudents();
  
  students.forEach((student) => {
    console.log(`${student.full_name} (${student.id})`);
  });

  return students;
}

/**
 * Example: Admin creating a new course
 */
export async function exampleAdminCreateCourse(adminId: string) {
  const course = await createCourse(adminId, {
    title: "Advanced Physics",
    description: "Learn advanced concepts in physics",
    slug: "advanced-physics",
  });

  console.log(`Course created: ${course.id}`);
  return course;
}

/**
 * Example: Admin enrolling a student in a course
 */
export async function exampleAdminEnrollStudent(
  studentId: string,
  courseId: string
) {
  const enrollment = await enrollStudent(studentId, courseId);
  
  console.log(`Student enrolled in course: ${enrollment.id}`);
  return enrollment;
}

/**
 * Example: Admin bulk enrolling students
 */
export async function exampleAdminBulkEnroll(
  courseId: string,
  studentIds: string[]
) {
  const enrollments = await bulkEnrollStudents(courseId, studentIds);
  
  console.log(`${enrollments.length} students enrolled`);
  return enrollments;
}

/**
 * Example: Admin viewing course enrollments
 */
export async function exampleAdminViewEnrollments(courseId: string) {
  const enrollments = await getCourseEnrollments(courseId);
  
  console.log(`Total enrollments: ${enrollments.length}`);
  enrollments.forEach((enrollment: any) => {
    console.log(`  - ${enrollment.profiles?.full_name}`);
  });

  return enrollments;
}

/**
 * Example: Admin uploading a course material file and creating metadata
 */
export async function exampleAdminUploadMaterial(
  courseId: string,
  file: File,
  title: string,
  description?: string
) {
  // Upload file to Supabase Storage
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = `course-${courseId}/${fileName}`;

  const uploadData = await uploadMaterial(
    "MATERIALS",
    filePath,
    file
  );

  // Create material record in database
  const material = await createMaterial(courseId, {
    title,
    description,
    type: "pdf", // Determine type from file extension
    file_path: filePath,
    file_size: file.size,
  });

  // Get public URL
  const publicUrl = getMaterialUrl('MATERIALS', filePath);

  console.log(`File uploaded: ${publicUrl}`);
  return { material, publicUrl, uploadData };
}

/**
 * Example: Admin creating an announcement
 */
export async function exampleAdminCreateAnnouncement(
  adminId: string,
  courseId: string
) {
  const announcement = await createAnnouncement(adminId, {
    title: "Midterm Exam Scheduled",
    content: "The midterm exam will be held on December 25th at 10 AM",
    courseId,
    isGlobal: false,
  });

  console.log(`Announcement created: ${announcement.id}`);
  return announcement;
}

/**
 * Example: Admin creating a global announcement
 */
export async function exampleAdminCreateGlobalAnnouncement(adminId: string) {
  const announcement = await createAnnouncement(adminId, {
    title: "Platform Maintenance Notice",
    content: "The platform will be under maintenance on Sunday from 2-4 AM",
    isGlobal: true,
  });

  console.log(`Global announcement created: ${announcement.id}`);
  return announcement;
}

// ============================================================
// REAL-TIME SUBSCRIPTIONS EXAMPLE
// ============================================================

/**
 * Example: Listen to real-time course updates
 */
export function exampleRealtimeCoursesSubscription(callback: (payload: any) => void) {
  const subscription = supabase
    .channel("courses")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "courses",
      },
      callback
    )
    .subscribe();

  return subscription;
}

/**
 * Example: Listen to new announcements for a course
 */
export function exampleRealtimeAnnouncementsSubscription(
  courseId: string,
  callback: (payload: any) => void
) {
  const subscription = supabase
    .channel(`announcements:${courseId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "announcements",
        filter: `course_id=eq.${courseId}`,
      },
      callback
    )
    .subscribe();

  return subscription;
}

