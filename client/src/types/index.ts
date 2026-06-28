export interface User {
  id: number
  email: string
  name: string | null
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: number
  name: string
  description: string | null
  userId: number
  createdAt: string
  updatedAt: string
}

export interface ProjectWithStats extends Project {
  taskCount: number
  tasksTodo: number
  tasksInProgress: number
  tasksDone: number
}

export interface Task {
  id: number
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  projectId: number
  assigneeId: number | null
  assignee?: {
    id: number
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

export type TaskStatus = 'todo' | 'in_progress' | 'done'

export type TaskPriority = 'low' | 'medium' | 'high'

export interface LoginFormData {
  email: string
  password: string
} 

export interface RegisterFormData {
  email: string
  password: string
  name?: string
}

export interface ProjectFormData {
  name: string
  description?: string
}

export interface CreateTaskFormData {
  title: string
  description?: string
  projectId: number
  priority?: TaskPriority
  assigneeId?: number
}

export interface UpdateTaskFormData {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  assigneeId?: number | null
}

export interface AuthResponse {
  user: User
  token: string
}

export interface ApiError {
  message: string
  statusCode: number
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'Do zrobienia',
  in_progress: 'W trakcie',
  done: 'Ukończone',
}

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#ef4444'
}

export const PRIORITIES: { value: TaskPriority; label: string } [] = [
  {value: 'low', label: 'Niski'},
  {value: 'medium', label: 'Średni'},
  {value: 'high', label: 'Wysoki'},
]