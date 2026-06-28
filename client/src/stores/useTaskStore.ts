import { create } from 'zustand'
import { getTask, createTask, updateTask, deleteTask } from '@/services/task.service'
import type { Task, CreateTaskFormData, UpdateTaskFormData, TaskStatus } from '../types'

interface TaskState {
  tasks: Task[]
  isLoading: boolean
  error: string | null
  
  fetchTasks: (projectId: number) => Promise<void>
  addTask: (data: CreateTaskFormData) => Promise<void>
  editTask: (id: number, data: UpdateTaskFormData) => Promise<void>
  removeTask: (id: number) => Promise<void>
  moveTask: (taskId: number, status: TaskStatus) => Promise<void>
  clearError: () => void 
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async (projectId) => {
    set({ isLoading: true, error: null }) 
    try {
      const tasks = await getTask(projectId)
      set({ tasks, isLoading: false })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Wystąpił błąd'
      set({ error: message, isLoading: false})
      throw error
    }
  },

  addTask: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const newTask = await createTask(data)
      set((state) => ({
        tasks: [newTask, ...state.tasks],
        isLoading: false,
      }))
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Wystąpił błąd'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  editTask: async (id, data) => {
   set({ isLoading: true, error: null }) 
   try {
    const updated = await updateTask(id, data)
    set((state) => ({
      tasks: state.tasks.map((p) => (p.id === id ? updated : p)),
      isLoading: false,
    }))
   } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Wystąpił błąd'
    set({ error: message, isLoading: false })
    throw error
   }
  },

  removeTask: async (id) => {
   set({ isLoading: true, error: null }) 
   try {
    await deleteTask(id)
    set((state) => ({
      tasks: state.tasks.filter((p) => p.id !== id),
      isLoading: false,
    }))
   } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Wystąpił błąd'
    set({ error: message, isLoading: false })
    throw error
   }
  },
 
  moveTask: async (taskId, status) => {
    set((state) => ({
      tasks: state.tasks.map((t) => 
        t.id === taskId ? { ...t, status } : t
      ),
    }))
  },

  clearError: () => set({ error: null }), 
}))