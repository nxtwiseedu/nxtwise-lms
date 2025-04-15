import { Project, ProjectCategoryWithProjects } from "./types/project";

/**
 * Mock project categories with their projects for development and preview
 */
export const MOCK_CATEGORIES: ProjectCategoryWithProjects[] = [
  {
    id: "cat-1",
    title: "Full-Stack Development",
    description:
      "Projects focused on end-to-end web application development using modern JavaScript frameworks.",
    imageUrl: "/images/categories/fullstack.jpg",
    projects: [
      {
        id: "proj-1",
        categoryId: "cat-1",
        title: "E-commerce Website with Next.js",
        description:
          "Create a fully responsive e-commerce website with product listings, shopping cart, and checkout functionality using React and Next.js.",
        objectives: [
          "Apply responsive design principles",
          "Implement shopping cart functionality",
          "Create secure checkout process",
        ],
        learningOutcomes: [
          "Understanding of e-commerce architecture",
          "Proficiency in responsive design",
          "Knowledge of shopping cart implementations",
        ],
        deliverables: [
          "Source code in GitHub repository",
          "Live demo deployed on Vercel",
          "Documentation of features and architecture",
        ],
        toolsAndTechnologies: [
          "React",
          "Next.js",
          "Tailwind CSS",
          "Firebase (optional)",
        ],
        submissionProcess:
          "Submit GitHub repository link and deployed URL through the submission form.",
        supportInfo:
          "Weekly office hours: Tuesdays 2-4pm. Contact instructor at instructor@example.com for questions.",
        projectBriefUrl: "/files/project-brief-1.pdf",
        videoGuidelines:
          "Create a 3-5 minute walkthrough video demonstrating your website's functionality.",
      },
      {
        id: "proj-2",
        categoryId: "cat-1",
        title: "Backend API Development",
        description:
          "Build a RESTful API using Node.js and Express. Implement authentication, data validation, and connect to a MongoDB database.",
        objectives: [
          "Design RESTful API architecture",
          "Implement JWT authentication",
          "Create database models and controllers",
        ],
        learningOutcomes: [
          "Understanding of REST principles",
          "Knowledge of authentication methods",
          "Proficiency in Express.js",
        ],
        deliverables: [
          "GitHub repository with code",
          "API documentation",
          "Postman collection for testing",
        ],
        toolsAndTechnologies: [
          "Node.js",
          "Express",
          "MongoDB",
          "JWT",
          "Postman",
        ],
        submissionProcess:
          "Submit GitHub repository and documentation through the submission form.",
        supportInfo:
          "Weekly code reviews on Fridays. Join the course Slack channel for questions.",
        projectBriefUrl: "/files/project-brief-4.pdf",
        videoGuidelines:
          "Create a video demonstrating API endpoints using Postman.",
      },
    ],
  },
  {
    id: "cat-2",
    title: "Data Science & Analysis",
    description:
      "Projects involving data processing, analysis, and visualization techniques.",
    imageUrl: "/images/categories/datascience.jpg",
    projects: [
      {
        id: "proj-3",
        categoryId: "cat-2",
        title: "Data Analysis with Python",
        description:
          "Analyze a large dataset using Python and create visualizations to present your findings. Use pandas for data processing and matplotlib/seaborn for visualization.",
        objectives: [
          "Clean and preprocess data",
          "Perform statistical analysis",
          "Create meaningful visualizations",
        ],
        learningOutcomes: [
          "Proficiency in pandas",
          "Understanding of data cleaning techniques",
          "Ability to create informative visualizations",
        ],
        deliverables: [
          "Jupyter notebook with analysis",
          "CSV file with processed data",
          "PDF report summarizing findings",
        ],
        toolsAndTechnologies: [
          "Python",
          "pandas",
          "matplotlib",
          "seaborn",
          "Jupyter",
        ],
        submissionProcess:
          "Submit Jupyter notebook and PDF report through the submission form.",
        supportInfo:
          "Weekly office hours: Thursdays 1-3pm. Join the course Discord for peer support.",
        projectBriefUrl: "/files/project-brief-2.pdf",
        videoGuidelines: "Not required for this project.",
      },
      {
        id: "proj-4",
        categoryId: "cat-2",
        title: "Machine Learning Image Classifier",
        description:
          "Build an image classification model using TensorFlow. Train the model on a provided dataset and deploy it as a web application.",
        objectives: [
          "Preprocess image data",
          "Train classification model",
          "Deploy model as web application",
        ],
        learningOutcomes: [
          "Understanding of image classification techniques",
          "Proficiency in TensorFlow",
          "Knowledge of model deployment",
        ],
        deliverables: [
          "Jupyter notebook with model training",
          "GitHub repository with web application",
          "Deployed web app URL",
        ],
        toolsAndTechnologies: [
          "Python",
          "TensorFlow",
          "Keras",
          "Flask",
          "HTML/CSS/JavaScript",
        ],
        submissionProcess:
          "Submit GitHub repository, Jupyter notebook, and deployment URL through the submission form.",
        supportInfo:
          "AI lab open on Tuesdays and Thursdays. Join the course Discord for peer support.",
        projectBriefUrl: "/files/project-brief-5.pdf",
        videoGuidelines:
          "Create a video demonstrating your model's functionality.",
      },
    ],
  },
  {
    id: "cat-3",
    title: "UI/UX Design",
    description:
      "Projects focused on user interface design, user experience, and prototyping.",
    imageUrl: "/images/categories/uiux.jpg",
    projects: [
      {
        id: "proj-5",
        categoryId: "cat-3",
        title: "Mobile App UI Design",
        description:
          "Design a user interface for a mobile fitness tracking app. Create wireframes, mockups, and a clickable prototype using Figma.",
        objectives: [
          "Apply UI design principles",
          "Create user-centered interface",
          "Develop interactive prototype",
        ],
        learningOutcomes: [
          "Proficiency in Figma",
          "Understanding of mobile UI patterns",
          "Knowledge of prototyping techniques",
        ],
        deliverables: [
          "Figma file with designs",
          "PDF document explaining design decisions",
          "Prototype link",
        ],
        toolsAndTechnologies: ["Figma", "Adobe Color", "UI design principles"],
        submissionProcess:
          "Submit Figma link and documentation through the submission form.",
        supportInfo:
          "Book 1:1 design review sessions through the calendar link in the LMS.",
        projectBriefUrl: "/files/project-brief-3.pdf",
        videoGuidelines:
          "Create a 2-minute video walking through your design process and decisions.",
      },
      {
        id: "proj-8",
        categoryId: "cat-3",
        title: "Design System Creation",
        description:
          "Create a comprehensive design system with components, guidelines, and documentation that ensures consistency across a product suite.",
        objectives: [
          "Define design tokens and principles",
          "Create component library",
          "Document usage guidelines",
        ],
        learningOutcomes: [
          "Understanding of design systems",
          "Proficiency in component organization",
          "Knowledge of design documentation",
        ],
        deliverables: [
          "Design tokens documentation",
          "Component library in Figma",
          "Usage guidelines document",
        ],
        toolsAndTechnologies: ["Figma", "Storybook", "Design principles"],
        submissionProcess:
          "Submit Figma library link and documentation through the submission form.",
        supportInfo: "Design system workshops on Wednesdays at 2pm.",
        projectBriefUrl: "/files/project-brief-8.pdf",
        videoGuidelines:
          "Create a video walkthrough of your design system highlighting key components.",
      },
    ],
  },
];

/**
 * Flatten projects for when a flat list is needed
 */
export const MOCK_PROJECTS: Project[] = MOCK_CATEGORIES.flatMap(
  (category) => category.projects
);
