/**
 * Project service for interacting with Firebase
 * Revised to support hierarchical project structure
 */
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { getCurrentUser, convertDoc, getFileUrl } from "@/app/lib/client";
import {
  Project,
  ProjectWithStatus,
  ProjectStatus,
  ProjectFilterOptions,
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
    const categoriesQuery = query(categoriesRef, orderBy("order", "asc"));
    const categoriesSnapshot = await getDocs(categoriesQuery);

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
export const getUserProjectsByCategory = async (
  filterOptions: ProjectFilterOptions = {
    sortBy: "deadline",
    sortDirection: "asc",
  }
): Promise<ProjectCategoryWithProjects[]> => {
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
    const projectsMap = new Map<string, ProjectWithStatus>();
    const categoryIds = new Set<string>();

    for (const projectId of projectIds) {
      const projectDoc = await getDoc(doc(db, "projects", projectId));

      if (projectDoc.exists()) {
        const project = convertDoc<Project>(projectDoc);
        categoryIds.add(project.categoryId);

        // Get user's submission for this project (if any)
        const submissionsRef = collection(db, "submissions");
        const submissionQuery = query(
          submissionsRef,
          where("projectId", "==", project.id),
          where("userId", "==", currentUser.uid)
        );

        const submissionSnapshot = await getDocs(submissionQuery);

        // Determine project status
        let status: ProjectStatus = "notStarted";
        if (submissionSnapshot.size > 0) {
          status = "submitted";
        } else {
          // Check if user has interacted with project (e.g., opened it)
          const interactionRef = collection(db, "projectInteractions");
          const interactionQuery = query(
            interactionRef,
            where("projectId", "==", project.id),
            where("userId", "==", currentUser.uid)
          );

          const interactionSnapshot = await getDocs(interactionQuery);
          if (interactionSnapshot.size > 0) {
            status = "inProgress";
          }
        }

        // Calculate days remaining until deadline
        const deadline = new Date(project.deadline);
        const today = new Date();
        const daysRemaining = Math.ceil(
          (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        projectsMap.set(project.id, {
          ...project,
          status,
          daysRemaining,
        });
      }
    }

    // Apply filtering by status if specified
    if (filterOptions.status) {
      for (const [id, project] of projectsMap.entries()) {
        if (project.status !== filterOptions.status) {
          projectsMap.delete(id);
        }
      }
    }

    // Filter by category if specified
    if (filterOptions.categoryId) {
      for (const [id, project] of projectsMap.entries()) {
        if (project.categoryId !== filterOptions.categoryId) {
          projectsMap.delete(id);
        }
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

        // Skip categories with no visible projects (after filtering)
        if (categoryProjects.length === 0) {
          continue;
        }

        // Sort projects within the category
        const sortedProjects = [...categoryProjects];
        if (filterOptions.sortBy === "deadline") {
          sortedProjects.sort((a, b) => {
            return filterOptions.sortDirection === "asc"
              ? a.daysRemaining - b.daysRemaining
              : b.daysRemaining - a.daysRemaining;
          });
        } else if (filterOptions.sortBy === "title") {
          sortedProjects.sort((a, b) => {
            return filterOptions.sortDirection === "asc"
              ? a.title.localeCompare(b.title)
              : b.title.localeCompare(a.title);
          });
        } else if (filterOptions.sortBy === "status") {
          const statusOrder = { submitted: 0, inProgress: 1, notStarted: 2 };
          sortedProjects.sort((a, b) => {
            return filterOptions.sortDirection === "asc"
              ? statusOrder[a.status] - statusOrder[b.status]
              : statusOrder[b.status] - statusOrder[a.status];
          });
        } else {
          // Default to sorting by project order within category
          sortedProjects.sort((a, b) => a.order - b.order);
        }

        categories.push({
          ...category,
          projects: sortedProjects,
        });
      }
    }

    // Sort categories by order
    categories.sort((a, b) => a.order - b.order);

    return categories;
  } catch (error) {
    console.error("Error fetching user projects by category:", error);
    throw error;
  }
};

/**
 * Get a flat list of projects assigned to the current user
 */
export const getUserProjects = async (
  filterOptions: ProjectFilterOptions = {
    sortBy: "deadline",
    sortDirection: "asc",
  }
): Promise<ProjectWithStatus[]> => {
  try {
    const categorizedProjects = await getUserProjectsByCategory(filterOptions);

    // Flatten the projects from all categories
    const allProjects: ProjectWithStatus[] = [];
    for (const category of categorizedProjects) {
      allProjects.push(...category.projects);
    }

    // Apply global sorting if needed
    if (filterOptions.sortBy === "deadline") {
      allProjects.sort((a, b) => {
        return filterOptions.sortDirection === "asc"
          ? a.daysRemaining - b.daysRemaining
          : b.daysRemaining - a.daysRemaining;
      });
    } else if (filterOptions.sortBy === "title") {
      allProjects.sort((a, b) => {
        return filterOptions.sortDirection === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      });
    } else if (filterOptions.sortBy === "status") {
      const statusOrder = { submitted: 0, inProgress: 1, notStarted: 2 };
      allProjects.sort((a, b) => {
        return filterOptions.sortDirection === "asc"
          ? statusOrder[a.status] - statusOrder[b.status]
          : statusOrder[b.status] - statusOrder[a.status];
      });
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

/**
 * Record that a user has interacted with a project (viewed it)
 */
export const recordProjectInteraction = async (
  projectId: string
): Promise<void> => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    // Check if interaction already exists
    const interactionRef = collection(db, "projectInteractions");
    const interactionQuery = query(
      interactionRef,
      where("projectId", "==", projectId),
      where("userId", "==", currentUser.uid)
    );

    const interactionSnapshot = await getDocs(interactionQuery);

    if (interactionSnapshot.empty) {
      // Create new interaction record
      const newInteractionRef = doc(collection(db, "projectInteractions"));
      await setDoc(newInteractionRef, {
        projectId,
        userId: currentUser.uid,
        firstViewedAt: Timestamp.now(),
        lastViewedAt: Timestamp.now(),
        viewCount: 1,
      });
    } else {
      // Update existing interaction
      const interactionDoc = interactionSnapshot.docs[0];
      await updateDoc(interactionDoc.ref, {
        lastViewedAt: Timestamp.now(),
        viewCount: interactionDoc.data().viewCount + 1,
      });
    }
  } catch (error) {
    console.error("Error recording project interaction:", error);
  }
};
