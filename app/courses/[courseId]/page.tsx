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
  Bookmark,
  Download,
  Share2,
  Menu,
  X,
  Calendar,
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
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

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

  if (!course) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md mx-4">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen size={32} className="text-rose-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Course Not Found
          </h2>
          <p className="text-slate-600 mb-8">
            The course you&apos;re looking for doesn&apos;t exist or you
            don&apos;t have access to it.
          </p>
          <Link href="/courses">
            <Button className="bg-indigo-600 hover:bg-indigo-700 transition-all w-full py-6">
              Browse Available Courses
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ModuleSection = ({ module }: any) => {
    return (
      <div className="mb-4 group" key={module.id}>
        <button
          onClick={() => toggleModule(module.id)}
          className={cn(
            "flex items-center justify-between w-full rounded-xl p-4 text-left font-medium transition-all",
            module.id === currentModule
              ? "bg-indigo-100 text-indigo-700"
              : "hover:bg-slate-100 text-slate-800"
          )}
        >
          <div className="flex items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center mr-3",
                module.id === currentModule
                  ? "bg-indigo-200 text-indigo-700"
                  : "bg-slate-100 text-slate-600"
              )}
            >
              <span className="text-sm font-semibold">{module.order + 1}</span>
            </div>
            <span className="font-medium">{module.moduleName}</span>
          </div>
          <div className="flex items-center">
            {module.expanded ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
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
              <div className="pl-10 pr-2 pt-2 pb-1 space-y-1">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {module.sections.map((section: any) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      changeSection(module.id, section.id);
                      setShowMobileNav(false);
                    }}
                    className={cn(
                      "flex items-center w-full p-3 rounded-lg text-sm text-left transition-all",
                      currentSection === section.id
                        ? "bg-indigo-50 text-indigo-700 font-medium"
                        : section.completed
                        ? "text-emerald-600 hover:bg-emerald-50"
                        : "text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    <div className="mr-3 flex-shrink-0">
                      {section.completed ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                          <Check size={14} className="text-emerald-600" />
                        </div>
                      ) : currentSection === section.id ? (
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                          <Play size={14} className="text-indigo-700 ml-0.5" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center">
                          <span className="text-xs font-medium">
                            {section.order + 1}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="flex-1 truncate">{section.title}</span>
                  </button>
                ))}
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
      <div className="p-6 border-b border-slate-100">
        <Link
          href="/courses"
          className="flex items-center text-sm text-slate-600 mb-5 hover:text-indigo-600 transition-colors"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to All Courses
        </Link>
        <h1 className="text-xl font-bold text-slate-900 mb-4">
          {course.mainTitle}
        </h1>
        <div className="flex items-center space-x-4 text-sm text-slate-500 mb-5">
          <div className="flex items-center">
            <Calendar size={14} className="mr-1.5" />
            <span>{course.totalSections} lessons</span>
          </div>
        </div>
        <div className="mt-2">
          <div className="flex justify-between text-sm font-medium mb-2">
            <span className="text-slate-700">Your Progress</span>
            <span className="text-indigo-600 font-semibold">
              {Math.round(overallProgress)}%
            </span>
          </div>
          <Progress value={overallProgress} className="h-2.5 bg-slate-100" />
        </div>
      </div>

      <ScrollArea className="flex-grow px-4 py-2">
        {course.modules.map((module) => (
          <ModuleSection key={module.id} module={module} />
        ))}
      </ScrollArea>
    </div>
  );

  return (
    <div className="flex flex-col w-screen lg:w-auto  lg:flex-row h-screen bg-slate-50 overflow-x-hidden">
      {/* Course Sidebar - Hidden on Mobile, Visible on Desktop */}
      <div className="hidden lg:block w-96 border-r border-slate-200 h-full bg-white overflow-hidden">
        <SidebarContent />
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shadow-sm">
        <Drawer open={showMobileNav} onOpenChange={setShowMobileNav}>
          <DrawerTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu size={22} />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-[80vh] rounded-t-xl pt-6">
            <div className="absolute right-4 top-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMobileNav(false)}
              >
                <X size={18} />
              </Button>
            </div>
            <div className="px-4 pb-8 h-full overflow-auto">
              <SidebarContent />
            </div>
          </DrawerContent>
        </Drawer>

        <div className="flex-1 ml-2">
          <h2 className="font-bold text-slate-900 truncate">
            {course.mainTitle}
          </h2>
          <div className="flex items-center text-xs text-slate-500 mt-0.5">
            <Clock size={12} className="mr-1" />
            <span className="mr-2">{course.totalSections} lessons</span>
            <span className="font-medium text-indigo-600">
              {Math.round(overallProgress)}% complete
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-600 border-amber-200 text-xs"
          >
            In Progress
          </Badge>
        </div>
      </div>

      {/* Content Area */}
      <main className="flex-1 flex flex-col bg-white lg:m-6 lg:rounded-2xl lg:shadow-md overflow-x-hidden">
        {currentSectionData ? (
          <div className="flex flex-col flex-1">
            {/* Video Player Area */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-900 flex items-center justify-center relative min-h-[220px]">
              <div className="absolute top-4 right-4 flex space-x-2 z-10">
                <button className="bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-full transition-all">
                  <Download size={18} />
                </button>
                <button className="bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-full transition-all">
                  <Bookmark size={18} />
                </button>
                <button className="bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-full transition-all">
                  <Share2 size={18} />
                </button>
              </div>

              {/* Video placeholder */}
              <div className="text-white text-center py-20 px-4">
                <button className="group w-20 h-20 bg-indigo-600 hover:bg-indigo-500 rounded-full flex items-center justify-center transition-all mx-auto mb-6 shadow-lg hover:shadow-indigo-500/30">
                  <Play
                    size={32}
                    className="ml-1 group-hover:scale-110 transition-transform"
                    strokeWidth={1.5}
                  />
                </button>
                <h3 className="text-2xl font-semibold mx-auto">
                  {currentSectionData.title}
                </h3>
                <p className="text-indigo-200 mt-3 opacity-80">
                  Lesson {currentSectionData.order + 1} •{" "}
                  {
                    course.modules.find((m) => m.id === currentModule)
                      ?.moduleName
                  }
                </p>
              </div>
            </div>

            {/* Section Content */}
            <div className="p-4 md:p-8 overflow-auto flex-1">
              <div className="max-w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center mb-2">
                      <Badge
                        className={cn(
                          "mr-3",
                          currentSectionData.completed
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                            : "bg-amber-50 text-amber-600 border-amber-200"
                        )}
                      >
                        {currentSectionData.completed
                          ? "Completed"
                          : "In Progress"}
                      </Badge>
                      <div className="flex items-center text-sm text-slate-500">
                        <Clock size={14} className="mr-1.5" />
                        <span>10 min</span>
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-1">
                      {currentSectionData.title}
                    </h2>
                    <p className="text-slate-500">
                      {
                        course.modules.find((m) => m.id === currentModule)
                          ?.moduleName
                      }
                    </p>
                  </div>
                </div>

                {currentSectionData.description && (
                  <div className="prose prose-slate mb-8 bg-slate-50 p-6 rounded-xl border border-slate-100 max-w-full">
                    <p className="text-slate-700 leading-relaxed">
                      {currentSectionData.description}
                    </p>
                  </div>
                )}

                <Separator className="my-8 bg-slate-200" />

                {/* Navigation Controls */}
                <div className="flex items-center justify-between pt-4">
                  {/* Previous button */}
                  <Button
                    variant="outline"
                    onClick={goToPrevSection}
                    disabled={
                      course.modules[0].sections.find(
                        (s) => s.id === currentSection
                      ) === course.modules[0].sections[0]
                    }
                    className="hidden sm:flex items-center border-slate-200 hover:bg-slate-50 hover:text-slate-800 transition-all"
                  >
                    <ChevronLeft size={16} className="mr-2" />
                    Previous Lesson
                  </Button>

                  {/* Mobile prev button */}
                  <Button
                    variant="outline"
                    onClick={goToPrevSection}
                    disabled={
                      course.modules[0].sections.find(
                        (s) => s.id === currentSection
                      ) === course.modules[0].sections[0]
                    }
                    className="sm:hidden w-12 h-12 p-0 flex items-center justify-center rounded-lg"
                  >
                    <ChevronLeft size={20} />
                  </Button>

                  {/* Mark as complete button */}
                  <div className="flex-shrink-0">
                    {!currentSectionData.completed ? (
                      <Button
                        onClick={() =>
                          markAsComplete(currentModule!, currentSection!)
                        }
                        className="bg-indigo-600 hover:bg-indigo-700 transition-all"
                      >
                        <Check size={16} className="sm:mr-2" />
                        <span className="hidden sm:inline">
                          Mark as Complete
                        </span>
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 transition-all"
                        disabled
                      >
                        <Check size={16} className="sm:mr-2" />
                        <span className="hidden sm:inline">Completed</span>
                      </Button>
                    )}
                  </div>

                  {/* Next button */}
                  <Button
                    variant={
                      currentSectionData.completed ? "default" : "outline"
                    }
                    onClick={goToNextSection}
                    className={cn(
                      "hidden sm:flex items-center transition-all",
                      currentSectionData.completed
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : "border-slate-200 hover:bg-slate-50 hover:text-slate-800"
                    )}
                  >
                    Next Lesson
                    <ChevronRight size={16} className="ml-2" />
                  </Button>

                  {/* Mobile next button */}
                  <Button
                    variant={
                      currentSectionData.completed ? "default" : "outline"
                    }
                    onClick={goToNextSection}
                    className={cn(
                      "sm:hidden w-12 h-12 p-0 flex items-center justify-center rounded-lg",
                      currentSectionData.completed
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : "border-slate-200 hover:bg-slate-50 hover:text-slate-800"
                    )}
                  >
                    <ChevronRight size={20} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full bg-slate-50">
            <div className="text-center p-4 sm:p-8">
              <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen size={32} className="text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-3">
                Ready to start learning?
              </h2>
              <p className="text-slate-600 mb-8">
                Select a lesson from the course navigation to begin your
                learning journey.
              </p>
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 transition-all px-8 py-6"
                onClick={() => {
                  // Start first lesson logic
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
