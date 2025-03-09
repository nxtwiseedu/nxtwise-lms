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
import { Module } from "../course-context";
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
  } = useCourseLogic();

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
          <div className="w-16 h-16 border-4 border-t-indigo-600 border-r-indigo-300 border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
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
            <BookOpen size={32} className="text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Course Not Found
          </h2>
          <p className="text-slate-600 mb-8">
            The course you&apos;re looking for doesn&apos;t exist or you
            don&apos;t have access to it.
          </p>
          <Link href="/courses">
            <Button className="bg-indigo-600 hover:bg-indigo-700 transition-all w-full">
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
        >
          <div className="flex items-center">
            <div
              className={cn(
                "w-7 h-7 rounded-lg flex items-center justify-center mr-3",
                module.id === currentModule
                  ? "bg-indigo-200 text-indigo-700"
                  : "bg-slate-100 text-slate-600"
              )}
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
              <div className="pl-8 pr-2 pt-1 pb-1 space-y-1">
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
                          <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center">
                            <Play
                              size={12}
                              className="text-indigo-700 ml-0.5"
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
          className="flex items-center text-xs text-slate-600 mb-3 hover:text-indigo-600 transition-colors"
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
            <span className="text-indigo-600 font-semibold">
              {Math.round(overallProgress)}%
            </span>
          </div>
          <Progress value={overallProgress} className="h-2 bg-slate-100" />
        </div>
      </div>

      <ScrollArea className="flex-grow py-2 px-3">
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
  const watchVideo = () => {
    if (currentSectionData?.videoId) {
      setVideoPlayerOpen(true);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-50 overflow-hidden">
      {/* Video Player */}
      {currentSectionData?.videoId && (
        <VideoPlayer
          videoId={currentSectionData.videoId}
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

              {currentSectionData.videoId && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="text-xs md:text-sm flex items-center whitespace-nowrap"
                  onClick={watchVideo}
                >
                  <Play size={14} className="mr-1.5" />
                  Watch Video
                </Button>
              )}
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
                    <span>10 min</span>
                  </div>
                </div>

                {currentSectionData.description && (
                  <div className="prose prose-slate mb-8 bg-slate-50 p-4 rounded-lg border border-slate-100 max-w-full text-sm">
                    <p className="text-slate-700 leading-relaxed">
                      {currentSectionData.description}
                    </p>
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
                        className="bg-indigo-600 hover:bg-indigo-700 transition-all"
                      >
                        <Check size={14} className="sm:mr-1.5" />
                        <span className="hidden sm:inline text-sm">
                          Mark Complete
                        </span>
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
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : "border-slate-200 hover:bg-slate-50 text-slate-400"
                    )}
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
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : "border-slate-200 hover:bg-slate-50 hover:text-slate-800"
                    )}
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
              <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen size={24} className="text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">
                Ready to start learning?
              </h2>
              <p className="text-slate-600 mb-6 text-sm">
                Select a lesson from the course navigation to begin your
                learning journey.
              </p>
              <Button
                className="bg-indigo-600 hover:bg-indigo-700"
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
