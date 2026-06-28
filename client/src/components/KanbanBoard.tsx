import { useState } from 'react'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { useTaskStore } from '../stores/useTaskStore'
import { useToast } from '../hooks/useToast'
import Column from './Column'
import TaskCard from './TaskCard'
import type { Task, TaskStatus } from '../types'
import { updateTask } from '../services/task.service'

const COLUMNS: { status: TaskStatus; title: string }[] = [
  { status: 'todo', title: 'Do zrobienia' },
  { status: 'in_progress', title: 'W trakcie' },
  { status: 'done', title: 'Ukończone' },
]

interface Props {
  tasks: Task[]
}

const KanbanBoard = ({ tasks }: Props) => {
  const { moveTask } = useTaskStore()
  const { addToast } = useToast()
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const handleDragStart = (event: any) => {
    const task = tasks.find((t) => t.id === Number(event.active.id))
    if (task) setActiveTask(task)
  }

  const handleDragEnd = async (event: any) => {
    setActiveTask(null)
    const { active, over } = event
    if (!over) return

    const taskId = Number(active.id)
    const newStatus = over.id as TaskStatus

    if (!['todo', 'in_progress', 'done'].includes(newStatus)) return

    moveTask(taskId, newStatus)

    try {
      await updateTask(taskId, { status: newStatus })
    } catch {
      addToast('Nie udało się przenieść zadania', 'error')
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div style={styles.board}>
        {COLUMNS.map((col) => {
          const columnTasks = tasks.filter((t) => t.status === col.status)
          return (
            <Column
              key={col.status}
              title={col.title}
              status={col.status}
              tasks={columnTasks}
            />
          )
        })}
      </div>
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  board: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    minHeight: '400px',
  },
}

export default KanbanBoard