"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";

// Fallback to mock data if needed during development
import mockCourses from "./[courseId]/mock/data";

// Types
export interface Section {
  id: string;
  title: string;
  order: number;
  completed: boolean;
  description?: string;
  videoId?: string;
}

export interface Module {
  id: string;
  moduleName: string;
  order: number;
  expanded: boolean;
  sections: Section[];
  description?: string;
}

export interface Course {
  id: string;
  mainTitle: string;
  description: string;
  moduleCount: number;
  totalSections: number;
  enrollmentCount: number;
  progress?: number; // User's progress, if enrolled
  status: string;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string; // URL to course thumbnail if available
  modules: Module[];
}

interface CourseContextType {
  courses: Course[];
  enrolledCourses: Course[];
  availableCourses: Course[];
  loading: boolean;
  updateCourseData: (
    courseId: string,
    updatedCourseData: Partial<Course>
  ) => void;
  getCourseById: (courseId: string) => Course | null;
}

// Create context with a default value
const CourseContext = createContext<CourseContextType | undefined>(undefined);

interface CourseProviderProps {
  children: ReactNode;
  useMockData?: boolean; // Optional prop to use mock data during development
}

export function CourseProvider({
  children,
  useMockData = false,
}: CourseProviderProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch user data and courses from Firestore
  useEffect(() => {
    if (useMockData) {
      // Use mock data for development
      const fetchMockCourses = async () => {
        try {
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 500));

          setCourses(mockCourses);
          setEnrolledCourses(
            mockCourses.filter(
              (course) => course.progress && course.progress > 0
            )
          );
          setAvailableCourses(
            mockCourses.filter(
              (course) => !course.progress || course.progress === 0
            )
          );
          setLoading(false);
        } catch (error) {
          console.error("Error fetching mock courses:", error);
          setLoading(false);
        }
      };

      fetchMockCourses();
      return;
    }

    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        await fetchUserCourses(user.uid);
      } else {
        // User is not signed in
        setUserId(null);
        setCourses([]);
        setEnrolledCourses([]);
        setAvailableCourses([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [useMockData]);

  // Fetch user courses from Firestore
  const fetchUserCourses = async (uid: string) => {
    try {
      const db = getFirestore();

      // Get user document with courseIds
      const userDoc = await getDoc(doc(db, "users", uid));

      if (!userDoc.exists()) {
        console.error("User document not found");
        setLoading(false);
        return;
      }

      const userData = userDoc.data();
      const userCourseIds = userData.courseIds || [];

      const enrolledCourseData: Course[] = [];
      const availableCourseData: Course[] = [];
      const allCourses: Course[] = [];

      // Fetch all courses
      const coursesSnapshot = await getDocs(collection(db, "courses"));

      // Helper function to fetch modules and sections for a course
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fetchCourseDetails = async (courseData: any): Promise<Course> => {
        // Fetch modules
        const modulesSnapshot = await getDocs(
          collection(db, "courses", courseData.id, "modules")
        );

        // Map modules and their sections
        const modulesPromises = modulesSnapshot.docs.map(async (moduleDoc) => {
          const moduleData = moduleDoc.data();

          // Fetch sections
          const sectionsSnapshot = await getDocs(
            collection(
              db,
              "courses",
              courseData.id,
              "modules",
              moduleDoc.id,
              "sections"
            )
          );

          const sections = sectionsSnapshot.docs.map((sectionDoc) => ({
            ...sectionDoc.data(),
            completed: false, // Default to false, will be updated with user progress
          })) as Section[];

          // Sort sections by order
          sections.sort((a, b) => a.order - b.order);

          return {
            ...moduleData,
            expanded: false,
            sections,
          } as Module;
        });

        const modules = await Promise.all(modulesPromises);

        // Sort modules by order
        modules.sort((a, b) => a.order - b.order);

        return {
          ...courseData,
          modules,
        } as Course;
      };

      // Process each course
      for (const courseDoc of coursesSnapshot.docs) {
        const courseData = courseDoc.data() as Course;

        // Check if this is a course the user is enrolled in
        const isEnrolled = userCourseIds.includes(courseData.id);

        // Only fetch detailed course data if enrolled or if it's a limited set of available courses
        // This prevents fetching too much data at once
        if (isEnrolled || availableCourseData.length < 5) {
          const detailedCourse = await fetchCourseDetails(courseData);

          if (isEnrolled) {
            // For enrolled courses, get progress data
            const progressRef = doc(
              db,
              "users",
              uid,
              "progress",
              courseData.id
            );
            const progressSnapshot = await getDoc(progressRef);

            if (progressSnapshot.exists()) {
              const progressData = progressSnapshot.data();
              detailedCourse.progress = progressData.overallProgress || 0;

              // Update completion status for sections
              if (
                progressData.completedSections &&
                progressData.completedSections.length
              ) {
                detailedCourse.modules.forEach((module) => {
                  module.sections.forEach((section) => {
                    section.completed = progressData.completedSections.includes(
                      section.id
                    );
                  });
                });
              }
            } else {
              // Initialize progress if not exists
              detailedCourse.progress = 0;
            }

            enrolledCourseData.push(detailedCourse);
          } else {
            // For available courses, just add basic data
            availableCourseData.push(detailedCourse);
          }

          allCourses.push(detailedCourse);
        } else {
          // For other available courses, just add them without detailed module/section data
          // This avoids excessive data fetching
          const basicCourse: Course = {
            ...courseData,
            modules: [], // Empty modules array for now, will fetch on demand
          };

          availableCourseData.push(basicCourse);
          allCourses.push(basicCourse);
        }
      }

      // Update state
      setCourses(allCourses);
      setEnrolledCourses(enrolledCourseData);
      setAvailableCourses(availableCourseData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user courses:", error);
      setLoading(false);
    }
  };

  // Function to update course data (e.g., when marking a section as complete)
  const updateCourseData = async (
    courseId: string,
    updatedCourseData: Partial<Course>
  ) => {
    // Get the current course to check if we need to move it between lists
    const currentCourse = courses.find((c) => c.id === courseId);
    if (!currentCourse) return;

    // Create the updated course object
    const updatedCourse = { ...currentCourse, ...updatedCourseData };

    // Update the courses list in state
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === courseId ? updatedCourse : course
      )
    );

    // Determine if the course should be moved between lists
    const wasEnrolled = currentCourse.progress && currentCourse.progress > 0;
    const willBeEnrolled = updatedCourse.progress && updatedCourse.progress > 0;

    // Update the appropriate lists
    if (!wasEnrolled && willBeEnrolled) {
      // Move from available to enrolled
      setEnrolledCourses((prev) => [...prev, updatedCourse]);
      setAvailableCourses((prev) => prev.filter((c) => c.id !== courseId));
    } else if (wasEnrolled && !willBeEnrolled) {
      // Move from enrolled to available
      setAvailableCourses((prev) => [...prev, updatedCourse]);
      setEnrolledCourses((prev) => prev.filter((c) => c.id !== courseId));
    } else if (wasEnrolled && willBeEnrolled) {
      // Update in enrolled list
      setEnrolledCourses((prev) =>
        prev.map((course) => (course.id === courseId ? updatedCourse : course))
      );
    } else {
      // Update in available list
      setAvailableCourses((prev) =>
        prev.map((course) => (course.id === courseId ? updatedCourse : course))
      );
    }

    // Update in Firestore if user is authenticated
    if (userId && !useMockData) {
      try {
        const db = getFirestore();

        // Update progress in user's progress subcollection
        if (typeof updatedCourseData.progress !== "undefined") {
          const progressRef = doc(db, "users", userId, "progress", courseId);
          const progressSnapshot = await getDoc(progressRef);

          if (progressSnapshot.exists()) {
            // Update existing progress document
            await updateDoc(progressRef, {
              overallProgress: updatedCourseData.progress,
              updatedAt: new Date().toISOString(),
            });
          } else {
            // Create new progress document
            await updateDoc(progressRef, {
              courseId,
              overallProgress: updatedCourseData.progress,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              completedSections: [],
            });
          }
        }
      } catch (error) {
        console.error("Error updating course data in Firestore:", error);
      }
    }
  };

  // Get a single course by ID
  const getCourseById = (courseId: string): Course | null => {
    const course = courses.find((course) => course.id === courseId);

    // If course not found in state, it might be that we haven't loaded the modules yet
    if (course && course.modules.length === 0 && !useMockData && userId) {
      // Fetch and update the course with modules and sections
      // This is a side effect, but it's okay for this use case
      (async () => {
        try {
          const db = getFirestore();

          // Fetch modules
          const modulesSnapshot = await getDocs(
            collection(db, "courses", courseId, "modules")
          );

          // Map modules and their sections
          const modulesPromises = modulesSnapshot.docs.map(
            async (moduleDoc) => {
              const moduleData = moduleDoc.data();

              // Fetch sections
              const sectionsSnapshot = await getDocs(
                collection(
                  db,
                  "courses",
                  courseId,
                  "modules",
                  moduleDoc.id,
                  "sections"
                )
              );

              const sections = sectionsSnapshot.docs.map((sectionDoc) => ({
                ...sectionDoc.data(),
                completed: false, // Default value
              })) as Section[];

              // Sort sections by order
              sections.sort((a, b) => a.order - b.order);

              return {
                ...moduleData,
                expanded: false,
                sections,
              } as Module;
            }
          );

          const modules = await Promise.all(modulesPromises);

          // Sort modules by order
          modules.sort((a, b) => a.order - b.order);

          // Fetch progress data
          const progressRef = doc(db, "users", userId, "progress", courseId);
          const progressSnapshot = await getDoc(progressRef);

          let progress = 0;
          let completedSections: string[] = [];

          if (progressSnapshot.exists()) {
            const progressData = progressSnapshot.data();
            progress = progressData.overallProgress || 0;
            completedSections = progressData.completedSections || [];

            // Update completion status for sections
            modules.forEach((module) => {
              module.sections.forEach((section) => {
                section.completed = completedSections.includes(section.id);
              });
            });
          }

          // Update the course with modules
          const updatedCourse = {
            ...course,
            modules,
            progress,
          };

          // Update courses array
          setCourses((prevCourses) =>
            prevCourses.map((c) => (c.id === courseId ? updatedCourse : c))
          );

          // Update enrolled or available courses as appropriate
          if (progress > 0) {
            setEnrolledCourses((prevCourses) =>
              prevCourses.map((c) => (c.id === courseId ? updatedCourse : c))
            );
          } else {
            setAvailableCourses((prevCourses) =>
              prevCourses.map((c) => (c.id === courseId ? updatedCourse : c))
            );
          }
        } catch (error) {
          console.error("Error fetching course details:", error);
        }
      })();
    }

    return course || null;
  };

  return (
    <CourseContext.Provider
      value={{
        courses,
        enrolledCourses,
        availableCourses,
        loading,
        updateCourseData,
        getCourseById,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}

export function useCourses(): CourseContextType {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error("useCourses must be used within a CourseProvider");
  }
  return context;
}
