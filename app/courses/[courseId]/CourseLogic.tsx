"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useCourses, Course, Section } from "../course-context";

interface CourseLogicReturn {
  course: Course | null;
  loading: boolean;
  currentModule: string | null;
  currentSection: string | null;
  overallProgress: number;
  currentSectionData: Section | null;
  toggleModule: (moduleId: string) => void;
  changeSection: (moduleId: string, sectionId: string) => void;
  markAsComplete: (moduleId: string, sectionId: string) => void;
  goToNextSection: () => void;
  goToPrevSection: () => void;
}

export function useCourseLogic(): CourseLogicReturn {
  const params = useParams();
  const courseId = params?.courseId as string;

  // Get course data from our shared context
  const {
    getCourseById,
    updateCourseData,
    loading: contextLoading,
  } = useCourses();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentModule, setCurrentModule] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [overallProgress, setOverallProgress] = useState<number>(0);
  const [currentSectionData, setCurrentSectionData] = useState<Section | null>(
    null
  );

  // Calculate overall progress - separated from the useEffect
  const calculateProgress = (courseData: Course): number => {
    if (!courseData || !courseData.modules) return 0;

    let completedSections = 0;
    let totalSections = 0;

    courseData.modules.forEach((module) => {
      module.sections.forEach((section) => {
        totalSections++;
        if (section.completed) completedSections++;
      });
    });

    return totalSections > 0 ? (completedSections / totalSections) * 100 : 0;
  };

  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // Wait for context to finish loading
        if (contextLoading) return;

        // Get course from context
        const courseData = getCourseById(courseId);

        if (!courseData) {
          console.error("Course not found");
          setLoading(false);
          return;
        }

        // Ensure modules and sections are properly structured
        const processedCourse: Course = {
          ...courseData,
          modules: courseData.modules.map((module) => ({
            ...module,
            expanded: module.order === 0, // Expand first module by default
            sections: module.sections.map((section) => ({
              ...section,
            })),
          })),
        };

        // Calculate progress before setting state
        const progress = calculateProgress(processedCourse);
        setOverallProgress(progress);

        setCourse(processedCourse);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching course:", error);
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, contextLoading, getCourseById]);

  // This effect updates the context when the progress changes,
  // but only when the course and progress are stable
  useEffect(() => {
    // Only update the context when both course and overallProgress are available
    // and when the course isn't being first loaded (to prevent initial double-update)
    if (course && !loading && overallProgress !== course.progress) {
      updateCourseData(courseId, { progress: overallProgress });
    }
  }, [course, courseId, loading, overallProgress, updateCourseData]);

  // Toggle module expansion
  const toggleModule = (moduleId: string) => {
    if (!course) return;

    setCourse({
      ...course,
      modules: course.modules.map((module) => ({
        ...module,
        expanded: module.id === moduleId ? !module.expanded : module.expanded,
      })),
    });
  };

  // Change current section
  const changeSection = (moduleId: string, sectionId: string) => {
    if (!course) return;

    setCurrentModule(moduleId);
    setCurrentSection(sectionId);

    // Find current section data
    // eslint-disable-next-line @next/next/no-assign-module-variable
    const module = course.modules.find((m) => m.id === moduleId);
    if (module) {
      const section = module.sections.find((s) => s.id === sectionId);
      if (section) {
        setCurrentSectionData(section);
      }
    }

    // Expand the module
    setCourse({
      ...course,
      modules: course.modules.map((module) => ({
        ...module,
        expanded: module.id === moduleId ? true : module.expanded,
      })),
    });
  };

  // Mark section as complete
  const markAsComplete = (moduleId: string, sectionId: string) => {
    if (!course) return;

    const updatedCourse: Course = {
      ...course,
      modules: course.modules.map((module) => {
        if (module.id === moduleId) {
          return {
            ...module,
            sections: module.sections.map((section) => {
              if (section.id === sectionId) {
                return { ...section, completed: true };
              }
              return section;
            }),
          };
        }
        return module;
      }),
    };

    setCourse(updatedCourse);

    // Update the current section data
    // eslint-disable-next-line @next/next/no-assign-module-variable
    const module = updatedCourse.modules.find((m) => m.id === moduleId);
    if (module) {
      const section = module.sections.find((s) => s.id === sectionId);
      if (section) {
        setCurrentSectionData(section);
      }
    }

    // Calculate and set the new progress - but don't update the context directly from here
    const newProgress = calculateProgress(updatedCourse);
    setOverallProgress(newProgress);
  };

  // Navigate to next section
  const goToNextSection = () => {
    if (!course || !currentModule || !currentSection) return;

    let foundNextSection = false;
    let nextModuleId: string | null = null;
    let nextSectionId: string | null = null;

    // Find the next section
    for (let m = 0; m < course.modules.length; m++) {
      // eslint-disable-next-line @next/next/no-assign-module-variable
      const module = course.modules[m];

      if (foundNextSection) break;

      if (module.id === currentModule) {
        for (let s = 0; s < module.sections.length; s++) {
          const section = module.sections[s];

          if (section.id === currentSection && s < module.sections.length - 1) {
            // Next section in same module
            nextModuleId = module.id;
            nextSectionId = module.sections[s + 1].id;
            foundNextSection = true;
            break;
          } else if (
            section.id === currentSection &&
            m < course.modules.length - 1
          ) {
            // First section of next module
            nextModuleId = course.modules[m + 1].id;
            nextSectionId = course.modules[m + 1].sections[0].id;
            foundNextSection = true;
            break;
          }
        }
      }
    }

    if (nextModuleId && nextSectionId) {
      changeSection(nextModuleId, nextSectionId);
    }
  };

  // Navigate to previous section
  const goToPrevSection = () => {
    if (!course || !currentModule || !currentSection) return;

    let foundPrevSection = false;
    let prevModuleId: string | null = null;
    let prevSectionId: string | null = null;

    // Find the previous section
    for (let m = 0; m < course.modules.length; m++) {
      // eslint-disable-next-line @next/next/no-assign-module-variable
      const module = course.modules[m];

      if (foundPrevSection) break;

      if (module.id === currentModule) {
        for (let s = 0; s < module.sections.length; s++) {
          const section = module.sections[s];

          if (section.id === currentSection && s > 0) {
            // Previous section in same module
            prevModuleId = module.id;
            prevSectionId = module.sections[s - 1].id;
            foundPrevSection = true;
            break;
          } else if (section.id === currentSection && s === 0 && m > 0) {
            // Last section of previous module
            prevModuleId = course.modules[m - 1].id;
            const prevModule = course.modules[m - 1];
            prevSectionId =
              prevModule.sections[prevModule.sections.length - 1].id;
            foundPrevSection = true;
            break;
          }
        }
      }
    }

    if (prevModuleId && prevSectionId) {
      changeSection(prevModuleId, prevSectionId);
    }
  };

  return {
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
  };
}
