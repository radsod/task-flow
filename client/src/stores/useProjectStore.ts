import { create } from 'zustand'
import { getProjects, createProject, updateProject, deleteProject} from '@/services/project.service'
import type { ProjectWithStats, ProjectFormData } from '@/types'

interface ProjectState {
  projects: ProjectWithStats[]
  isLoading: boolean
  error: string | null
  
  fetchProjects: () => Promise<void>
  addProject: (data: ProjectFormData) => Promise<void>
  editProject: (id: number, data: ProjectFormData) => Promise<void>
  removeProject: (id: number) => Promise<void>
  clearError: () => void
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  isLoading: false,
  error: null,

  fetchProjects: async() => {
    set({ isLoading: true, error: null })
    try {
      const projects = await getProjects()
      set({ projects, isLoading: false })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Wystąpił błąd'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  addProject: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const newProject = await createProject(data)
      const projectWithStats: ProjectWithStats = {
        id: newProject.id,
        name: newProject.name,
        description: newProject.description,
        userId: newProject.userId,
        createdAt: newProject.createdAt,
        updatedAt: newProject.updatedAt,
        taskCount: 0,
        tasksTodo: 0,
        tasksInProgress: 0,
        tasksDone: 0,
      }
      set((state) => ({
        projects: [projectWithStats, ...state.projects],
        isLoading: false,
      }))
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Wystąpił błąd'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  editProject: async (id, data) => {
   set({ isLoading: true, error: null }) 
   try {
    const updated = await updateProject(id, data)
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? { ...p, ...updated } as ProjectWithStats : p)),
      isLoading: false,
    }))
   } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Wystąpił błąd'
    set({ error: message, isLoading: false })
    throw error
   }
  },

  removeProject: async (id) => {
   set({ isLoading: true, error: null }) 
   try {
    await deleteProject(id)
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      isLoading: false,
    }))
   } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Wystąpił błąd'
    set({ error: message, isLoading: false })
    throw error
   }
  },

  clearError: () => set({ error: null }),
}))