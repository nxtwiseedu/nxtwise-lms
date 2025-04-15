/**
 * Project service for interacting with Firebase
 * Simplified to support basic project structure without status tracking
 */
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { getCurrentUser, convertDoc, getFileUrl } from "@/app/lib/client";
import {
  Project,
  UserProject,
  ProjectCategory,
  ProjectCategoryWithProjects,
} from "../types/project";

/**
 * Get all project categories
 */
export const getProjectCategories = async (): Promise<ProjectCategory[]> => {
  try {
    const categoriesRef = collection(db, "projectCategories");
    const categoriesSnapshot = await getDocs(categoriesRef);

    const categories: ProjectCategory[] = [];
    categoriesSnapshot.forEach((doc) => {
      categories.push(convertDoc<ProjectCategory>(doc));
    });

    return categories;
  } catch (error) {
    console.error("Error fetching project categories:", error);
    throw error;
  }
};

/**
 * Get a specific project category by ID
 */
export const getProjectCategoryById = async (
  categoryId: string
): Promise<ProjectCategory | null> => {
  try {
    const categoryRef = doc(db, "projectCategories", categoryId);
    const categorySnap = await getDoc(categoryRef);

    if (categorySnap.exists()) {
      return convertDoc<ProjectCategory>(categorySnap);
    }

    return null;
  } catch (error) {
    console.error("Error fetching project category:", error);
    throw error;
  }
};

/**
 * Get projects assigned to the current user, organized by categories
 */
export const getUserProjectsByCategory = async (): Promise<
  ProjectCategoryWithProjects[]
> => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    // Get user-project assignments
    const userProjectsRef = collection(db, "userProjects");
    const userProjectsQuery = query(
      userProjectsRef,
      where("userId", "==", currentUser.uid)
    );

    const userProjectsSnapshot = await getDocs(userProjectsQuery);

    if (userProjectsSnapshot.empty) {
      return [];
    }

    // Extract project IDs from user-project assignments
    const projectIds = userProjectsSnapshot.docs.map((doc) => {
      const data = doc.data() as UserProject;
      return data.projectId;
    });

    if (!projectIds.length) {
      return [];
    }

    // Get all assigned projects
    const projectsMap = new Map<string, Project>();
    const categoryIds = new Set<string>();

    for (const projectId of projectIds) {
      const projectDoc = await getDoc(doc(db, "projects", projectId));

      if (projectDoc.exists()) {
        const project = convertDoc<Project>(projectDoc);
        categoryIds.add(project.categoryId);
        projectsMap.set(project.id, project);
      }
    }

    // Get categories and organize projects by category
    const categories: ProjectCategoryWithProjects[] = [];

    for (const categoryId of categoryIds) {
      const categoryDoc = await getDoc(
        doc(db, "projectCategories", categoryId)
      );

      if (categoryDoc.exists()) {
        const category = convertDoc<ProjectCategory>(categoryDoc);

        // Get all projects for this category
        const categoryProjects = Array.from(projectsMap.values()).filter(
          (project) => project.categoryId === categoryId
        );

        // Skip categories with no visible projects
        if (categoryProjects.length === 0) {
          continue;
        }

        categories.push({
          ...category,
          projects: categoryProjects,
        });
      }
    }

    return categories;
  } catch (error) {
    console.error("Error fetching user projects by category:", error);
    throw error;
  }
};

/**
 * Get a flat list of projects assigned to the current user
 */
export const getUserProjects = async (): Promise<Project[]> => {
  try {
    const categorizedProjects = await getUserProjectsByCategory();

    // Flatten the projects from all categories
    const allProjects: Project[] = [];
    for (const category of categorizedProjects) {
      allProjects.push(...category.projects);
    }

    return allProjects;
  } catch (error) {
    console.error("Error fetching user projects:", error);
    throw error;
  }
};

/**
 * Get a project by ID
 */
export const getProjectById = async (
  projectId: string
): Promise<Project | null> => {
  try {
    const projectRef = doc(db, "projects", projectId);
    const projectSnap = await getDoc(projectRef);

    if (projectSnap.exists()) {
      const projectData = convertDoc<Project>(projectSnap);

      // If project has a brief URL that's a storage path, get the download URL
      if (
        projectData.projectBriefUrl &&
        projectData.projectBriefUrl.startsWith("projects/")
      ) {
        try {
          projectData.projectBriefUrl = await getFileUrl(
            projectData.projectBriefUrl
          );
        } catch (error) {
          console.error("Error getting project brief URL:", error);
        }
      }

      return projectData;
    }

    return null;
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
};

/**
 * Check if current user can access a project
 */
export const canUserAccessProject = async (
  projectId: string
): Promise<boolean> => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return false;
    }

    // Check if project is assigned to user
    const userProjectsRef = collection(db, "userProjects");
    const userProjectQuery = query(
      userProjectsRef,
      where("userId", "==", currentUser.uid),
      where("projectId", "==", projectId)
    );

    const userProjectSnapshot = await getDocs(userProjectQuery);
    return !userProjectSnapshot.empty;
  } catch (error) {
    console.error("Error checking project access:", error);
    return false;
  }
};
