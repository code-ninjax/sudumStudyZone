import { supabase, supabaseAdmin } from "./client";
import type { CreateCourseInput, UpdateCourseInput, CreateMaterialInput, UpdateMaterialInput, CreateAnnouncementInput, CreateBlogPostInput, UpdateBlogPostInput, BlogPost } from "./types";

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

/**
 * Admin: Get statistics for dashboard
 */
export async function getAdminStatistics() {
  try {
    // Get total students count
    // Use supabaseAdmin if available to bypass RLS for accurate counts, otherwise use regular client
    const client = supabaseAdmin || supabase;
    const { count: totalStudents, error: studentsError } = await client
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "student");
    
    if (studentsError) {
      console.error("Error fetching total students count:", studentsError);
    }

    // Get total courses count
    const { count: totalCourses, error: coursesError } = await client
      .from("courses")
      .select("*", { count: "exact", head: true });

    if (coursesError) {
      console.error("Error fetching total courses count:", coursesError);
    }

    // Get total materials count
    const { count: totalMaterials, error: materialsError } = await client
      .from("materials")
      .select("*", { count: "exact", head: true });

    if (materialsError) {
      console.error("Error fetching total materials count:", materialsError);
    }

    // Get total enrollments count
    const { count: totalEnrollments, error: enrollmentsError } = await client
      .from("enrollments")
      .select("*", { count: "exact", head: true });

    if (enrollmentsError) {
      console.error("Error fetching total enrollments count:", enrollmentsError);
    }

    // Get newly enrolled students (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { count: newStudents, error: newStudentsError } = await client
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "student")
      .gte("created_at", sevenDaysAgo.toISOString());

    if (newStudentsError) {
      console.error("Error fetching new students count:", newStudentsError);
    }

    // Get newly enrolled in courses (last 7 days)
    const { count: newEnrollments, error: newEnrollmentsError } = await client
      .from("enrollments")
      .select("*", { count: "exact", head: true })
      .gte("enrolled_at", sevenDaysAgo.toISOString());

    if (newEnrollmentsError) {
      console.error("Error fetching new enrollments count:", newEnrollmentsError);
    }

    // Calculate engagement rate (students enrolled in at least one course / total students)
    const { count: enrolledStudents, error: enrolledStudentsError } = await client
      .from("enrollments")
      .select("student_id", { count: "exact", head: true });

    if (enrolledStudentsError) {
      console.error("Error fetching enrolled students count:", enrolledStudentsError);
    }

    const uniqueEnrolledStudents = new Set();
    const { data: enrollmentsData, error: enrollmentsDataError } = await client
      .from("enrollments")
      .select("student_id");
    
    if (enrollmentsDataError) {
      console.error("Error fetching enrollments data:", enrollmentsDataError);
    }
    
    enrollmentsData?.forEach((e: any) => uniqueEnrolledStudents.add(e.student_id));
    const engagementRate = totalStudents && totalStudents > 0
      ? Math.round((uniqueEnrolledStudents.size / totalStudents) * 100)
      : 0;

    console.log('getAdminStatistics - Raw results:', {
      totalStudents,
      totalCourses,
      totalMaterials,
      totalEnrollments,
      newStudents,
      usingSupabaseAdmin: !!supabaseAdmin,
      errors: {
        students: studentsError,
        courses: coursesError,
        materials: materialsError,
        enrollments: enrollmentsError,
        newStudents: newStudentsError,
        newEnrollments: newEnrollmentsError,
      }
    });

    return {
      totalStudents: totalStudents || 0,
      totalCourses: totalCourses || 0,
      totalMaterials: totalMaterials || 0,
      totalEnrollments: totalEnrollments || 0,
      newStudents: newStudents || 0,
      newEnrollments: newEnrollments || 0,
      engagementRate,
      errors: {
        students: studentsError,
        courses: coursesError,
        materials: materialsError,
        enrollments: enrollmentsError,
        newStudents: newStudentsError,
        newEnrollments: newEnrollmentsError,
      },
    };
  } catch (error) {
    console.error("Error fetching admin statistics:", error);
    return {
      totalStudents: 0,
      totalCourses: 0,
      totalMaterials: 0,
      totalEnrollments: 0,
      newStudents: 0,
      newEnrollments: 0,
      engagementRate: 0,
      errors: {},
    };
  }
}

/**
 * Admin: Get newly enrolled students (last 7 days)
 */
export async function getNewlyEnrolledStudents(limit: number = 10) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "student")
    .gte("created_at", sevenDaysAgo.toISOString())
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching newly enrolled students:", error);
    return [];
  }

  return data || [];
}

/**
 * Admin: Get recent enrollments in courses (last 7 days)
 */
export async function getRecentEnrollments(limit: number = 10) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data, error } = await supabase
    .from("enrollments")
    .select(`
      *,
      student_id(id, full_name, matric_number),
      course_id(id, title, slug)
    `)
    .gte("enrolled_at", sevenDaysAgo.toISOString())
    .order("enrolled_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching recent enrollments:", error);
    return [];
  }

  return data || [];
}

/**
 * Admin: Get recent activities (enrollments, materials, announcements)
 */
