import { Course } from "../../types/types";

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
        description: "Learn the foundational concepts of React development",
        order: 0,
        expanded: true,
        createdAt: "2023-12-01T00:00:00.000Z",
        updatedAt: "2024-01-10T00:00:00.000Z",
        sections: [
          {
            id: "react-intro",
            title: "Introduction to React",
            order: 0,
            completed: true,
            description:
              "An overview of React and its core concepts. Learn about the virtual DOM, JSX, and component-based architecture.",
            videoId: "react-intro-vid",
            createdAt: "2023-12-01T00:00:00.000Z",
            updatedAt: "2023-12-05T00:00:00.000Z",
          },
          {
            id: "components",
            title: "Components and Props",
            order: 1,
            completed: false,
            description:
              "Understand how to create components and pass data through props. Learn about component composition and best practices.",
            videoId: "react-components-vid",
            createdAt: "2023-12-06T00:00:00.000Z",
            updatedAt: "2023-12-10T00:00:00.000Z",
          },
          {
            id: "state-lifecycle",
            title: "State and Lifecycle",
            order: 2,
            completed: false,
            description:
              "Learn how to manage state in React components and understand the component lifecycle.",
            videoId: "react-state-vid",
            createdAt: "2023-12-11T00:00:00.000Z",
            updatedAt: "2023-12-15T00:00:00.000Z",
          },
        ],
      },
      {
        id: "react-hooks",
        moduleName: "Hooks in React",
        description: "Master React Hooks for functional component development",
        order: 1,
        expanded: false,
        createdAt: "2023-12-20T00:00:00.000Z",
        updatedAt: "2024-01-15T00:00:00.000Z",
        sections: [
          {
            id: "hooks-intro",
            title: "Introduction to Hooks",
            order: 0,
            completed: false,
            description:
              "Learn the basics of React Hooks and why they were introduced.",
            videoId: "hooks-intro-vid",
            createdAt: "2023-12-20T00:00:00.000Z",
            updatedAt: "2023-12-25T00:00:00.000Z",
          },
          {
            id: "useState",
            title: "useState Hook",
            order: 1,
            completed: false,
            description:
              "Learn how to use the useState hook to manage component state.",
            videoId: "hooks-usestate-vid",
            createdAt: "2023-12-26T00:00:00.000Z",
            updatedAt: "2023-12-30T00:00:00.000Z",
          },
          {
            id: "useEffect",
            title: "useEffect Hook",
            order: 2,
            completed: false,
            description:
              "Understand side effects in React and how to manage them with the useEffect hook.",
            videoId: "hooks-useeffect-vid",
            createdAt: "2024-01-01T00:00:00.000Z",
            updatedAt: "2024-01-05T00:00:00.000Z",
          },
        ],
      },
      {
        id: "react-advanced",
        moduleName: "Advanced React Patterns",
        description: "Explore complex patterns for scalable React applications",
        order: 2,
        expanded: false,
        createdAt: "2024-01-10T00:00:00.000Z",
        updatedAt: "2024-02-10T00:00:00.000Z",
        sections: [
          {
            id: "context-api",
            title: "Context API",
            order: 0,
            completed: false,
            description:
              "Learn how to use React's Context API to manage global state in your applications.",
            videoId: "context-api-vid",
            createdAt: "2024-01-10T00:00:00.000Z",
            updatedAt: "2024-01-15T00:00:00.000Z",
          },
          {
            id: "render-props",
            title: "Render Props",
            order: 1,
            completed: false,
            description:
              "Understand the render props pattern for sharing code between React components.",
            videoId: "render-props-vid",
            createdAt: "2024-01-16T00:00:00.000Z",
            updatedAt: "2024-01-20T00:00:00.000Z",
          },
          {
            id: "custom-hooks",
            title: "Custom Hooks",
            order: 2,
            completed: false,
            description:
              "Learn how to create and use custom hooks to share stateful logic between components.",
            videoId: "custom-hooks-vid",
            createdAt: "2024-01-21T00:00:00.000Z",
            updatedAt: "2024-01-25T00:00:00.000Z",
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
        description: "Get started with Node.js and understand its ecosystem",
        order: 0,
        expanded: true,
        createdAt: "2023-11-15T00:00:00.000Z",
        updatedAt: "2023-12-01T00:00:00.000Z",
        sections: [
          {
            id: "nodejs-basics",
            title: "Node.js Basics",
            order: 0,
            completed: false,
            description:
              "An introduction to Node.js and its core concepts. Learn about the event loop, modules, and npm.",
            videoId: "nodejs-basics-vid",
            createdAt: "2023-11-15T00:00:00.000Z",
            updatedAt: "2023-11-20T00:00:00.000Z",
          },
          {
            id: "async-programming",
            title: "Asynchronous Programming",
            order: 1,
            completed: false,
            description:
              "Understand callbacks, promises, and async/await in Node.js.",
            videoId: "nodejs-async-vid",
            createdAt: "2023-11-21T00:00:00.000Z",
            updatedAt: "2023-11-25T00:00:00.000Z",
          },
        ],
      },
      // Additional modules would be added here
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
        description: "Learn the fundamentals of TypeScript",
        order: 0,
        expanded: true,
        createdAt: "2024-01-10T00:00:00.000Z",
        updatedAt: "2024-01-20T00:00:00.000Z",
        sections: [
          {
            id: "ts-intro",
            title: "Introduction to TypeScript",
            order: 0,
            completed: true,
            description:
              "Learn why TypeScript exists and how it improves JavaScript development.",
            videoId: "ts-intro-vid",
            createdAt: "2024-01-10T00:00:00.000Z",
            updatedAt: "2024-01-15T00:00:00.000Z",
          },
          {
            id: "basic-types",
            title: "Basic Types",
            order: 1,
            completed: true,
            description:
              "Understand TypeScript's type system and how to use basic types.",
            videoId: "ts-basic-types-vid",
            createdAt: "2024-01-16T00:00:00.000Z",
            updatedAt: "2024-01-20T00:00:00.000Z",
          },
        ],
      },
      // Additional modules would be added here
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
        description: "Get started with the Next.js framework",
        order: 0,
        expanded: true,
        createdAt: "2024-01-20T00:00:00.000Z",
        updatedAt: "2024-02-01T00:00:00.000Z",
        sections: [
          {
            id: "nextjs-basics",
            title: "Next.js Basics",
            order: 0,
            completed: true,
            description:
              "Learn about Next.js and how it simplifies React development.",
            videoId: "nextjs-basics-vid",
            createdAt: "2024-01-20T00:00:00.000Z",
            updatedAt: "2024-01-25T00:00:00.000Z",
          },
          {
            id: "pages-routing",
            title: "Pages and Routing",
            order: 1,
            completed: false,
            description: "Understand Next.js file-based routing system.",
            videoId: "nextjs-routing-vid",
            createdAt: "2024-01-26T00:00:00.000Z",
            updatedAt: "2024-02-01T00:00:00.000Z",
          },
        ],
      },
      // Additional modules would be added here
    ],
  },
];

export default mockCourses;
