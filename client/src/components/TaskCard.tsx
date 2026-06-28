import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Task } from '../types'
import { PRIORITY_COLORS } from '../types'

interface Props {
  task: Task
}

const TaskCard = ({ task }: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    ...styles.card,
    borderLeft: `4px solid ${PRIORITY_COLORS[task.priority]}`,
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <h3 style={styles.title}>{task.title}</h3>
      {task.description && <p style={styles.desc}>{task.description}</p>}
      <div style={styles.meta}>
        <span style={{ color: PRIORITY_COLORS[task.priority], fontWeight: 600 }}>
          {task.priority === 'low' ? 'Niski' : task.priority === 'medium' ? 'Średni' : 'Wysoki'}
        </span>
        {task.assignee && (
          <span style={styles.assignee}>👤 {task.assignee.name}</span>
        )}
      </div>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    padding: '12px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    cursor: 'grab',
    touchAction: 'none',
  },
  title: {
    fontSize: '14px',
    fontWeight: 600,
    margin: '0 0 4px 0',
  },
  desc: {
    fontSize: '12px',
    color: '#64748b',
    margin: '0 0 8px 0',
  },
  meta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '12px',
  },
  assignee: {
    color: '#64748b',
  },
}

export default TaskCard