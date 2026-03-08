export type StudentResource = {
  id: string
  title: string
  courseCode: string
  department: string
  faculty: string
  level: string
  year: string
  format: string
  pages: number
  summary: string
  tags: string[]
}

export const pastQuestions: StudentResource[] = [
  {
    id: 'pq-csc-101',
    title: 'Introduction to Computing Past Questions',
    courseCode: 'CSC 101',
    department: 'Computer Science',
    faculty: 'Science',
    level: '100L',
    year: '2024',
    format: 'PDF',
    pages: 24,
    summary: 'Core objective and theory questions covering computing history, hardware, and software basics.',
    tags: ['theory', 'cbt', 'freshers'],
  },
  {
    id: 'pq-mth-201',
    title: 'Advanced Calculus Revision Pack',
    courseCode: 'MTH 201',
    department: 'Mathematics',
    faculty: 'Science',
    level: '200L',
    year: '2023',
    format: 'PDF',
    pages: 31,
    summary: 'Worked past questions on differentiation, integration, and multivariable applications.',
    tags: ['calculus', 'worked examples'],
  },
  {
    id: 'pq-csc-305',
    title: 'Database Systems Examination Archive',
    courseCode: 'CSC 305',
    department: 'Computer Science',
    faculty: 'Science',
    level: '300L',
    year: '2022',
    format: 'PDF',
    pages: 28,
    summary: 'Past papers focused on normalization, SQL queries, and transaction concepts.',
    tags: ['sql', 'database'],
  },
  {
    id: 'pq-acc-401',
    title: 'Auditing and Assurance Past Questions',
    courseCode: 'ACC 401',
    department: 'Accounting',
    faculty: 'Management Science',
    level: '400L',
    year: '2024',
    format: 'PDF',
    pages: 19,
    summary: 'Essay and objective question bank for audit standards, control tests, and reporting.',
    tags: ['audit', 'essay'],
  },
]

export const markingSchemes: StudentResource[] = [
  {
    id: 'ms-csc-101',
    title: 'CSC 101 Lecturer Marking Guide',
    courseCode: 'CSC 101',
    department: 'Computer Science',
    faculty: 'Science',
    level: '100L',
    year: '2024',
    format: 'Guide',
    pages: 10,
    summary: 'Breakdown of expected keywords, mark allocation, and answer structure for entry-level computing exams.',
    tags: ['rubric', 'keywords'],
  },
  {
    id: 'ms-mth-201',
    title: 'MTH 201 Solution Marking Scheme',
    courseCode: 'MTH 201',
    department: 'Mathematics',
    faculty: 'Science',
    level: '200L',
    year: '2023',
    format: 'Guide',
    pages: 12,
    summary: 'Step-based marking template showing how scores are awarded across derivations and final answers.',
    tags: ['solutions', 'step marking'],
  },
  {
    id: 'ms-csc-305',
    title: 'CSC 305 Database Answer Guide',
    courseCode: 'CSC 305',
    department: 'Computer Science',
    faculty: 'Science',
    level: '300L',
    year: '2022',
    format: 'Guide',
    pages: 14,
    summary: 'Expected schema design, query logic, and theory grading weights for the database exam.',
    tags: ['sql', 'schema'],
  },
  {
    id: 'ms-acc-401',
    title: 'ACC 401 Audit Mark Allocation',
    courseCode: 'ACC 401',
    department: 'Accounting',
    faculty: 'Management Science',
    level: '400L',
    year: '2024',
    format: 'Guide',
    pages: 9,
    summary: 'Lecturer marking notes for case analysis, professional judgment, and standard references.',
    tags: ['case study', 'rubric'],
  },
]

export function filterResourcesByProfileLevel<T extends StudentResource>(
  resources: T[],
  level?: string | null
) {
  if (!level) {
    return resources
  }

  return resources.filter((resource) => resource.level === level)
}
