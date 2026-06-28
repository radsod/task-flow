import api from "./api"
import type { Project, ProjectWithStats, ProjectFormData } from "@/types"

export const getProjects = async (): Promise<ProjectWithStats[]> => {
  const response = await api.get<ProjectWithStats[]>(`/projects`)
  return response.data
}

export const getProject = async (id: number): Promise<Project> => {
  const response = await api.get<Project>(`/projects/${id}`)
  return response.data
}

export const createProject = async (data: ProjectFormData): Promise<Project> => {
  const response = await api.post<Project>('/projects', data)
  return response.data
}

export const updateProject = async(id: number, data: ProjectFormData): Promise<Project> => {
  const response = await api.patch<Project>(`/projects/${id}`, data)
  return response.data
}

export const deleteProject = async(id:number): Promise<void> => {
  await api.delete(`/projects/${id}`)
}