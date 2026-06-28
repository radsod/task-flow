import { Link } from 'react-router-dom'
import type { ProjectWithStats } from '../types'

interface Props {
  project: ProjectWithStats
}

const ProjectCard = ({ project }: Props) => {
  return (
    <Link to={`/projects/${project.id}`} style={styles.card}>
      <h2 style={styles.title}>{project.name}</h2>
      {project.description && <p style={styles.desc}>{project.description}</p>}
      <div style={styles.stats}>
        <span style={styles.stat}>📋 {project.taskCount} zadań</span>
        <span style={styles.stat}>📝 {project.tasksTodo} todo</span>
        <span style={styles.stat}>⚙️ {project.tasksInProgress} w trakcie</span>
        <span style={styles.stat}>✅ {project.tasksDone} done</span>
      </div>
    </Link>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    display: 'block',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    textDecoration: 'none',
    color: 'inherit',
    border: '1px solid #e2e8f0',
    transition: 'box-shadow 0.2s, transform 0.2s',
  },
  title: {
    fontSize: '18px',
    fontWeight: 700,
    margin: '0 0 8px 0',
  },
  desc: {
    fontSize: '14px',
    color: '#64748b',
    margin: '0 0 16px 0',
  },
  stats: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    fontSize: '13px',
  },
  stat: {
    color: '#475569',
  },
}

export default ProjectCard