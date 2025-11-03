export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  progress: number;
  tasksCompleted: number;
  tasksTotal: number;
  startDate: string;
  endDate: string;
  description?: string;
  team?: string[];
}

export enum ProjectStatus {
  ACTIVE = 'Active',
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  ON_HOLD = 'On Hold'
}

export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  averageProgress: number;
}
