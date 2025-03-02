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
