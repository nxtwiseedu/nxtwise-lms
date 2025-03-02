"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

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

// Define the initial mock data
const mockCourses: Course[] = [
  {
    id: "react-masterclass",
    mainTitle: "React Development Masterclass",
    description:
      "Learn modern React development with hooks, context, and best practices for building production-grade applications.",
    moduleCount: 3,
    totalSections: 12,
    enrollmentCount: 457,
    progress: 25,
    status: "active",
    createdAt: "2023-12-01T00:00:00.000Z",
    updatedAt: "2024-02-15T00:00:00.000Z",
    thumbnail: "/course-react.jpg",
    // Extended data for course view
    modules: [
      {
        id: "react-basics",
        moduleName: "React Basics",
        order: 0,
        expanded: true,
        sections: [
          {
            id: "react-intro",
            title: "Introduction to React",
            order: 0,
            completed: true,
            description:
              "An overview of React and its core concepts. Learn about the virtual DOM, JSX, and component-based architecture.",
          },
          {
            id: "components",
            title: "Components and Props",
            order: 1,
            completed: false,
            description:
              "Understand how to create components and pass data through props. Learn about component composition and best practices.",
          },
          {
            id: "state-lifecycle",
            title: "State and Lifecycle",
            order: 2,
            completed: false,
            description:
              "Learn how to manage state in React components and understand the component lifecycle.",
          },
        ],
      },
      {
        id: "react-hooks",
        moduleName: "Hooks in React",
        order: 1,
        expanded: false,
        sections: [
          {
            id: "hooks-intro",
            title: "Introduction to Hooks",
            order: 0,
            completed: false,
            description:
              "Learn the basics of React Hooks and why they were introduced.",
          },
          {
            id: "useState",
            title: "useState Hook",
            order: 1,
            completed: false,
            description:
              "Learn how to use the useState hook to manage component state.",
          },
          {
            id: "useEffect",
            title: "useEffect Hook",
            order: 2,
            completed: false,
            description:
              "Understand side effects in React and how to manage them with the useEffect hook.",
          },
        ],
      },
      {
        id: "react-advanced",
        moduleName: "Advanced React Patterns",
        order: 2,
        expanded: false,
        sections: [
          {
            id: "context-api",
            title: "Context API",
            order: 0,
            completed: false,
            description:
              "Learn how to use React's Context API to manage global state in your applications.",
          },
          {
            id: "render-props",
            title: "Render Props",
            order: 1,
            completed: false,
            description:
              "Understand the render props pattern for sharing code between React components.",
          },
          {
            id: "custom-hooks",
            title: "Custom Hooks",
            order: 2,
            completed: false,
            description:
              "Learn how to create and use custom hooks to share stateful logic between components.",
          },
        ],
      },
    ],
  },
  {
    id: "nodejs-backend",
    mainTitle: "Node.js Backend Development",
    description:
      "Build scalable backend services using Node.js, Express, and MongoDB. Learn REST API development, authentication, and deployment.",
    moduleCount: 4,
    totalSections: 16,
    enrollmentCount: 342,
    progress: 0,
    status: "active",
    createdAt: "2023-11-15T00:00:00.000Z",
    updatedAt: "2024-01-20T00:00:00.000Z",
    thumbnail: "/course-node.jpg",
    // Extended data for course view
    modules: [
      {
        id: "nodejs-intro",
        moduleName: "Introduction to Node.js",
        order: 0,
        expanded: true,
        sections: [
          {
            id: "nodejs-basics",
            title: "Node.js Basics",
            order: 0,
            completed: false,
            description:
              "An introduction to Node.js and its core concepts. Learn about the event loop, modules, and npm.",
          },
          {
            id: "async-programming",
            title: "Asynchronous Programming",
            order: 1,
            completed: false,
            description:
              "Understand callbacks, promises, and async/await in Node.js.",
          },
        ],
      },
      // Add more modules and sections as needed
    ],
  },
  {
    id: "typescript-fundamentals",
    mainTitle: "TypeScript Fundamentals",
    description:
      "Master TypeScript from the ground up. Learn type systems, interfaces, generics, and how to integrate TypeScript into your projects.",
    moduleCount: 2,
    totalSections: 8,
    enrollmentCount: 215,
    progress: 75,
    status: "active",
    createdAt: "2024-01-10T00:00:00.000Z",
    updatedAt: "2024-02-05T00:00:00.000Z",
    thumbnail: "/course-typescript.jpg",
    // Extended data for course view
    modules: [
      {
        id: "ts-basics",
        moduleName: "TypeScript Basics",
        order: 0,
        expanded: true,
        sections: [
          {
            id: "ts-intro",
            title: "Introduction to TypeScript",
            order: 0,
            completed: true,
            description:
              "Learn why TypeScript exists and how it improves JavaScript development.",
          },
          {
            id: "basic-types",
            title: "Basic Types",
            order: 1,
            completed: true,
            description:
              "Understand TypeScript's type system and how to use basic types.",
          },
        ],
      },
      // Add more modules and sections as needed
    ],
  },
  {
    id: "nextjs-fullstack",
    mainTitle: "Next.js Full Stack Development",
    description:
      "Create modern web applications with Next.js. Learn routing, data fetching, server components, and full-stack development patterns.",
    moduleCount: 5,
    totalSections: 20,
    enrollmentCount: 178,
    progress: 50,
    status: "active",
    createdAt: "2024-01-20T00:00:00.000Z",
    updatedAt: "2024-02-28T00:00:00.000Z",
    thumbnail: "/course-nextjs.jpg",
    // Extended data for course view
    modules: [
      {
        id: "nextjs-intro",
        moduleName: "Introduction to Next.js",
        order: 0,
        expanded: true,
        sections: [
          {
            id: "nextjs-basics",
            title: "Next.js Basics",
            order: 0,
            completed: true,
            description:
              "Learn about Next.js and how it simplifies React development.",
          },
          {
            id: "pages-routing",
            title: "Pages and Routing",
            order: 1,
            completed: false,
            description: "Understand Next.js file-based routing system.",
          },
        ],
      },
      // Add more modules and sections as needed
    ],
  },
];

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
