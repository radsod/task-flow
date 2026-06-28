interface Props {
  message?: string
}

const Spinner = ({ message = 'Ładowanie...' }: Props) => {
  return (
    <div style={styles.wrapper}>
      <div style={styles.spinner} />
      {message && <p style={styles.message}>{message}</p>}
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 0',
    gap: '16px',
  },
  spinner: {
    width: '36px',
    height: '36px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  message: {
    color: '#64748b',
    fontSize: '14px',
    margin: 0,
  },
}

export default Spinner