// Video interface for multiple videos per section
export interface Video {
  id: string;
  duration: number;
}

export interface Section {
  id: string;
  title: string;
  order: number;
  completed: boolean;
  description?: string;
  videoId?: string; // Legacy field for backward compatibility
  duration?: number; // Legacy duration field
  videos?: Video[]; // New field for multiple videos
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: string;
  moduleName: string;
  order: number;
  expanded: boolean;
  sections: Section[];
  description?: string;
  createdAt?: string;
  updatedAt?: string;
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