export async function getRecentActivities(limit: number = 10) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  try {
    // Get recent enrollments - simplified query
    const { data: enrollments } = await supabase
      .from("enrollments")
      .select(`
        enrolled_at,
        course_id,
        student_id
      `)
      .gte("enrolled_at", sevenDaysAgo.toISOString())
      .order("enrolled_at", { ascending: false })
      .limit(limit);

    // Fetch course and student details separately for enrollments
    const enrollmentDetails = await Promise.all(
      (enrollments || []).map(async (enrollment: any) => {
        const [courseRes, studentRes] = await Promise.all([
          supabase.from("courses").select("title, slug").eq("id", enrollment.course_id).single(),
          supabase.from("profiles").select("full_name").eq("id", enrollment.student_id).single(),
        ]);
        return {
          ...enrollment,
          courses: courseRes.data,
          profiles: studentRes.data,
        };
      })
    );

    // Get recent materials
    const { data: materials } = await supabase
      .from("materials")
      .select(`
        created_at,
        title,
        course_id
      `)
      .gte("created_at", sevenDaysAgo.toISOString())
      .order("created_at", { ascending: false })
      .limit(limit);

    // Fetch course details for materials
    const materialDetails = await Promise.all(
      (materials || []).map(async (material: any) => {
        const courseRes = await supabase
          .from("courses")
          .select("title")
          .eq("id", material.course_id)
          .single();
        return {
          ...material,
          courses: courseRes.data,
        };
      })
    );

    // Get recent announcements
    const { data: announcements } = await supabase
      .from("announcements")
      .select(`
        created_at,
        title,
        course_id,
        is_global
      `)
      .gte("created_at", sevenDaysAgo.toISOString())
      .order("created_at", { ascending: false })
      .limit(limit);

    // Fetch course details for announcements
    const announcementDetails = await Promise.all(
      (announcements || []).map(async (announcement: any) => {
        let courseData = null;
        if (announcement.course_id) {
          const courseRes = await supabase
            .from("courses")
            .select("title")
            .eq("id", announcement.course_id)
            .single();
          courseData = courseRes.data;
        }
        return {
          ...announcement,
          courses: courseData,
        };
      })
    );

    // Combine and format activities
    const activities: any[] = [];

    enrollmentDetails?.forEach((enrollment: any) => {
      activities.push({
        type: "enrollment",
        action: `New student enrolled`,
        detail: enrollment.profiles?.full_name || "Student",
        course: enrollment.courses?.title || "Course",
        time: new Date(enrollment.enrolled_at),
      });
    });

    materialDetails?.forEach((material: any) => {
      activities.push({
        type: "material",
        action: `Material uploaded`,
        detail: material.title,
        course: material.courses?.title || "Course",
        time: new Date(material.created_at),
      });
    });

    announcementDetails?.forEach((announcement: any) => {
      activities.push({
        type: "announcement",
        action: `Announcement published`,
        detail: announcement.title,
        course: announcement.is_global ? "Global" : announcement.courses?.title || "Course",
        time: new Date(announcement.created_at),
      });
    });

    // Sort by time and limit
    return activities
      .sort((a, b) => b.time.getTime() - a.time.getTime())
      .slice(0, limit)
      .map((activity) => ({
        ...activity,
        timeAgo: getTimeAgo(activity.time),
      }));
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    return [];
  }
}

/**
 * Helper function to format time ago
 */
function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds} seconds ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}

/**
 * Admin: Create a new blog post
 */
export async function createBlogPost(
  authorId: string,
  postData: CreateBlogPostInput
) {
  // Use supabaseAdmin if available to bypass RLS, otherwise use regular client
  const client = supabaseAdmin || supabase;
  
  const { data, error } = await client
    .from("blog_posts")
    .insert({
      title: postData.title,
      slug: postData.slug,
      excerpt: postData.excerpt || null,
      content: postData.content,
      category: postData.category || 'General',
      featured_image_url: postData.featured_image_url || null,
      attachment_url: postData.attachment_url || null,
      attachment_name: postData.attachment_name || null,
      author_id: authorId,
      published: postData.published || false,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating blog post:", error);
    throw error;
  }

  return data;
}

/**
 * Admin: Update a blog post
 */
export async function updateBlogPost(
  postId: string,
  postData: UpdateBlogPostInput
) {
  // Use supabaseAdmin if available to bypass RLS, otherwise use regular client
  const client = supabaseAdmin || supabase;
  
  const { data, error } = await client
    .from("blog_posts")
    .update(postData)
    .eq("id", postId)
    .select()
    .single();

  if (error) {
    console.error("Error updating blog post:", error);
    throw error;
  }

  return data;
}

/**
 * Admin: Delete a blog post
 */
export async function deleteBlogPost(postId: string) {
  // Use supabaseAdmin if available to bypass RLS, otherwise use regular client
  const client = supabaseAdmin || supabase;
  
  const { error } = await client
    .from("blog_posts")
    .delete()
    .eq("id", postId);

  if (error) {
    console.error("Error deleting blog post:", error);
    throw error;
  }
}

/**
 * Get all blog posts (admin can see all, including drafts)
 */
export async function getAllBlogPosts(includeDrafts: boolean = false): Promise<BlogPost[]> {
  let query = supabase
    .from("blog_posts")
    .select(`
      *,
      profiles:author_id(full_name)
    `)
    .order("created_at", { ascending: false });

  if (!includeDrafts) {
    query = query.eq("published", true);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }

  return data || [];
}

/**
 * Get a single blog post by slug
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select(`
      *,
      profiles:author_id(full_name)
    `)
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }

  return data;
}

/**
 * Get a single blog post by ID (admin only, includes drafts)
 */
export async function getBlogPostById(postId: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select(`
      *,
      profiles:author_id(full_name)
    `)
    .eq("id", postId)
    .single();

  if (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }

  return data;
}

