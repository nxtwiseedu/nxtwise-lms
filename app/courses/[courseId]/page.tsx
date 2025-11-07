"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Check,
  Clock,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Menu,
  X,
  Lock,
  Paperclip,
  Download,
  // FileText,
  // Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCourseLogic } from "./CourseLogic";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Module } from "@/app/courses/types/types"; // Adjust the import path as necessary
import VideoPlayer from "./VideoPlayer"; // Import the VideoPlayer component

export default function CourseView() {
  const {
    course,
    loading,
    currentModule,
    currentSection,
    overallProgress,
    currentSectionData,
    toggleModule,
    changeSection,
    markAsComplete,
    goToNextSection,
    goToPrevSection,
    getSectionDuration,
    formatDuration,
  } = useCourseLogic();
  const [currentVideoId, setCurrentVideoId] = useState<string>("");
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [videoPlayerOpen, setVideoPlayerOpen] = useState(false); // New state for video player

  // Function to check if a section is accessible
  const isSectionAccessible = (
    moduleIndex: number,
    sectionIndex: number
  ): boolean => {
    if (!course) return false;

    // First section of first module is always accessible
    if (moduleIndex === 0 && sectionIndex === 0) return true;

    // If it's not the first section in a module, check if previous section is completed
    if (sectionIndex > 0) {
      const prevSection =
        course.modules[moduleIndex].sections[sectionIndex - 1];
      return prevSection.completed;
    }

    // If it's the first section of a non-first module, check if last section of previous module is completed
    if (sectionIndex === 0 && moduleIndex > 0) {
      const prevModule = course.modules[moduleIndex - 1];
      const lastSectionOfPrevModule =
        prevModule.sections[prevModule.sections.length - 1];
      return lastSectionOfPrevModule.completed;
    }

    return false;
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <div
            className="w-16 h-16 border-4 border-t-indigo-600 border-r-indigo-300 border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"
            style={{ borderTopColor: "#004aad" }}
          ></div>
          <p className="mt-4 text-slate-700 font-medium">
            Loading your course...
          </p>
        </div>
      </div>
    );
  }

  // Course not found state
  if (!course) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md mx-4">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen size={32} style={{ color: "#004aad" }} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Course Not Found
          </h2>
          <p className="text-slate-600 mb-8">
            The course you&apos;re looking for doesn&apos;t exist or you
            don&apos;t have access to it.
          </p>
          <Link href="/courses">
            <Button
              className="hover:opacity-90 transition-all w-full"
              style={{ backgroundColor: "#004aad" }}
            >
              Browse Available Courses
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Module section component
  interface ModuleSectionProps {
    module: Module;
    moduleIndex: number;
  }

  const ModuleSection = ({ module, moduleIndex }: ModuleSectionProps) => {
    return (
      <div className="mb-2" key={module.id}>
        <button
          onClick={() => toggleModule(module.id)}
          className={cn(
            "flex items-center justify-between w-full rounded-lg p-3 text-left font-medium transition-all",
            module.id === currentModule
              ? "bg-indigo-100 text-indigo-700"
              : "hover:bg-slate-100 text-slate-800"
          )}
          style={
            module.id === currentModule
              ? { backgroundColor: "#cce0ff", color: "#004aad" }
              : {}
          }
        >
          <div className="flex items-center">
            <div
              className={cn(
                "w-7 h-7 rounded-lg flex items-center justify-center mr-3",
                module.id === currentModule
                  ? "bg-indigo-200 text-indigo-700"
                  : "bg-slate-100 text-slate-600"
              )}
              style={
                module.id === currentModule
                  ? { backgroundColor: "#99c2ff", color: "#004aad" }
                  : {}
              }
            >
              <span className="text-sm font-semibold">{module.order + 1}</span>
            </div>
            <span className="font-medium text-sm">{module.moduleName}</span>
          </div>
          <div className="flex items-center">
            {module.expanded ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </div>
        </button>

        <AnimatePresence>
          {module.expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div
                className="pl-8 pr-2 pt-1 pb-1 space-y-1"
                key={`sections-${module.id}`}
              >
                {module.sections.map((section, sectionIndex) => {
                  const accessible = isSectionAccessible(
                    moduleIndex,
                    sectionIndex
                  );

                  return (
                    <button
                      key={section.id}
                      onClick={() => {
                        if (accessible) {
                          changeSection(module.id, section.id);
                          setShowMobileNav(false);
                        }
                      }}
                      disabled={!accessible}
                      className={cn(
                        "flex items-center w-full p-2 rounded-lg text-xs text-left transition-all",
                        !accessible
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : currentSection === section.id
                          ? "bg-indigo-50 text-indigo-700 font-medium"
                          : section.completed
                          ? "text-emerald-600 hover:bg-emerald-50"
                          : "text-slate-700 hover:bg-slate-50"
                      )}
                      style={
                        accessible && currentSection === section.id
                          ? { backgroundColor: "#e6f0ff", color: "#004aad" }
                          : {}
                      }
                    >
                      <div className="mr-2 flex-shrink-0">
                        {!accessible ? (
                          <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center">
                            <Lock size={10} className="text-slate-500" />
                          </div>
                        ) : section.completed ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                            <Check size={12} className="text-emerald-600" />
                          </div>
                        ) : currentSection === section.id ? (
                          <div
                            className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center"
                            style={{ backgroundColor: "#cce0ff" }}
                          >
                            <Play
                              size={12}
                              style={{ color: "#004aad" }}
                              className="ml-0.5"
                            />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-slate-200 flex items-center justify-center">
                            <span className="text-xs font-medium">
                              {section.order + 1}
                            </span>
                          </div>
                        )}
                      </div>
                      <span
                        className={cn(
                          "flex-1 truncate",
                          !accessible && "text-slate-400"
                        )}
                      >
                        {section.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // Sidebar content component to reuse in both desktop and mobile views
  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b border-slate-100">
        <Link
          href="/courses"
          className="flex items-center text-xs text-slate-600 mb-3 hover:text-indigo-600 transition-colors hover:text-[#004aad]"
        >
          <ChevronLeft size={14} className="mr-1" />
          Back to All Courses
        </Link>
        <h1 className="text-base font-bold text-slate-900 mb-3">
          {course.mainTitle}
        </h1>
        <div className="mt-2">
          <div className="flex justify-between text-xs font-medium mb-1.5">
            <span className="text-slate-700">Your Progress</span>
            <span
              className="text-indigo-600 font-semibold"
              style={{ color: "#004aad" }}
            >
              {Math.round(overallProgress)}%
            </span>
          </div>
          <Progress value={overallProgress} className="h-2 bg-slate-100" />
        </div>
      </div>

      <ScrollArea className="flex-grow py-2 px-3" key="course-modules-scroll">
        {course.modules.map((module, moduleIndex) => (
          <ModuleSection
            key={module.id}
            module={module}
            moduleIndex={moduleIndex}
          />
        ))}
      </ScrollArea>
    </div>
  );

  // Find current indices for navigation button logic
  const currentModuleIndex =
    course?.modules.findIndex((m) => m.id === currentModule) ?? -1;
  const currentModuleObj =
    currentModuleIndex >= 0 ? course.modules[currentModuleIndex] : null;
  const currentSectionIndex =
    currentModuleObj?.sections.findIndex((s) => s.id === currentSection) ?? -1;

  // Check if there is a next section available
  const hasNextSection =
    currentModuleIndex >= 0 &&
    currentSectionIndex >= 0 &&
    (currentSectionIndex < (currentModuleObj?.sections.length ?? 0) - 1 ||
      currentModuleIndex < (course?.modules.length ?? 0) - 1);

  // Next button should be disabled if current section is not completed
  const nextButtonDisabled = !currentSectionData?.completed || !hasNextSection;

  // Watch video function - Updated to open the in-page player
  const watchVideo = (videoId?: string) => {
    // If specific videoId is provided, use it; otherwise use default from section
    const videoToPlay =
      videoId ||
      currentSectionData?.videoId ||
      (currentSectionData?.videos && currentSectionData.videos.length > 0
        ? currentSectionData.videos[0].id
        : "");

    if (videoToPlay) {
      // Set the video ID to play
      setCurrentVideoId(videoToPlay);
      setVideoPlayerOpen(true);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-screen  lg:w-auto h-screen bg-slate-50 overflow-hidden">
      {/* Video Player */}
      {currentSectionData &&
        (currentSectionData.videoId ||
          (currentSectionData.videos &&
            currentSectionData.videos.length > 0)) && (
          <VideoPlayer
            videoId={currentVideoId}
            isOpen={videoPlayerOpen}
            onClose={() => setVideoPlayerOpen(false)}
          />
        )}

      {/* Course Sidebar - Hidden on Mobile, Visible on Desktop */}
      <div className="hidden lg:block w-72 border-r border-slate-200 h-full bg-white overflow-hidden">
        <SidebarContent />
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shadow-sm">
        <Drawer open={showMobileNav} onOpenChange={setShowMobileNav}>
          <DrawerTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu size={20} />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-[80vh] rounded-t-xl pt-4">
            <div className="absolute right-4 top-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMobileNav(false)}
              >
                <X size={16} />
              </Button>
            </div>
            <div className="px-4 pb-8 h-full overflow-auto">
              <SidebarContent />
            </div>
          </DrawerContent>
        </Drawer>

        <div className="flex-1 ml-2">
          <h2 className="font-bold text-slate-900 truncate text-sm">
            {course.mainTitle}
          </h2>
          <div className="flex items-center text-xs text-slate-500 mt-0.5">
            <Clock size={10} className="mr-1" />
            <span className="mr-2">
              {Math.round(overallProgress)}% complete
            </span>
          </div>
        </div>

        <div className="flex items-center">
          <Badge
            variant="outline"
            className="bg-slate-50 text-slate-700 border-slate-200 text-xs"
          >
            {course.totalSections} lessons
          </Badge>
        </div>
      </div>

      {/* Content Area */}
      <main className="flex-1 flex flex-col bg-white lg:rounded-lg lg:m-4 lg:shadow-sm overflow-hidden">
        {currentSectionData ? (
          <div className="flex flex-col flex-1">
            {/* Header Area with Video Link */}
            <div className="bg-slate-900 flex items-center px-6 py-5">
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg md:text-xl">
                  {currentSectionData.title}
                </h3>
                <p className="text-slate-300 text-xs mt-1">
                  {
                    course.modules.find((m) => m.id === currentModule)
                      ?.moduleName
                  }{" "}
                  • Lesson {currentSectionData.order + 1}
                </p>
              </div>

              {/* 
              {(currentSectionData?.videoId ||
                (currentSectionData?.videos &&
                  currentSectionData.videos.length > 0)) && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="text-xs md:text-sm flex items-center whitespace-nowrap"
                  onClick={watchVideo}
                >
                  <Play size={14} className="mr-1.5" />
                  {currentSectionData.videos &&
                  currentSectionData.videos.length > 1
                    ? `Watch Videos (${currentSectionData.videos.length})`
                    : "Watch Video"}
                </Button>
              )} */}
            </div>

            {/* Section Content */}
            <div className="p-4 md:p-6 overflow-auto flex-1">
              <div className="max-w-full">
                <div className="flex items-center mb-4">
                  <Badge
                    className={cn(
                      "mr-3",
                      currentSectionData.completed
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                        : "bg-amber-50 text-amber-600 border-amber-200"
                    )}
                  >
                    {currentSectionData.completed ? "Completed" : "In Progress"}
                  </Badge>
                  <div className="flex items-center text-xs text-slate-500">
                    <Clock size={12} className="mr-1.5" />
                    <span>
                      {currentSectionData &&
                      getSectionDuration(currentSectionData) > 0
                        ? formatDuration(getSectionDuration(currentSectionData))
                        : "10 min"}
                    </span>
                  </div>
                </div>
                {currentSectionData?.videos &&
                  currentSectionData.videos.length > 0 && (
                    <div className="mt-6 mb-6">
                      <h4 className="text-sm font-medium text-slate-700 mb-3">
                        Section Videos
                      </h4>
                      {/* Fixed outer container with unchanged styling */}
                      <div className="bg-slate-50 rounded-lg border border-slate-100 p-3">
                        {/* Force scrolling with fixed height */}
                        <div
                          className={`max-h-48 overflow-y-auto space-y-2 ${
                            currentSectionData.videos.length > 3 ? "pr-2" : ""
                          }`}
                        >
                          {currentSectionData.videos.map((video, index) => (
                            <div
                              key={video.id || index}
                              className="flex items-center justify-between bg-white p-3 rounded border border-slate-200"
                            >
                              <div className="flex items-center">
                                <div
                                  className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center mr-3"
                                  style={{ backgroundColor: "#e6f0ff" }}
                                >
                                  <span
                                    className="text-xs font-medium"
                                    style={{ color: "#004aad" }}
                                  >
                                    {index + 1}
                                  </span>
                                </div>
                                <div>
                                  <h5 className="text-sm font-medium text-slate-800">
                                    {video.name
                                      ? video.name
                                      : `Video ${index + 1}`}
                                  </h5>
                                </div>
                              </div>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => watchVideo(video.id)}
                                className="text-xs flex items-center"
                              >
                                <Play
                                  size={12}
                                  className="mr-1.5"
                                  style={{ color: "#004aad" }}
                                />
                                Watch
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                {currentSectionData.description && (
                  <div className="prose prose-slate mb-8 bg-slate-50 p-4 rounded-lg border border-slate-100 max-w-full text-sm">
                    <p className="text-slate-700 leading-relaxed">
                      {currentSectionData.description}
                    </p>
                  </div>
                )}

                {Array.isArray(currentSectionData.materials) &&
                  currentSectionData.materials.length > 0 && (
                    <div className="mt-6 mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-slate-800">
                          Section Materials
                        </h4>
                        <div className="text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            <Paperclip className="h-3 w-3" />
                            {currentSectionData.materials.length} file
                            {currentSectionData.materials.length > 1 ? "s" : ""}
                          </span>
                          {typeof currentSectionData.materials?.[0]?.size ===
                            "number" && (
                            <span className="ml-2">
                              •{" "}
                              {(
                                currentSectionData.materials.reduce(
                                  (acc, m) => acc + (m.size || 0),
                                  0
                                ) /
                                1024 /
                                1024
                              ).toFixed(2)}{" "}
                              MB total
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="rounded-lg border border-slate-200 bg-white">
                        <ul className="divide-y divide-slate-200">
                          {currentSectionData.materials.map((mat) => {
                            const name = mat.name || "Download";
                            const ext =
                              name.split(".").length > 1
                                ? name.split(".").pop()?.toLowerCase() || ""
                                : "";
                            const sizeMb =
                              typeof mat.size === "number"
                                ? (mat.size / 1024 / 1024).toFixed(2)
                                : null;

                            return (
                              <li
                                key={mat.path}
                                className="group flex items-center justify-between px-3 py-2 hover:bg-slate-50"
                              >
                                <div className="min-w-0 flex items-center gap-2">
                                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 bg-slate-100 text-slate-600">
                                    <Paperclip className="h-3.5 w-3.5" />
                                  </span>

                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                      <a
                                        href={mat.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title={name}
                                        className="truncate text-sm font-medium text-slate-800 hover:underline"
                                      >
                                        {name}
                                      </a>
                                      {ext && (
                                        <span className="inline-flex items-center rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-slate-600">
                                          {ext}
                                        </span>
                                      )}
                                    </div>

                                    <div className="mt-0.5 text-xs text-slate-500">
                                      {sizeMb ? `${sizeMb} MB` : "Size unknown"}
                                    </div>
                                  </div>
                                </div>

                                <div className="ml-3 flex items-center gap-2">
                                  <a
                                    href={mat.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center rounded border border-slate-200 px-2 py-1 text-xs text-slate-700 hover:bg-slate-100"
                                    aria-label={`Download ${name}`}
                                  >
                                    <Download className="mr-1 h-4 w-4" />
                                    Download
                                  </a>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  )}

                <Separator className="my-6 bg-slate-100" />

                {/* Navigation Controls */}
                <div className="flex items-center justify-between">
                  {/* Previous button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPrevSection}
                    disabled={
                      currentModuleIndex === 0 && currentSectionIndex === 0
                    }
                    className="hidden sm:flex items-center border-slate-200 hover:bg-slate-50 text-sm"
                  >
                    <ChevronLeft size={14} className="mr-1.5" />
                    Previous
                  </Button>

                  {/* Mobile prev button */}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={goToPrevSection}
                    disabled={
                      currentModuleIndex === 0 && currentSectionIndex === 0
                    }
                    className="sm:hidden w-9 h-9 p-0 flex items-center justify-center rounded-lg"
                  >
                    <ChevronLeft size={16} />
                  </Button>

                  {/* Mark as complete button */}
                  <div className="flex-shrink-0">
                    {!currentSectionData.completed ? (
                      <Button
                        size="sm"
                        onClick={() =>
                          markAsComplete(currentModule!, currentSection!)
                        }
                        className="hover:opacity-95 hover:shadow-md transition-all font-medium group relative overflow-hidden"
                        style={{
                          backgroundColor: "#004aad",
                          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                          position: "relative",
                          transform: "translateY(0)",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = "translateY(-1px)";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                      >
                        <div className="flex items-center justify-center relative z-10">
                          <Check
                            size={14}
                            className="sm:mr-1.5 text-white group-hover:scale-110 transition-transform"
                          />
                          <span className="hidden text-white sm:inline text-sm">
                            Mark Complete
                          </span>
                        </div>
                        <div
                          className="absolute inset-0 bg-blue-800 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300"
                          style={{ zIndex: 0 }}
                        ></div>
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 transition-all"
                        disabled
                      >
                        <Check size={14} className="sm:mr-1.5" />
                        <span className="hidden sm:inline text-sm">
                          Completed
                        </span>
                      </Button>
                    )}
                  </div>

                  {/* Next button */}
                  <Button
                    size="sm"
                    variant={
                      currentSectionData.completed && hasNextSection
                        ? "default"
                        : "outline"
                    }
                    onClick={goToNextSection}
                    disabled={nextButtonDisabled}
                    className={cn(
                      "hidden sm:flex items-center",
                      currentSectionData.completed && hasNextSection
                        ? "text-white"
                        : "border-slate-200 hover:bg-slate-50 text-slate-400"
                    )}
                    style={
                      currentSectionData.completed && hasNextSection
                        ? { backgroundColor: "#004aad" }
                        : {}
                    }
                  >
                    Next
                    <ChevronRight size={14} className="ml-1.5" />
                  </Button>

                  {/* Mobile next button */}
                  <Button
                    variant={
                      currentSectionData.completed && hasNextSection
                        ? "default"
                        : "outline"
                    }
                    size="icon"
                    onClick={goToNextSection}
                    disabled={nextButtonDisabled}
                    className={cn(
                      "sm:hidden w-9 h-9 p-0 flex items-center justify-center rounded-lg",
                      currentSectionData.completed && hasNextSection
                        ? "text-white"
                        : "border-slate-200 hover:bg-slate-50 hover:text-slate-800"
                    )}
                    style={
                      currentSectionData.completed && hasNextSection
                        ? { backgroundColor: "#004aad" }
                        : {}
                    }
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full bg-white p-4">
            <div className="text-center max-w-md">
              <div
                className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "#e6f0ff" }}
              >
                <BookOpen size={24} style={{ color: "#004aad" }} />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">
                Ready to start learning?
              </h2>
              <p className="text-slate-600 mb-6 text-sm">
                Select a lesson from the course navigation to begin your
                learning journey.
              </p>
              <Button
                className="hover:opacity-90"
                style={{ backgroundColor: "#004aad" }}
                onClick={() => {
                  if (
                    course.modules.length > 0 &&
                    course.modules[0].sections.length > 0
                  ) {
                    changeSection(
                      course.modules[0].id,
                      course.modules[0].sections[0].id
                    );
                  }
                }}
              >
                Start First Lesson
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
