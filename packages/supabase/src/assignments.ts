import { supabase, supabaseAdmin } from "./client";
import type { Assignment, AssignmentSubmission, CreateAssignmentInput } from "./types";

/**
 * Get all assignments
 */
export async function getAllAssignments(level?: string): Promise<Assignment[]> {
    let query = supabase
        .from("assignments")
        .select(`
      *,
      profiles:instructor_id(full_name),
      assignment_departments(department_id)
    `)
        .order("created_at", { ascending: false });

    if (level && level !== 'All Levels') {
        query = query.eq("level", level);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching assignments:", error);
        return [];
    }

    return data || [];
}

/**
 * Get a single assignment by ID
 */
export async function getAssignmentById(id: string): Promise<Assignment | null> {
    const { data, error } = await supabase
        .from("assignments")
        .select(`
      *,
      profiles:instructor_id(full_name),
      assignment_departments(department_id)
    `)
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching assignment:", error);
        return null;
    }

    return data;
}

/**
 * Admin: Create a new assignment
 */
export async function createAssignment(
    instructorId: string,
    assignmentData: CreateAssignmentInput & { department_ids?: string[] }
) {
    const { data, error } = await supabase
        .from("assignments")
        .insert({
            title: assignmentData.title,
            description: assignmentData.description,
            course_code: assignmentData.course_code,
            level: assignmentData.level,
            due_date: assignmentData.due_date,
            max_score: assignmentData.max_score || 100,
            instructor_id: instructorId,
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating assignment:", error);
        throw error;
    }

    if (assignmentData.department_ids && assignmentData.department_ids.length > 0) {
        const junctionData = assignmentData.department_ids.map(dep_id => ({
            assignment_id: data.id,
            department_id: dep_id
        }));

        const { error: junctionError } = await supabase
            .from("assignment_departments")
            .insert(junctionData);

        if (junctionError) {
            console.error("Error creating assignment department links:", junctionError);
            throw junctionError;
        }
    }

    return data;
}

/**
 * Student: Submit an assignment
 */
export async function submitAssignment(
    assignmentId: string,
    studentId: string,
    fileData: { file_url: string; file_name: string; file_size: number; department_id?: string }
) {
    const { data, error } = await supabase
        .from("assignment_submissions")
        .insert({
            assignment_id: assignmentId,
            student_id: studentId,
            file_url: fileData.file_url,
            file_name: fileData.file_name,
            file_size: fileData.file_size,
            department_id: fileData.department_id,
        })
        .select()
        .single();

    if (error) {
        console.error("Error submitting assignment:", error);
        throw error;
    }

    return data;
}

/**
 * Admin: Get all submissions for an assignment
 */
export async function getAssignmentSubmissions(assignmentId: string): Promise<AssignmentSubmission[]> {
    const { data, error } = await supabase
        .from("assignment_submissions")
        .select(`
      *,
      profiles:student_id(full_name, matric_number)
    `)
        .eq("assignment_id", assignmentId)
        .order("submitted_at", { ascending: false });

    if (error) {
        console.error("Error fetching submissions:", error);
        return [];
    }

    return data || [];
}

/**
 * Admin: Grade a submission
 */
export async function gradeSubmission(
    submissionId: string,
    gradeData: { score: number; feedback: string }
) {
    const { data, error } = await supabase
        .from("assignment_submissions")
        .update({
            score: gradeData.score,
            feedback: gradeData.feedback,
        })
        .eq("id", submissionId)
        .select()
        .single();

    if (error) {
        console.error("Error grading submission:", error);
        throw error;
    }

    return data;
}

/**
 * Get student's submission for an assignment
 */
export async function getStudentSubmission(assignmentId: string, studentId: string): Promise<AssignmentSubmission | null> {
    const { data, error } = await supabase
        .from("assignment_submissions")
        .select("*")
        .eq("assignment_id", assignmentId)
        .eq("student_id", studentId)
        .maybeSingle();

    if (error) {
        console.error("Error fetching student submission:", error);
        return null;
    }

    return data;
}
/**
 * Get all submissions for a specific student (with assignment details)
 */
export async function getStudentSubmissions(studentId: string): Promise<AssignmentSubmission[]> {
    const { data, error } = await supabase
        .from("assignment_submissions")
        .select(`
            *,
            assignments:assignment_id(title, course_code, level, max_score)
        `)
        .eq("student_id", studentId)
        .order("submitted_at", { ascending: false });

    if (error) {
        console.error("Error fetching student submissions:", error);
        return [];
    }

    return data || [];
}
