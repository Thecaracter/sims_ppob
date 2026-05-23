import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../store/hooks.ts'
import { fetchProfile } from '../store/slices/auth.slice.ts'
import { fetchBalance, topUp } from '../store/slices/transaction.slice.ts'
import { NotificationModal } from '../components/common/index.ts'
import { Header } from '../components/layout/index.ts'
import profileImage from '../assets/profile.png'
import balanceBackground from '../assets/dashboard/background_saldo.png'
import { MdOutlineVisibility, MdOutlineVisibilityOff, MdOutlineCreditCard } from 'react-icons/md'
import './styles/topup.css'

export const TopUpPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user, token } = useAppSelector((state) => state.auth)
  const { balance } = useAppSelector((state) => state.transaction)

  const [amount, setAmount] = useState<string>('')
    const [successAmount, setSuccessAmount] = useState<number>(0)
  const [showModal, setShowModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
      const [showValidationModal, setShowValidationModal] = useState(false)
      const [validationMessage, setValidationMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showBalance, setShowBalance] = useState(false)

  const quickAmounts = [10000, 20000, 50000, 100000, 250000, 500000]

  useEffect(() => {
    if (token) {
      dispatch(fetchProfile())
      dispatch(fetchBalance())
    }
  }, [token, dispatch])

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    setAmount(value)
  }

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString())
  }

  const handleTopUpClick = () => {
    const numAmount = parseInt(amount)
    
    if (!amount || numAmount <= 0) {
        setValidationMessage('Silahkan masukan nominal top up')
        setShowValidationModal(true)
      return
    }

    if (numAmount < 10000) {
        setValidationMessage('Nominal minimal top up adalah Rp 10.000')
        setShowValidationModal(true)
      return
    }

    if (numAmount > 1000000) {
        setValidationMessage('Nominal maksimal top up adalah Rp 1.000.000')
        setShowValidationModal(true)
      return
    }

    setShowModal(true)
  }

  const handleConfirmTopUp = async () => {
    setIsLoading(true)
    try {
        const topUpAmount = parseInt(amount)
        await dispatch(topUp({ top_up_amount: topUpAmount })).unwrap()
      
      setShowModal(false)
        setSuccessAmount(topUpAmount)
        setShowSuccessModal(true)
      setAmount('')
    } catch (error) {
      setShowModal(false)
      setShowErrorModal(true)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (value: string) => {
    if (!value) return ''
    return new Intl.NumberFormat('id-ID').format(parseInt(value))
  }

  if (!token) {
    navigate('/login')
    return null
  }

  const userName = user ? `${user.first_name} ${user.last_name}` : 'User'

  return (
    <div className="dashboard-wrapper">
      <Header />

      <main className="dashboard-main">
        {/* Top Section: Profile and Balance */}
        <div className="topup-top-section">
          {/* Profile Section */}
          <div className="topup-profile-section">
            <div className="profile-avatar">
              <img 
                src={user?.profile_image || profileImage}
                alt={userName}
                className="profile-avatar-img"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = profileImage
                }}
              />
            </div>
            <div className="profile-info">
              <p className="profile-label">Selamat datang,</p>
              <h1 className="profile-name">{userName}</h1>
            </div>
          </div>

          {/* Balance Card */}
          <div 
            className="balance-card"
            style={{
              backgroundImage: `url(${balanceBackground})`,
              backgroundSize: '150%',
              backgroundPosition: 'right center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div className="balance-content">
              <p className="balance-label">Saldo anda</p>
              <h2 className="balance-amount">
                {showBalance ? `Rp ${balance.toLocaleString('id-ID')}` : 'Rp •••••••'}
              </h2>
              <button className="balance-button" onClick={() => setShowBalance(!showBalance)}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {showBalance ? 'Sembunyikan Saldo' : 'Lihat Saldo'}{' '}
                  {showBalance ? <MdOutlineVisibilityOff size={16} /> : <MdOutlineVisibility size={16} />}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="topup-form-section">
          <div className="topup-form-header">
            <p className="topup-label">Silahkan masukan</p>
            <h2 className="topup-title">Nominal Top Up</h2>
          </div>

          <div className="topup-form-grid">
            {/* Left: Input and Button */}
            <div className="topup-form-left">
              <div className="topup-input-group">
                <div className="topup-input-wrapper">
                  <MdOutlineCreditCard className="topup-input-icon" size={20} />
                  <input
                    type="text"
                    className="topup-input"
                    placeholder="masukan nominal Top Up"
                    value={amount ? formatCurrency(amount) : ''}
                    onChange={handleAmountChange}
                  />
                </div>
              </div>

              <button
                className="btn btn-primary topup-submit-btn"
                onClick={handleTopUpClick}
                disabled={!amount || parseInt(amount) <= 0}
              >
                Top Up
              </button>
            </div>

            {/* Right: Quick Amount Buttons */}
            <div className="topup-form-right">
              <div className="topup-quick-amounts">
                {quickAmounts.map((quickAmount) => (
                  <button
                    key={quickAmount}
                    type="button"
                    className="topup-quick-btn"
                    onClick={() => handleQuickAmount(quickAmount)}
                  >
                    Rp{new Intl.NumberFormat('id-ID').format(quickAmount)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      <NotificationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        type="confirmation"
        message="Anda yakin untuk Top Up sebesar"
        amount={parseInt(amount) || 0}
        confirmText="Ya, lanjutkan"
        cancelText="Batalkan"
        onConfirm={handleConfirmTopUp}
        isLoading={isLoading}
      />

      {/* Success Modal */}
      <NotificationModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        type="success"
        message="Top Up sebesar"
          amount={successAmount}
        confirmText="Kembali ke Beranda"
        showCancelButton={false}
        onConfirm={() => {
          setShowSuccessModal(false)
          navigate('/')
        }}
      />

      {/* Error Modal */}
      <NotificationModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        type="error"
        message="Top Up sebesar"
        amount={parseInt(amount) || 0}
        confirmText="Kembali ke Beranda"
        showCancelButton={false}
        onConfirm={() => {
          setShowErrorModal(false)
          navigate('/')
        }}
      />

        {/* Validation Modal */}
        <NotificationModal
          isOpen={showValidationModal}
          onClose={() => setShowValidationModal(false)}
          type="error"
          message={validationMessage}
          confirmText="Tutup"
          showCancelButton={false}
          onConfirm={() => setShowValidationModal(false)}
        />
      </div>
    )
  }
