/**
 * Submission type definitions
 * These types define the structure of submission-related data in the system
 */

/**
 * FileInfo represents information about an uploaded file
 */
export interface FileInfo {
  name: string;
  type: string;
  size: number; // Size in bytes
  url: string;
}

/**
 * SubmissionStatus represents the status of a submission relative to its deadline
 */
export type SubmissionStatus = "onTime" | "late" | "notSubmitted";

/**
 * Feedback from instructors on a submission
 */
export interface Feedback {
  text: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Submission represents a student's project submission
 */
export interface Submission {
  id: string;
  projectId: string;
  userId: string;
  files: FileInfo[];
  githubLink: string;
  videoLink: string;
  comments: string;
  submittedAt: string; // ISO date string
  status: SubmissionStatus;
  feedback?: Feedback;
  grade?: number;
  resubmissionAllowed: boolean;
}

/**
 * SubmissionFormData represents the data collected in the submission form
 */
export interface SubmissionFormData {
  files: File[]; // Browser File objects for upload
  githubLink: string;
  videoLink: string;
  comments: string;
}

/**
 * SubmissionValidationErrors for form validation
 */
export interface SubmissionValidationErrors {
  files?: string;
  githubLink?: string;
  videoLink?: string;
  general?: string;
}
