import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'

const Navbar = () => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()              
    navigate('/login')    
  }

  return (
    <nav style={styles.nav}>
      <Link to="/dashboard" style={styles.logo}>TaskFlow</Link>

      <div style={styles.right}>
        {user?.name && <span style={styles.userName}>{user.name}</span>}
        {user?.email && <span style={styles.userEmail}>{user.email}</span>}
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Wyloguj
        </button>
      </div>
    </nav>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    backgroundColor: '#1e293b',
    color: '#fff',
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#fff',
    textDecoration: 'none',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userName: {
    fontWeight: '600',
  },
  userEmail: {
    color: '#94a3b8',
    fontSize: '14px',
  },
  logoutBtn: {
    padding: '6px 16px',
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
}

export default Navbar
