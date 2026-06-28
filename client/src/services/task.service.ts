import api from "./api"
import type { Task, CreateTaskFormData, UpdateTaskFormData} from '../types'

export const getTask = async(projectId: number): Promise<Task[]> => {
  const response = await api.get<Task[]>(`projects/${projectId}/tasks`)
  return response.data
}

export const createTask = async (data: CreateTaskFormData): Promise<Task> => {
  const response = await api.post<Task>('/tasks', data)
  return response.data
}

export const updateTask = async (id: number, data: UpdateTaskFormData): Promise<Task> => {
  const response = await api.patch<Task>(`/tasks/${id}`, data)
  return response.data
}

export const deleteTask = async (id: number): Promise<void> => {
  await api.delete(`/tasks/${id}`)
}