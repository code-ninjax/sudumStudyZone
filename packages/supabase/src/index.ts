// Supabase client
export { supabase, supabaseAdmin } from "./client";

// Helper functions
export {
  isAdmin,
  getCurrentUserProfile,
  getAllStudents,
  getAllCourses,
  getCourseBySlug,
  getStudentEnrolledCourses,
  isEnrolledInCourse,
  getCourseMaterials,
  getCourseAnnouncements,
  getEnrollmentDetails,
} from "./helpers";

// Admin functions
export {
  createCourse,
  updateCourse,
  deleteCourse,
  enrollStudent,
  unenrollStudent,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getCourseEnrollments,
  bulkEnrollStudents,
  getAdminStatistics,
  getNewlyEnrolledStudents,
  getRecentEnrollments,
  getRecentActivities,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getAllBlogPosts,
  getBlogPostBySlug,
  getBlogPostById,
} from "./admin";

// Storage functions
export {
  uploadMaterial,
  deleteMaterialFile,
  getMaterialUrl,
  getSignedUrl,
  listMaterialFiles,
  downloadMaterial,
  STORAGE_BUCKETS,
} from "./storage";

// Types
export type {
  Profile,
  Course,
  Enrollment,
  Material,
  MaterialType,
  Announcement,
  CreateCourseInput,
  UpdateCourseInput,
  CreateMaterialInput,
  UpdateMaterialInput,
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
  BlogPost,
  CreateBlogPostInput,
  UpdateBlogPostInput,
} from "./types";

