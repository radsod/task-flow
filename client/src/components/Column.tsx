import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import TaskCard from './TaskCard'
import type { Task, TaskStatus } from '../types'

interface Props {
  title: string
  status: TaskStatus
  tasks: Task[]
}

const Column = ({ title, status, tasks }: Props) => {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div
      ref={setNodeRef}
      style={{
        ...styles.column,
        backgroundColor: isOver ? '#e0f2fe' : '#f1f5f9',
      }}
    >
      <h2 style={styles.title}>
        {title} <span style={styles.count}>({tasks.length})</span>
      </h2>
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div style={styles.list}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  column: {
    padding: '16px',
    borderRadius: '10px',
    minHeight: '200px',
    transition: 'background-color 0.2s',
  },
  title: {
    fontSize: '16px',
    fontWeight: 700,
    marginBottom: '12px',
    color: '#1e293b',
  },
  count: {
    fontWeight: 400,
    color: '#94a3b8',
    fontSize: '14px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    minHeight: '100px',
  },
}

export default Column