import { useToast, type ToastType } from '../hooks/useToast'

const ICON: Record<ToastType, string> = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
}

const BG_COLOR: Record<ToastType, string> = {
  success: '#22c55e',
  error: '#ef4444',
  info: '#3b82f6',
}

const ToastContainer = () => {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div style={styles.wrapper}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            ...styles.toast,
            backgroundColor: BG_COLOR[toast.type],
          }}
        >
          <span style={styles.icon}>{ICON[toast.type]}</span>
          <span style={styles.message}>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            style={styles.closeBtn}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    position: 'fixed',
    top: '16px',
    right: '16px',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxWidth: '400px',
  },
  toast: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 500,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    animation: 'slideIn 0.3s ease-out',
  },
  icon: {
    fontSize: '18px',
  },
  message: {
    flex: 1,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '0 4px',
    opacity: 0.8,
  },
}

export default ToastContainer