export interface Task {
  id: number;
  title: string;
  description: string | null;
  isCompleted: boolean;
  priority: TaskPriority;
  createdAt: string;
  dueDate: string | null;
  completedAt: string | null;
  userId: number;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string;
}

export interface UpdateTaskRequest {
  title: string;
  description?: string;
  isCompleted: boolean;
  priority: TaskPriority;
  dueDate?: string;
}

export enum TaskPriority {
  Low = 1,
  Medium = 2,
  High = 3
}

export interface TaskFilters {
  sortBy?: string;
  priority?: TaskPriority;
  isCompleted?: boolean;
}

export const PRIORITY_LABELS = {
  [TaskPriority.Low]: 'Low',
  [TaskPriority.Medium]: 'Medium',
  [TaskPriority.High]: 'High'
};

export const PRIORITY_COLORS = {
  [TaskPriority.Low]: '#4caf50',
  [TaskPriority.Medium]: '#ff9800',
  [TaskPriority.High]: '#f44336'
};
