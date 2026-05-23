import { memo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppDispatch } from '../../store/hooks.ts'
import { logoutUser } from '../../store/slices/auth.slice.ts'
import logoImage from '../../assets/Logo.png'

const HeaderComponent = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()

  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate('/login')
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="dashboard-header">
      <div className="dashboard-header-content">
        <div
          className="dashboard-logo-section"
          onClick={() => navigate('/dashboard')}
          style={{ cursor: 'pointer' }}
        >
          <img src={logoImage} alt="SIMS PPOB" className="dashboard-logo" />
          <span className="dashboard-title">SIMS PPOB</span>
        </div>

        <nav className="dashboard-nav">
          <button 
            className={`nav-link ${isActive('/topup') ? 'nav-link-active' : ''}`}
            onClick={() => navigate('/topup')}
          >
            Top Up
          </button>
          <button 
            className={`nav-link ${isActive('/transaction') ? 'nav-link-active' : ''}`}
            onClick={() => navigate('/transaction')}
          >
            Transaction
          </button>
          <button 
            className={`nav-link ${isActive('/account') ? 'nav-link-active' : ''}`}
            onClick={() => navigate('/account')}
          >
            Akun
          </button>
        </nav>
      </div>
    </header>
  )
}

export const Header = memo(HeaderComponent)
