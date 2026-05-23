import React from 'react'

export interface NotificationModalProps {
  isOpen: boolean
  onClose: () => void
  type?: 'success' | 'error' | 'confirmation'
  icon?: React.ReactNode
  title?: string
  message: string
  amount?: number
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  showCancelButton?: boolean
  isLoading?: boolean
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  type = 'confirmation',
  icon,
  title,
  message,
  amount,
  confirmText = 'Ya, lanjutkan',
  cancelText = 'Batalkan',
  onConfirm,
  showCancelButton = true,
  isLoading = false,
}) => {
  if (!isOpen) return null

  const handleConfirm = () => {
    if (onConfirm && !isLoading) {
      onConfirm()
    }
  }

  const handleCancel = () => {
    if (!isLoading) {
      onClose()
    }
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose()
    }
  }

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500'
      case 'error':
        return 'bg-red-primary'
      case 'confirmation':
        return 'bg-red-primary'
      default:
        return 'bg-red-primary'
    }
  }

  const getDefaultIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )
      case 'error':
        return (
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )
      case 'confirmation':
        return (
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
        )
      default:
        return null
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-card">
          {/* Icon */}
          <div className={`modal-icon ${getIconColor()}`}>
            {icon || getDefaultIcon()}
          </div>

          {/* Title */}
          {title && <h3 className="modal-title">{title}</h3>}

          {/* Message */}
          <p className="modal-message">{message}</p>

          {/* Amount */}
          {amount !== undefined && (
            <p className="modal-amount">
              {formatCurrency(amount)}
              {type === 'confirmation' && ' ?'}
            </p>
          )}

          {/* Success/Error Text */}
          {type === 'success' && (
            <p className="modal-status-text modal-status-success">berhasil!</p>
          )}
          {type === 'error' && (
            <p className="modal-status-text modal-status-error">gagal!</p>
          )}

          {/* Action Buttons */}
          <div className="modal-actions">
            {type === 'confirmation' && onConfirm && (
              <button
                className="btn btn-primary modal-btn"
                onClick={handleConfirm}
                disabled={isLoading}
              >
                {isLoading ? 'Memproses...' : confirmText}
              </button>
            )}

            {showCancelButton && (
              <button
                className="btn btn-secondary modal-btn"
                onClick={handleCancel}
                disabled={isLoading}
              >
                {cancelText}
              </button>
            )}

            {type !== 'confirmation' && (
              <button
                className="btn btn-primary modal-btn"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Tutup
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
