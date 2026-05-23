import React from 'react'

interface AlertProps {
  message: string
  type: 'success' | 'error' | 'info'
  onClose?: () => void
}

export const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
  const safeMessage = typeof message === 'string' ? message : JSON.stringify(message)
  return (
    <div className={`alert alert-${type}`}>
      <p>{safeMessage}</p>
      {onClose && (
        <button className="alert-close" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  )
}
