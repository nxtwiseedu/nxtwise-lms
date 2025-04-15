"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileIcon,
  ExternalLink,
  Download,
  Calendar,
  CheckCircle,
  Github,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "next/navigation";
import { MOCK_PROJECTS } from "../../mock-data";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// This is a placeholder component for demo purposes
// In a real implementation, we would fetch the actual submission data from the API
const mockSubmission = {
  id: "submission-1",
  githubUrl: "https://github.com/student/awesome-project",
  videoUrl: "https://youtube.com/watch?v=demo-video",
  fileName: "project-files.zip",
  fileUrl: "#",
  submittedAt: new Date().toISOString(),
  comments:
    "I've implemented all the required features and added some extra functionality for a better user experience.",
};

export default function ProjectStatusPage() {
  const params = useParams();
  const projectId = params?.projectId as string;

  // Find the project in our mock data
  const project = MOCK_PROJECTS.find((p) => p.id === projectId);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

      {/* Status card */}
      <Card className="mb-8">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Submission Status</CardTitle>
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
              <CheckCircle size={14} className="mr-1" />
              Submitted
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <Calendar size={16} className="text-slate-400 mr-2" />
            <span className="text-sm text-slate-600">
              Submitted on {formatDate(mockSubmission.submittedAt)}
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
                  href={mockSubmission.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-white border border-l-0 border-slate-200 rounded-r-md py-2 px-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{mockSubmission.githubUrl}</span>
                    <ExternalLink
                      size={14}
                      className="flex-shrink-0 text-slate-400 ml-2"
                    />
                  </div>
                </a>
              </div>
            </div>

            {/* File upload */}
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-2">
                Uploaded File
              </h3>
              <div className="flex items-center">
                <div className="bg-slate-100 p-3 rounded-l-md">
                  <FileIcon size={20} className="text-slate-500" />
                </div>
                <div className="flex-1 border border-l-0 border-slate-200 rounded-r-md py-2 px-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 truncate">
                      {mockSubmission.fileName}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      asChild
                    >
                      <a href={mockSubmission.fileUrl}>
                        <Download size={14} className="text-slate-400" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Video URL (if available) */}
            {mockSubmission.videoUrl && (
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
                    href={mockSubmission.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-white border border-l-0 border-slate-200 rounded-r-md py-2 px-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">
                        {mockSubmission.videoUrl}
                      </span>
                      <ExternalLink
                        size={14}
                        className="flex-shrink-0 text-slate-400 ml-2"
                      />
                    </div>
                  </a>
                </div>
              </div>
            )}

            {/* Comments */}
            {mockSubmission.comments && (
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-2">
                  Your Comments
                </h3>
                <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                  <p className="text-sm text-slate-600">
                    {mockSubmission.comments}
                  </p>
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
