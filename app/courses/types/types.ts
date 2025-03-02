export interface Section {
  id: string;
  title: string;
  order: number;
  completed: boolean;
  description?: string;
  videoId?: string; // Added from mock data
  createdAt: string; // Added from mock data
  updatedAt: string; // Added from mock data
}

export interface Module {
  id: string;
  moduleName: string;
  order: number;
  expanded: boolean;
  sections: Section[];
  description?: string; // Added from mock data
  createdAt: string; // Added from mock data
  updatedAt: string; // Added from mock data
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
