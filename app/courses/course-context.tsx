"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import mockCourses from "./[courseId]/mock/data";

// Types
export interface Section {
  id: string;
  title: string;
  order: number;
  completed: boolean;
  description?: string;
}

export interface Module {
  id: string;
  moduleName: string;
  order: number;
  expanded: boolean;
  sections: Section[];
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
}

export function CourseProvider({ children }: CourseProviderProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Simulate API fetch
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // In a real app, you'd fetch from Firestore or another API
        setCourses(mockCourses);

        // Split courses into enrolled and available
        // In this mock, courses with progress > 0 are considered enrolled
        setEnrolledCourses(
          mockCourses.filter((course) => course.progress && course.progress > 0)
        );
        setAvailableCourses(
          mockCourses.filter(
            (course) => !course.progress || course.progress === 0
          )
        );
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Function to update course data (e.g., when marking a section as complete)
  const updateCourseData = (
    courseId: string,
    updatedCourseData: Partial<Course>
  ) => {
    // Get the current course to check if we need to move it between lists
    const currentCourse = courses.find((c) => c.id === courseId);
    if (!currentCourse) return;

    // Create the updated course object
    const updatedCourse = { ...currentCourse, ...updatedCourseData };

    // Update the courses list
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === courseId ? updatedCourse : course
      )
    );

    // Determine if the course should be moved between lists
    const wasEnrolled = currentCourse.progress && currentCourse.progress > 0;
    const willBeEnrolled = updatedCourse.progress && updatedCourse.progress > 0;

    // Only move if enrollment status changes
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
  };

  // Get a single course by ID
  const getCourseById = (courseId: string): Course | null => {
    return courses.find((course) => course.id === courseId) || null;
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
