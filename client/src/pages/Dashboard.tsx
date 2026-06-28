import { useEffect, useState } from 'react'
import { useProjectStore } from '../stores/useProjectStore'
import ProjectCard from '../components/ProjectCard'
import Spinner from '../components/Spinner'
import Navbar from '../components/Navbar'
import { useToast } from '../hooks/useToast'
import { createProject } from '../services/project.service'

const Dashboard = () => {
  const { projects, isLoading, fetchProjects } = useProjectStore()
  const { addToast } = useToast()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    fetchProjects().catch(() => {
      addToast('Nie udało się pobrać projektów', 'error')
    })
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createProject({ name, description: description || undefined })
      addToast('Projekt utworzony pomyślnie', 'success')
      setName('')
      setDescription('')
      setShowForm(false)
      fetchProjects()
    } catch {
      addToast('Nie udało się utworzyć projektu', 'error')
    }
  }

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1>Moje projekty</h1>
          <button onClick={() => setShowForm(!showForm)} style={styles.addBtn}>
            {showForm ? 'Anuluj' : '+ Nowy projekt'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} style={styles.form}>
            <input
              placeholder="Nazwa projektu"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              required
            />
            <input
              placeholder="Opis (opcjonalnie)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={styles.input}
            />
            <button type="submit" style={styles.submitBtn}>Utwórz</button>
          </form>
        )}

        {isLoading && <Spinner message="Pobieranie projektów..." />}

        {!isLoading && projects.length === 0 && (
          <p style={styles.empty}>Nie masz jeszcze żadnych projektów. Stwórz pierwszy!</p>
        )}

        <div style={styles.grid}>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '24px',
    maxWidth: '1000px',
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
  },
  empty: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: '16px',
    marginTop: '48px',
  },
}

export default Dashboard