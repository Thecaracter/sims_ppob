import { memo } from 'react'
import type { ReactNode } from 'react'
import { Alert } from '../common/index.ts'

interface AuthLayoutProps {
  children: ReactNode
  illustration: string
  error?: string | null
  success?: string | null
  onAlertClose?: () => void
  onSuccessClose?: () => void
}

const AuthLayoutComponent = ({ children, illustration, error, success, onAlertClose, onSuccessClose }: AuthLayoutProps) => {
  return (
    <div className="auth-wrapper">
      <div className="auth-form-section">
        <div className="auth-card">
          {children}
          {error && <Alert message={error} type="error" onClose={onAlertClose || (() => {})} />}
          {success && <Alert message={success} type="success" onClose={onSuccessClose || (() => {})} />}
        </div>
      </div>

      <div className="auth-illustration-section">
        <img src={illustration} alt="SIMS PPOB Illustration" className="auth-illustration" />
      </div>
    </div>
  )
}

export const AuthLayout = memo(AuthLayoutComponent)
