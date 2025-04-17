/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileIcon,
  ExternalLink,
  Download,
  Calendar,
  CheckCircle,
  Github,
  Clock,
  FileCode,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Firebase imports
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { getCurrentUser } from "@/app/lib/client";
import { getProjectById } from "../../services/project-service";
import { Project } from "../../types/project";

interface Submission {
  id: string;
  userId: string;
  projectId: string;
  githubUrl: string;
  driveUrl: string;
  videoUrl?: string;
  comments?: string;
  submittedAt: string;
  status: "submitted" | "reviewed" | "returned" | "resubmitted";
  feedback?: string;
  resubmissionAllowed?: boolean;
  returnedAt?: string;
  resubmittedAt?: string;
  previousVersionId?: string;
  grade?: number;
}

export default function ProjectStatusPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.projectId as string;

  // State variables
  const [project, setProject] = useState<Project | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch project and submission data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Get the current user
        const currentUser = getCurrentUser();
        if (!currentUser) {
          setError("You must be logged in to view submission status");
          setLoading(false);
          return;
        }

        // Fetch the project
        const projectData = await getProjectById(projectId);
        setProject(projectData);

        if (!projectData) {
          setLoading(false);
          return;
        }

        // Fetch the user's submission for this project
        const submissionsRef = collection(db, "submissions");
        const submissionQuery = query(
          submissionsRef,
          where("userId", "==", currentUser.uid),
          where("projectId", "==", projectId)
        );

        const submissionSnapshot = await getDocs(submissionQuery);

        if (submissionSnapshot.empty) {
          // No submission found
          setLoading(false);
          return;
        }

        // Get the first (and should be only) submission
        const submissionDoc = submissionSnapshot.docs[0];
        setSubmission({
          id: submissionDoc.id,
          ...submissionDoc.data(),
        } as Submission);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          "Failed to load project or submission data. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchData();
    }
  }, [projectId]);

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "Invalid date";
    }
  };

  // Handle resubmission
  const handleResubmit = () => {
    router.push(`/projects/${projectId}/submit?resubmit=true`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-4xl flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div
            className="w-16 h-16 border-4 border-t-indigo-600 border-r-indigo-300 border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"
            style={{ borderTopColor: "#004aad" }}
          ></div>
          <p className="mt-4 text-slate-700 font-medium">
            Loading submission status...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="mb-6">
          <Link
            href="/projects"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
            style={{ color: "#004aad" }}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to projects
          </Link>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-slate-100">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10 text-red-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            Something went wrong
          </h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <Button
            className="hover:opacity-90 transition-all"
            style={{ backgroundColor: "#004aad" }}
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Handle case where project is not found
  if (!project) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="mb-6">
          <Link
            href="/projects"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
            style={{ color: "#004aad" }}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to projects
          </Link>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-slate-100">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10 text-slate-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            Project not found
          </h2>
          <p className="text-slate-600 mb-6">
            The project you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Button
            className="hover:opacity-90 transition-all"
            style={{ backgroundColor: "#004aad" }}
            asChild
          >
            <Link href="/projects">Return to Projects</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Handle case where no submission is found
  if (!submission) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6">
          <Link
            href={`/projects/${projectId}`}
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
            style={{ color: "#004aad" }}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to project details
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Submission Status
          </h1>
          <p className="text-slate-600">{project.title}</p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-slate-100 mb-8">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock size={28} className="text-slate-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            No Submission Found
          </h2>
          <p className="text-slate-600 mb-6">
            You haven&apos;t submitted this project yet. Complete your work and
            submit it to see your status here.
          </p>
          <Button
            className="hover:opacity-90 transition-all"
            style={{ backgroundColor: "#004aad" }}
            asChild
          >
            <Link href={`/projects/${projectId}/submit`}>Submit Project</Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="font-semibold text-lg text-slate-800 mb-2">
              {project.title}
            </h2>
            <p className="text-slate-600 mb-4">{project.description}</p>

            <h3 className="text-sm font-medium text-slate-700 mb-2">
              Deliverables
            </h3>
            <ul className="space-y-2 mb-4">
              {project.deliverables.map((deliverable, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="h-5 w-5 text-slate-400 mr-2 mt-0.5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm text-slate-600">{deliverable}</span>
                </li>
              ))}
            </ul>

            <div className="flex justify-center mt-6">
              <Button variant="outline" className="border-slate-200" asChild>
                <Link href={`/projects/${projectId}`}>
                  View Complete Project Details
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Status badge configurations
  const statusConfig = {
    submitted: {
      color: "bg-blue-100 text-blue-700 hover:bg-blue-100",
      icon: CheckCircle,
      label: "Submitted",
    },
    reviewed: {
      color: "bg-green-100 text-green-700 hover:bg-green-100",
      icon: CheckCircle,
      label: "Reviewed",
    },
    returned: {
      color: "bg-amber-100 text-amber-700 hover:bg-amber-100",
      icon: AlertTriangle,
      label: "Returned for Resubmission",
    },
    resubmitted: {
      color: "bg-purple-100 text-purple-700 hover:bg-purple-100",
      icon: RefreshCw,
      label: "Resubmitted",
    },
  };

  const StatusIcon = statusConfig[submission.status].icon;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href={`/projects/${projectId}`}
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          style={{ color: "#004aad" }}
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to project details
        </Link>
      </div>

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Submission Status
        </h1>
        <p className="text-slate-600">{project.title}</p>
      </div>

      {/* Resubmission alert */}
      {submission.status === "returned" && submission.resubmissionAllowed && (
        <Alert className="mb-6 border-amber-200 bg-amber-50" variant="default">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">
            Action Required: Resubmission Requested
          </AlertTitle>
          <AlertDescription className="text-amber-700">
            Your instructor has requested that you resubmit this project. Please
            review the feedback below and make the necessary changes before
            resubmitting.
          </AlertDescription>
          <div className="mt-4">
            <Button
              className="hover:opacity-90 transition-all"
              style={{ backgroundColor: "#004aad" }}
              onClick={handleResubmit}
            >
              Resubmit Project
            </Button>
          </div>
        </Alert>
      )}

      {/* Status card */}
      <Card className="mb-8">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Submission Status</CardTitle>
            <Badge className={statusConfig[submission.status].color}>
              <StatusIcon size={14} className="mr-1" />
              {statusConfig[submission.status].label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <Calendar size={16} className="text-slate-400 mr-2" />
            <span className="text-sm text-slate-600">
              Submitted on {formatDate(submission.submittedAt)}
              {submission.resubmittedAt && (
                <span className="ml-1">
                  (Resubmitted on {formatDate(submission.resubmittedAt)})
                </span>
              )}
            </span>
          </div>

          <Separator className="my-4" />

          <div className="space-y-6">
            {/* GitHub URL */}
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-2">
                GitHub Repository
              </h3>
              <div className="flex items-center">
                <div className="bg-slate-100 p-3 rounded-l-md">
                  <Github size={20} className="text-slate-500" />
                </div>
                <a
                  href={submission.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-white border border-l-0 border-slate-200 rounded-r-md py-2 px-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors break-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{submission.githubUrl}</span>
                    <ExternalLink
                      size={14}
                      className="flex-shrink-0 text-slate-400 ml-2"
                    />
                  </div>
                </a>
              </div>
            </div>

            {/* Google Drive Link */}
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-2">
                Google Drive Link
              </h3>
              <div className="flex items-center">
                <div className="bg-slate-100 p-3 rounded-l-md">
                  <FileCode size={20} className="text-slate-500" />
                </div>
                <a
                  href={submission.driveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-white border border-l-0 border-slate-200 rounded-r-md py-2 px-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors break-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{submission.driveUrl}</span>
                    <ExternalLink
                      size={14}
                      className="flex-shrink-0 text-slate-400 ml-2"
                    />
                  </div>
                </a>
              </div>
            </div>

            {/* Video URL (if available) */}
            {submission.videoUrl && (
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-2">
                  Video Demonstration
                </h3>
                <div className="flex items-center">
                  <div className="bg-slate-100 p-3 rounded-l-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-slate-500"
                    >
                      <polygon points="23 7 16 12 23 17 23 7"></polygon>
                      <rect
                        x="1"
                        y="5"
                        width="15"
                        height="14"
                        rx="2"
                        ry="2"
                      ></rect>
                    </svg>
                  </div>
                  <a
                    href={submission.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-white border border-l-0 border-slate-200 rounded-r-md py-2 px-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors break-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{submission.videoUrl}</span>
                      <ExternalLink
                        size={14}
                        className="flex-shrink-0 text-slate-400 ml-2"
                      />
                    </div>
                  </a>
                </div>
              </div>
            )}

            {/* Student Comments */}
            {submission.comments && (
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-2">
                  Your Comments
                </h3>
                <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                  <p className="text-sm text-slate-600">
                    {submission.comments}
                  </p>
                </div>
              </div>
            )}

            {/* Instructor Feedback */}
            {submission.feedback && (
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-2">
                  Instructor Feedback
                </h3>
                <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                  <p className="text-sm text-slate-700">
                    {submission.feedback}
                  </p>

                  {submission.grade !== undefined && (
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <span className="font-medium text-slate-700">
                        Grade:{" "}
                      </span>
                      <span className="font-bold">{submission.grade}%</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Project details summary */}
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="font-semibold text-lg text-slate-800 mb-2">
            {project.title}
          </h2>
          <p className="text-slate-600 mb-4">{project.description}</p>

          <h3 className="text-sm font-medium text-slate-700 mb-2">
            Deliverables
          </h3>
          <ul className="space-y-2 mb-4">
            {project.deliverables.map((deliverable, index) => (
              <li key={index} className="flex items-start">
                <svg
                  className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm text-slate-600">{deliverable}</span>
              </li>
            ))}
          </ul>

          <div className="flex justify-center mt-6">
            <Button variant="outline" className="border-slate-200" asChild>
              <Link href={`/projects/${projectId}`}>
                View Complete Project Details
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
