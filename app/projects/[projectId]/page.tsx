"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "next/navigation";
import { MOCK_PROJECTS } from "../mock-data";

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params?.projectId as string;

  // Find the project in our mock data
  const project = MOCK_PROJECTS.find((p) => p.id === projectId);

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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back button */}
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

      {/* Main project info card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">
            {project.title}
          </h1>
          <p className="text-slate-600 mb-6">{project.description}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {project.toolsAndTechnologies.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
            <Button
              className="hover:opacity-90 transition-all"
              style={{ backgroundColor: "#004aad" }}
              asChild
            >
              <Link href={`/projects/${project.id}/submit`}>
                Submit Project
              </Link>
            </Button>

            <Button
              variant="outline"
              className="border-slate-200 inline-flex items-center"
              asChild
            >
              <Link href={project.projectBriefUrl} target="_blank">
                <Download size={16} className="mr-2" />
                Download Project Brief
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Project details grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Objectives */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">
              Objectives
            </h2>
            <ul className="space-y-2">
              {project.objectives.map((objective, index) => (
                <li key={index} className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-blue-50 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <span
                      className="text-xs font-medium"
                      style={{ color: "#004aad" }}
                    >
                      {index + 1}
                    </span>
                  </div>
                  <span className="text-slate-600">{objective}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Learning Outcomes */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">
              Learning Outcomes
            </h2>
            <ul className="space-y-2">
              {project.learningOutcomes.map((outcome, index) => (
                <li key={index} className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-green-50 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <span className="text-xs font-medium text-green-600">
                      {index + 1}
                    </span>
                  </div>
                  <span className="text-slate-600">{outcome}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Deliverables */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">
              Deliverables
            </h2>
            <ul className="space-y-2">
              {project.deliverables.map((deliverable, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="h-5 w-5 text-slate-400 mr-3 mt-0.5"
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
                  <span className="text-slate-600">{deliverable}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Submission Process */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">
              Submission Process
            </h2>
            <p className="text-slate-600 mb-4">{project.submissionProcess}</p>

            <h3 className="text-md font-medium text-slate-800 mb-2">
              Video Guidelines
            </h3>
            <p className="text-slate-600">{project.videoGuidelines}</p>
          </CardContent>
        </Card>
      </div>

      {/* Support Information */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-3">
            Support Information
          </h2>
          <p className="text-slate-600">{project.supportInfo}</p>
        </CardContent>
      </Card>

      {/* Submit button (bottom) */}
      <div className="mt-8 text-center">
        <Button
          className="px-6 py-2 hover:opacity-90 transition-all"
          style={{ backgroundColor: "#004aad" }}
          asChild
        >
          <Link href={`/projects/${project.id}/submit`}>Submit Project</Link>
        </Button>
      </div>
    </div>
  );
}
