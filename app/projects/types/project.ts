/**
 * Project type definitions with hierarchical structure
 */

/**
 * ProjectCategory represents a main project/category that contains multiple sub-projects
 */
export interface ProjectCategory {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  order: number; // For controlling display order
}

/**
 * Project (sub-project) type representing an individual project in the LMS
 */
export interface Project {
  id: string;
  categoryId: string; // Reference to parent category
  title: string;
  description: string;
  objectives: string[];
  learningOutcomes: string[];
  deliverables: string[];
  toolsAndTechnologies: string[];
  deadline: string; // ISO date string
  submissionProcess: string;
  supportInfo: string;
  projectBriefUrl: string;
  videoGuidelines: string;
  createdAt: string;
  updatedAt: string;
  order: number; // For controlling display order within a category
}

/**
 * ProjectStatus represents the current status of a project for a student
 */
export type ProjectStatus = "notStarted" | "inProgress" | "submitted";

/**
 * ProjectWithStatus extends Project to include student-specific status information
 */
export interface ProjectWithStatus extends Project {
  status: ProjectStatus;
  daysRemaining: number; // Calculated field - days until deadline
}

/**
 * ProjectCategoryWithProjects includes the category and its child projects
 */
export interface ProjectCategoryWithProjects extends ProjectCategory {
  projects: ProjectWithStatus[];
}

/**
 * UserProject represents the assignment of a project to a user
 */
export interface UserProject {
  id: string;
  userId: string;
  projectId: string;
  assignedAt: string;
}

/**
 * ProjectFilterOptions for filtering the project list
 */
export interface ProjectFilterOptions {
  status?: ProjectStatus;
  categoryId?: string;
  sortBy: "deadline" | "title" | "status";
  sortDirection: "asc" | "desc";
}
