"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { mockCourseData } from "./mock/data";

// Types
export interface Section {
  id: string;
  title: string;
  videoId: string;
  description: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  completed?: boolean;
}

export interface Module {
  id: string;
  moduleName: string;
  description: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  sections: Section[];
  expanded?: boolean;
}

export interface Course {
  id: string;
  mainTitle: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  enrollmentCount: number;
  moduleCount: number;
  totalSections: number;
  modules: Module[];
}

export const useCourseLogic = () => {
  const params = useParams();
  const courseId = params.courseId as string;

  // State management
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentModule, setCurrentModule] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [overallProgress, setOverallProgress] = useState(0);

  // Fetch course data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Initialize with first section active
        const firstModule = mockCourseData.modules[0];
        const firstSection = firstModule.sections[0];

        setCurrentModule(firstModule.id);
        setCurrentSection(firstSection.id);
        setCourse(mockCourseData);

        // Calculate completion percentage
        const totalSections = mockCourseData.totalSections;
        const completedSections = mockCourseData.modules.reduce(
          (acc: number, module: Module) =>
            acc + module.sections.filter((section) => section.completed).length,
          0
        );
        setOverallProgress((completedSections / totalSections) * 100);
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  // Toggle module expansion
  const toggleModule = (moduleId: string) => {
    if (!course) return;

    setCourse({
      ...course,
      modules: course.modules.map((module) =>
        module.id === moduleId
          ? { ...module, expanded: !module.expanded }
          : module
      ),
    });
  };

  // Change current section
  const changeSection = (moduleId: string, sectionId: string) => {
    if (!course) return;

    setCurrentModule(moduleId);
    setCurrentSection(sectionId);

    // Expand the module if it's not already expanded
    if (!course.modules.find((m) => m.id === moduleId)?.expanded) {
      setCourse({
        ...course,
        modules: course.modules.map((module) =>
          module.id === moduleId ? { ...module, expanded: true } : module
        ),
      });
    }
  };

  // Mark section as complete
  const markAsComplete = (moduleId: string, sectionId: string) => {
    if (!course) return;

    const updatedCourse = {
      ...course,
      modules: course.modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              sections: module.sections.map((section) =>
                section.id === sectionId
                  ? { ...section, completed: true }
                  : section
              ),
            }
          : module
      ),
    };

    setCourse(updatedCourse);

    // Update progress
    const totalSections = updatedCourse.totalSections;
    const completedSections = updatedCourse.modules.reduce(
      (acc, module) =>
        acc + module.sections.filter((section) => section.completed).length,
      0
    );
    setOverallProgress((completedSections / totalSections) * 100);
  };

  // Navigate to next section
  const goToNextSection = () => {
    if (!course || !currentModule || !currentSection) return;

    const flattenedSections = course.modules
      .flatMap((module) =>
        module.sections.map((section) => ({
          moduleId: module.id,
          section,
        }))
      )
      .sort((a, b) => {
        // First by module order
        const moduleA = course.modules.find((m) => m.id === a.moduleId)!;
        const moduleB = course.modules.find((m) => m.id === b.moduleId)!;
        if (moduleA.order !== moduleB.order)
          return moduleA.order - moduleB.order;

        // Then by section order
        return a.section.order - b.section.order;
      });

    const currentIndex = flattenedSections.findIndex(
      (item) =>
        item.moduleId === currentModule && item.section.id === currentSection
    );

    if (currentIndex < flattenedSections.length - 1) {
      const nextItem = flattenedSections[currentIndex + 1];
      changeSection(nextItem.moduleId, nextItem.section.id);
    }
  };

  // Navigate to previous section
  const goToPrevSection = () => {
    if (!course || !currentModule || !currentSection) return;

    const flattenedSections = course.modules
      .flatMap((module) =>
        module.sections.map((section) => ({
          moduleId: module.id,
          section,
        }))
      )
      .sort((a, b) => {
        // First by module order
        const moduleA = course.modules.find((m) => m.id === a.moduleId)!;
        const moduleB = course.modules.find((m) => m.id === b.moduleId)!;
        if (moduleA.order !== moduleB.order)
          return moduleA.order - moduleB.order;

        // Then by section order
        return a.section.order - b.section.order;
      });

    const currentIndex = flattenedSections.findIndex(
      (item) =>
        item.moduleId === currentModule && item.section.id === currentSection
    );

    if (currentIndex > 0) {
      const prevItem = flattenedSections[currentIndex - 1];
      changeSection(prevItem.moduleId, prevItem.section.id);
    }
  };

  // Get current section data
  const getCurrentSection = () => {
    if (!course || !currentModule || !currentSection) return null;

    // eslint-disable-next-line @next/next/no-assign-module-variable
    const module = course.modules.find((m) => m.id === currentModule);
    if (!module) return null;

    return module.sections.find((s) => s.id === currentSection) || null;
  };

  return {
    course,
    loading,
    currentModule,
    currentSection,
    overallProgress,
    currentSectionData: getCurrentSection(),
    toggleModule,
    changeSection,
    markAsComplete,
    goToNextSection,
    goToPrevSection,
  };
};
