import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { useCourses, Course, Section } from "../course-context";
import { auth } from "../../lib/firebase";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

// This function helps format the video duration for display
export const formatDuration = (seconds: number | undefined): string => {
  if (!seconds) return "0 min";

  const minutes = Math.ceil(seconds / 60);
  return `${minutes} min`;
};

// This function gets the total duration of a section by summing all video durations
export const getSectionDuration = (section: Section): number => {
  // If we have videos array with durations, sum them
  if (section.videos && section.videos.length > 0) {
    return section.videos.reduce(
      (total, video) => total + (video.duration || 0),
      0
    );
  }

  // If we have a single duration property (legacy)
  if (section.duration) {
    return section.duration;
  }

  return 0;
};

// Return a video ID for a section (first video, or legacy videoId)
export const getPrimaryVideoId = (section: Section): string | undefined => {
  // First try videos array
  if (section.videos && section.videos.length > 0 && section.videos[0].id) {
    return section.videos[0].id;
  }

  // Fall back to legacy videoId
  return section.videoId;
};

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
  getSectionDuration: (section: Section) => number;
  formatDuration: (seconds: number | undefined) => string;
  getCurrentVideoId: () => string | undefined;
}

export function useCourseLogic(): CourseLogicReturn {
  const params = useParams();
  const courseId = params?.courseId as string;

  // Use refs for values that shouldn't trigger re-renders
  const isInitialMount = useRef(true);
  const isUpdatingProgress = useRef(false);
  const completedSectionsRef = useRef<string[]>([]);
  const courseProgressRef = useRef<number>(0);

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

  // Calculate progress without triggering re-renders
  const calculateProgress = useCallback((courseData: Course): number => {
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
  }, []);

  // Get current video ID (primary video of current section)
  const getCurrentVideoId = useCallback((): string | undefined => {
    if (!currentSectionData) return undefined;
    return getPrimaryVideoId(currentSectionData);
  }, [currentSectionData]);

  // Other methods remain the same...

  // Determine if section is accessible based on completion status
  const isSectionAccessible = useCallback(
    (courseData: Course, moduleId: string, sectionId: string): boolean => {
      if (!courseData) return false;

      // Find the module
      const moduleIndex = courseData.modules.findIndex(
        (m) => m.id === moduleId
      );
      if (moduleIndex === -1) return false;

      // Find the section
      const sectionIndex = courseData.modules[moduleIndex].sections.findIndex(
        (s) => s.id === sectionId
      );
      if (sectionIndex === -1) return false;

      // First section of first module is always accessible
      if (moduleIndex === 0 && sectionIndex === 0) return true;

      // If it's not the first section in a module, check if previous section is completed
      if (sectionIndex > 0) {
        const prevSection =
          courseData.modules[moduleIndex].sections[sectionIndex - 1];
        return prevSection.completed;
      }

      // If it's the first section of a non-first module, check if last section of previous module is completed
      if (sectionIndex === 0 && moduleIndex > 0) {
        const prevModule = courseData.modules[moduleIndex - 1];
        const lastSectionOfPrevModule =
          prevModule.sections[prevModule.sections.length - 1];
        return lastSectionOfPrevModule.completed;
      }

      return false;
    },
    []
  );

  // Memoize the update to Firestore to prevent multiple calls
  const updateProgressInFirestore = useCallback(
    async (
      moduleId: string,
      sectionId: string,
      completed: boolean,
      newProgress: number
    ) => {
      if (!auth.currentUser) return;

      try {
        // Lock updates while this one is processing
        if (isUpdatingProgress.current) {
          console.log("Progress update already in progress, queuing...");
          // Wait until the current update is complete before proceeding
          await new Promise((resolve) => {
            const checkInterval = setInterval(() => {
              if (!isUpdatingProgress.current) {
                clearInterval(checkInterval);
                resolve(true);
              }
            }, 100);
          });
        }

        isUpdatingProgress.current = true;
        const userId = auth.currentUser.uid;
        const db = getFirestore();
        const progressRef = doc(db, "users", userId, "progress", courseId);

        // Get a snapshot to ensure we have the latest data
        const progressSnapshot = await getDoc(progressRef);

        // Combine current state with database state to ensure we don't lose updates
        let currentCompletedSections: string[] = [];

        if (progressSnapshot.exists()) {
          const data = progressSnapshot.data();
          currentCompletedSections = data.completedSections || [];
        }

        // Merge with our local ref for safety
        let updatedCompletedSections = Array.from(
          new Set([
            ...currentCompletedSections,
            ...completedSectionsRef.current,
          ])
        );

        // Update based on current action
        if (completed && !updatedCompletedSections.includes(sectionId)) {
          updatedCompletedSections.push(sectionId);
        } else if (!completed && updatedCompletedSections.includes(sectionId)) {
          updatedCompletedSections = updatedCompletedSections.filter(
            (id) => id !== sectionId
          );
        }

        // Use setDoc with merge option to handle both creation and updates
        await setDoc(
          progressRef,
          {
            courseId,
            overallProgress: newProgress,
            completedSections: updatedCompletedSections,
            currentModule: moduleId,
            currentSection: sectionId,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );

        // Update the ref after successful Firestore update
        completedSectionsRef.current = updatedCompletedSections;
        console.log("Progress successfully updated in Firestore", {
          completedSections: updatedCompletedSections,
          progress: newProgress,
        });
      } catch (error) {
        console.error("Error updating progress in Firestore:", error);
        // Here you could implement retry logic or show an error to the user
      } finally {
        isUpdatingProgress.current = false;
      }
    },
    [courseId]
  );

  // Initial data fetch - only runs once or when dependencies change
  useEffect(() => {
    const fetchCourseAndProgress = async () => {
      try {
        if (contextLoading) return;

        const courseData = getCourseById(courseId);

        if (!courseData) {
          setLoading(false);
          return;
        }

        // Process course data, ensuring backward compatibility with videos array
        const processedCourse: Course = {
          ...courseData,
          modules: courseData.modules.map((module) => ({
            ...module,
            expanded: module.order === 0,
            sections: module.sections.map((section) => ({
              ...section,
              // Ensure the videos array exists (for backward compatibility)
              videos:
                section.videos ||
                (section.videoId
                  ? [
                      {
                        id: section.videoId,
                        name: "",
                        duration: section.duration || 0,
                      },
                    ]
                  : []),
            })),
          })),
        };

        let initialModule = processedCourse.modules[0]?.id || "";
        let initialSection = processedCourse.modules[0]?.sections[0]?.id || "";
        let initialCompletedSections: string[] = [];

        if (auth.currentUser) {
          const userId = auth.currentUser.uid;
          const db = getFirestore();

          try {
            const progressRef = doc(db, "users", userId, "progress", courseId);
            const progressSnapshot = await getDoc(progressRef);

            if (progressSnapshot.exists()) {
              const progressData = progressSnapshot.data();

              initialModule = progressData.currentModule || initialModule;
              initialSection = progressData.currentSection || initialSection;
              initialCompletedSections = progressData.completedSections || [];

              // Make sure to update all section completion statuses
              processedCourse.modules.forEach((module) => {
                module.sections.forEach((section) => {
                  section.completed = initialCompletedSections.includes(
                    section.id
                  );
                });
              });

              const progress =
                progressData.overallProgress ||
                calculateProgress(processedCourse);

              setOverallProgress(progress);
              courseProgressRef.current = progress;
            } else {
              // Create the initial progress document if it doesn't exist
              await setDoc(progressRef, {
                courseId,
                overallProgress: 0,
                completedSections: [],
                currentModule: initialModule,
                currentSection: initialSection,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              });
            }
          } catch (error) {
            console.error("Error fetching user progress:", error);
          }
        }

        // Do a batched update of all state to reduce render cycles
        setCurrentModule(initialModule);
        setCurrentSection(initialSection);
        completedSectionsRef.current = initialCompletedSections;

        // Calculate and set progress once
        const calculatedProgress = calculateProgress(processedCourse);
        setOverallProgress(calculatedProgress);
        courseProgressRef.current = calculatedProgress;

        // Set course data last
        setCourse(processedCourse);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching course:", error);
        setLoading(false);
      }
    };

    fetchCourseAndProgress();
    // Make sure this effect only runs when necessary
  }, [courseId, contextLoading, getCourseById, calculateProgress]);

  // Rest of the code remains the same...
  // Update current section data when needed
  useEffect(() => {
    if (!course || !currentModule || !currentSection) {
      setCurrentSectionData(null);
      return;
    }

    // eslint-disable-next-line @next/next/no-assign-module-variable
    const module = course.modules.find((m) => m.id === currentModule);
    if (!module) {
      setCurrentSectionData(null);
      return;
    }

    const section = module.sections.find((s) => s.id === currentSection);
    if (!section) {
      setCurrentSectionData(null);
      return;
    }

    setCurrentSectionData(section);
  }, [course, currentModule, currentSection]);

  // Update course data in context when progress changes significantly
  useEffect(() => {
    // Skip the first render or if we're already processing updates
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Only update if there's a significant change to avoid infinite loops
    if (
      course &&
      !loading &&
      Math.abs(courseProgressRef.current - overallProgress) > 0.1
    ) {
      courseProgressRef.current = overallProgress;
      // Use a timeout to batch this update
      const timeoutId = setTimeout(() => {
        if (!isUpdatingProgress.current) {
          updateCourseData(courseId, { progress: overallProgress });
        }
      }, 100); // Increased timeout for better stability

      return () => clearTimeout(timeoutId);
    }
  }, [course, courseId, loading, overallProgress, updateCourseData]);

  // Toggle module expanded state
  const toggleModule = useCallback(
    (moduleId: string) => {
      if (!course) return;

      setCourse((prevCourse) => {
        if (!prevCourse) return null;
        return {
          ...prevCourse,
          modules: prevCourse.modules.map((module) => ({
            ...module,
            expanded:
              module.id === moduleId ? !module.expanded : module.expanded,
          })),
        };
      });
    },
    [course]
  );

  // Change the current section
  const changeSection = useCallback(
    (moduleId: string, sectionId: string) => {
      if (!course) return;

      // Check if section is accessible
      if (!isSectionAccessible(course, moduleId, sectionId)) {
        console.log("Section not accessible", { moduleId, sectionId });
        // If the section being requested isn't accessible, we don't change
        return;
      }

      // Batch these updates to reduce render cycles
      setCurrentModule(moduleId);
      setCurrentSection(sectionId);

      setCourse((prevCourse) => {
        if (!prevCourse) return null;
        return {
          ...prevCourse,
          modules: prevCourse.modules.map((module) => ({
            ...module,
            expanded: module.id === moduleId ? true : module.expanded,
          })),
        };
      });

      if (auth.currentUser) {
        // Wrapped in a try-catch for safety
        try {
          // Use async/await instead of setTimeout for better reliability
          (async () => {
            await updateProgressInFirestore(
              moduleId,
              sectionId,
              false,
              overallProgress
            );
          })();
        } catch (error) {
          console.error("Error in changeSection:", error);
        }
      }
    },
    [course, overallProgress, updateProgressInFirestore, isSectionAccessible]
  );

  // Mark a section as complete
  const markAsComplete = useCallback(
    async (moduleId: string, sectionId: string) => {
      if (!course) return;

      try {
        // Create an updated course object with the completed section
        const updatedCourse = {
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

        // Calculate new progress before updating state
        const newProgress = calculateProgress(updatedCourse);

        // Update local state immediately for responsive UI
        setCourse(updatedCourse);
        setOverallProgress(newProgress);
        courseProgressRef.current = newProgress;

        // Update local reference before Firebase call
        if (!completedSectionsRef.current.includes(sectionId)) {
          completedSectionsRef.current = [
            ...completedSectionsRef.current,
            sectionId,
          ];
        }

        // Now update Firestore (without setTimeout for better reliability)
        if (auth.currentUser) {
          await updateProgressInFirestore(
            moduleId,
            sectionId,
            true,
            newProgress
          );
        }
      } catch (error) {
        console.error("Error in markAsComplete:", error);
        // Here you could implement recovery logic or show an error to the user
      }
    },
    [course, calculateProgress, updateProgressInFirestore]
  );

  // Navigate to next section
  const goToNextSection = useCallback(() => {
    if (!course || !currentModule || !currentSection) return;

    let nextModuleId: string | null = null;
    let nextSectionId: string | null = null;

    // Find the next section
    const currentModuleIndex = course.modules.findIndex(
      (m) => m.id === currentModule
    );
    if (currentModuleIndex === -1) return;

    const currentModule_obj = course.modules[currentModuleIndex];
    const currentSectionIndex = currentModule_obj.sections.findIndex(
      (s) => s.id === currentSection
    );
    if (currentSectionIndex === -1) return;

    // Verify current section is completed before allowing progress
    const currentSectionObj = currentModule_obj.sections[currentSectionIndex];
    if (!currentSectionObj.completed) return;

    // Check if there's another section in this module
    if (currentSectionIndex < currentModule_obj.sections.length - 1) {
      nextModuleId = currentModule;
      nextSectionId = currentModule_obj.sections[currentSectionIndex + 1].id;
    }
    // Otherwise, move to the next module's first section
    else if (currentModuleIndex < course.modules.length - 1) {
      nextModuleId = course.modules[currentModuleIndex + 1].id;
      nextSectionId = course.modules[currentModuleIndex + 1].sections[0].id;
    }

    if (nextModuleId && nextSectionId) {
      changeSection(nextModuleId, nextSectionId);
    }
  }, [course, currentModule, currentSection, changeSection]);

  // Navigate to previous section
  const goToPrevSection = useCallback(() => {
    if (!course || !currentModule || !currentSection) return;

    let prevModuleId: string | null = null;
    let prevSectionId: string | null = null;

    // Find the previous section
    const currentModuleIndex = course.modules.findIndex(
      (m) => m.id === currentModule
    );
    if (currentModuleIndex === -1) return;

    const currentModule_obj = course.modules[currentModuleIndex];
    const currentSectionIndex = currentModule_obj.sections.findIndex(
      (s) => s.id === currentSection
    );
    if (currentSectionIndex === -1) return;

    // Check if there's a previous section in this module
    if (currentSectionIndex > 0) {
      prevModuleId = currentModule;
      prevSectionId = currentModule_obj.sections[currentSectionIndex - 1].id;
    }
    // Otherwise, move to the previous module's last section
    else if (currentModuleIndex > 0) {
      const prevModule = course.modules[currentModuleIndex - 1];
      prevModuleId = prevModule.id;
      prevSectionId = prevModule.sections[prevModule.sections.length - 1].id;
    }

    if (prevModuleId && prevSectionId) {
      changeSection(prevModuleId, prevSectionId);
    }
  }, [course, currentModule, currentSection, changeSection]);

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
    getSectionDuration,
    formatDuration,
    getCurrentVideoId,
  };
}
