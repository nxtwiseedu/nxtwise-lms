"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  Link as LinkIcon,
  AlertCircle,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useParams, useRouter } from "next/navigation";
import { MOCK_PROJECTS } from "../../mock-data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ProjectSubmissionPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.projectId as string;

  // Find the project in our mock data
  const project = MOCK_PROJECTS.find((p) => p.id === projectId);

  // Form state
  const [githubUrl, setGithubUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [comments, setComments] = useState("");
  const [fileSelected, setFileSelected] = useState(false);
  const [fileName, setFileName] = useState("");
  const [formErrors, setFormErrors] = useState<{
    githubUrl?: string;
    file?: string;
    videoUrl?: string;
  }>({});

  // Dialog state
  const [showDialog, setShowDialog] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileSelected(true);
      setFileName(e.target.files[0].name);

      // Clear any file error
      setFormErrors((prev) => ({ ...prev, file: undefined }));
    } else {
      setFileSelected(false);
      setFileName("");
    }
  };

  // Validate form
  const validateForm = () => {
    const errors: {
      githubUrl?: string;
      file?: string;
      videoUrl?: string;
    } = {};

    // Check GitHub URL
    if (!githubUrl.trim()) {
      errors.githubUrl = "GitHub repository URL is required";
    } else if (
      !githubUrl.startsWith("https://github.com/") &&
      !githubUrl.startsWith("http://github.com/")
    ) {
      errors.githubUrl = "Please enter a valid GitHub URL";
    }

    // Check if file is selected
    if (!fileSelected) {
      errors.file = "Please upload your project file";
    }

    // Check video URL if it's required
    if (
      project?.videoGuidelines !== "Not required for this project." &&
      !videoUrl.trim()
    ) {
      errors.videoUrl = "Video demonstration URL is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Open confirmation dialog
      setShowDialog(true);
    }
  };

  // Confirm submission
  const confirmSubmission = () => {
    // Here we would typically make an API call to submit the project
    // For now, just simulate a successful submission

    setSubmissionSuccess(true);

    // Close dialog after a delay and redirect to status page
    setTimeout(() => {
      setShowDialog(false);
      router.push(`/projects/${projectId}/status`);
    }, 2000);
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
            <AlertCircle size={32} className="text-slate-400" />
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
          Submit Project
        </h1>
        <p className="text-slate-600">{project.title}</p>
      </div>

      {/* Submission guidelines */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Submission Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 mb-4">{project.submissionProcess}</p>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="font-medium text-slate-800 mb-2">
              Deliverables Required
            </h3>
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
          </div>

          {project.videoGuidelines &&
            project.videoGuidelines !== "Not required for this project." && (
              <div className="mt-4">
                <h3 className="font-medium text-slate-800 mb-2">
                  Video Guidelines
                </h3>
                <p className="text-slate-600">{project.videoGuidelines}</p>
              </div>
            )}
        </CardContent>
      </Card>

      {/* Submission form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="p-6">
            {/* GitHub URL field */}
            <div className="mb-6">
              <Label htmlFor="github-url" className="block mb-2">
                GitHub Repository URL <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <LinkIcon
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                />
                <Input
                  id="github-url"
                  placeholder="https://github.com/username/repository"
                  className={`pl-10 ${
                    formErrors.githubUrl ? "border-red-300" : "border-slate-200"
                  }`}
                  value={githubUrl}
                  onChange={(e) => {
                    setGithubUrl(e.target.value);
                    if (formErrors.githubUrl) {
                      setFormErrors((prev) => ({
                        ...prev,
                        githubUrl: undefined,
                      }));
                    }
                  }}
                />
              </div>
              {formErrors.githubUrl && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.githubUrl}
                </p>
              )}
              <p className="text-slate-500 text-sm mt-1">
                Enter the URL to your GitHub repository containing your project
                code.
              </p>
            </div>

            {/* File upload field */}
            <div className="mb-6">
              <Label htmlFor="project-file" className="block mb-2">
                Upload Project Files <span className="text-red-500">*</span>
              </Label>
              <div className="grid gap-2">
                <Label
                  htmlFor="project-file"
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-slate-50 transition-colors ${
                    formErrors.file
                      ? "border-red-300 bg-red-50"
                      : "border-slate-200"
                  } ${fileSelected ? "bg-blue-50 border-blue-200" : ""}`}
                >
                  {fileSelected ? (
                    <div className="flex flex-col items-center justify-center py-6">
                      <Check size={24} className="text-green-500 mb-2" />
                      <p className="text-sm font-medium text-slate-700">
                        {fileName}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Click to change file
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6">
                      <Upload size={24} className="text-slate-400 mb-2" />
                      <p className="text-sm font-medium text-slate-700">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        ZIP, PDF, or other project files (max. 50MB)
                      </p>
                    </div>
                  )}
                </Label>
                <input
                  id="project-file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              {formErrors.file && (
                <p className="text-red-500 text-sm mt-1">{formErrors.file}</p>
              )}
            </div>

            {/* Video URL field */}
            {project.videoGuidelines &&
              project.videoGuidelines !== "Not required for this project." && (
                <div className="mb-6">
                  <Label htmlFor="video-url" className="block mb-2">
                    Video Demonstration URL{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <LinkIcon
                      size={18}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                    />
                    <Input
                      id="video-url"
                      placeholder="https://youtube.com/watch?v=example"
                      className={`pl-10 ${
                        formErrors.videoUrl
                          ? "border-red-300"
                          : "border-slate-200"
                      }`}
                      value={videoUrl}
                      onChange={(e) => {
                        setVideoUrl(e.target.value);
                        if (formErrors.videoUrl) {
                          setFormErrors((prev) => ({
                            ...prev,
                            videoUrl: undefined,
                          }));
                        }
                      }}
                    />
                  </div>
                  {formErrors.videoUrl && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.videoUrl}
                    </p>
                  )}
                  <p className="text-slate-500 text-sm mt-1">
                    Share a link to your video demonstration on YouTube, Vimeo,
                    or other platforms.
                  </p>
                </div>
              )}

            {/* Comments field */}
            <div className="mb-6">
              <Label htmlFor="comments" className="block mb-2">
                Additional Comments
              </Label>
              <Textarea
                id="comments"
                placeholder="Add any notes or comments about your submission..."
                rows={4}
                className="border-slate-200 resize-none"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
              <p className="text-slate-500 text-sm mt-1">
                Optional: Share any additional information or context about your
                project.
              </p>
            </div>

            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Before submitting</AlertTitle>
              <AlertDescription>
                Make sure your submission includes all required deliverables and
                follows the project guidelines.
              </AlertDescription>
            </Alert>

            {/* Submit button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                className="px-6 py-2 hover:opacity-90 transition-all"
                style={{ backgroundColor: "#004aad" }}
              >
                Submit Project
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Confirmation Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Submission</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit your project? You can only submit
              once, so make sure your work is complete.
            </DialogDescription>
          </DialogHeader>

          {submissionSuccess ? (
            <div className="flex flex-col items-center py-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                <Check size={32} className="text-green-500" />
              </div>
              <h3 className="text-lg font-medium text-slate-800 mb-2">
                Submission Successful!
              </h3>
              <p className="text-slate-600 text-center">
                Your project has been submitted successfully. Redirecting to the
                status page...
              </p>
            </div>
          ) : (
            <div className="py-4">
              <h3 className="font-medium text-slate-800">Submission Details</h3>
              <ul className="mt-2 space-y-2">
                <li className="text-sm text-slate-600">
                  <span className="font-medium">GitHub URL:</span> {githubUrl}
                </li>
                {videoUrl && (
                  <li className="text-sm text-slate-600">
                    <span className="font-medium">Video URL:</span> {videoUrl}
                  </li>
                )}
                <li className="text-sm text-slate-600">
                  <span className="font-medium">File:</span> {fileName}
                </li>
              </ul>

              <DialogFooter className="mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowDialog(false)}
                  className="border-slate-200"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmSubmission}
                  className="hover:opacity-90 transition-all"
                  style={{ backgroundColor: "#004aad" }}
                >
                  Confirm Submission
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
