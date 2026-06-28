import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTaskStore } from '../stores/useTaskStore'
import KanbanBoard from '../components/KanbanBoard'
import Spinner from '../components/Spinner'
import Navbar from '../components/Navbar'
import { useToast } from '../hooks/useToast'
import { createTask } from '../services/task.service'

const ProjectPage = () => {
  const { id } = useParams<{ id: string }>()
  const { tasks, isLoading, fetchTasks } = useTaskStore()
  const { addToast } = useToast()
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (id) {
      fetchTasks(Number(id)).catch(() => {
        addToast('Nie udało się pobrać zadań', 'error')
      })
    }
  }, [id])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return
    try {
      await createTask({ title, projectId: Number(id), description: description || undefined })
      addToast('Zadanie dodane pomyślnie', 'success')
      setTitle('')
      setDescription('')
      setShowForm(false)
      fetchTasks(Number(id))
    } catch {
      addToast('Nie udało się dodać zadania', 'error')
    }
  }

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1>Tablica Kanban</h1>
          <button onClick={() => setShowForm(!showForm)} style={styles.addBtn}>
            {showForm ? 'Anuluj' : '+ Nowe zadanie'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} style={styles.form}>
            <input
              placeholder="Tytuł zadania"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
              required
            />
            <input
              placeholder="Opis (opcjonalnie)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={styles.input}
            />
            <button type="submit" style={styles.submitBtn}>Dodaj</button>
          </form>
        )}

        {isLoading ? (
          <Spinner message="Pobieranie zadań..." />
        ) : (
          <KanbanBoard tasks={tasks} />
        )}
      </div>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  addBtn: {
    padding: '10px 20px',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  form: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
  },
  input: {
    flex: 1,
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
  },
  submitBtn: {
    padding: '10px 20px',
    backgroundColor: '#22c55e',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
}

export default ProjectPage