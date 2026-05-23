import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks.ts'
import { fetchProfile } from '../store/slices/auth.slice.ts'
import { fetchBalance } from '../store/slices/transaction.slice.ts'
import { transactionService } from '../services/index.ts'
import { Header } from '../components/layout/index.ts'
import { NotificationModal } from '../components/common/index.ts'
import type { Service } from '../types/service.types.ts'
import profileImage from '../assets/profile.png'
import balanceBackground from '../assets/dashboard/background_saldo.png'
import { MdOutlineVisibility, MdOutlineVisibilityOff, MdMoney } from 'react-icons/md'
import './styles/payment.css'

export const PaymentPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { user, token } = useAppSelector((state) => state.auth)
  const { balance } = useAppSelector((state) => state.transaction)

  const [showBalance, setShowBalance] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)

  const service = location.state?.service as Service | undefined

  useEffect(() => {
    if (token) {
      dispatch(fetchProfile())
      dispatch(fetchBalance())
    }
  }, [token, dispatch])

  useEffect(() => {
    if (!service) {
      navigate('/dashboard')
    }
  }, [service, navigate])

  const handlePaymentClick = () => {
    if (!service) return

    if (balance < service.service_tariff) {
      setShowErrorModal(true)
      return
    }

    setShowConfirmModal(true)
  }

  const handleConfirmPayment = async () => {
    if (!service || isProcessing) return

    setShowConfirmModal(false)
    setIsProcessing(true)

    try {
        await transactionService.createTransaction({
        service_code: service.service_code,
      })

      await dispatch(fetchBalance())

      setShowSuccessModal(true)
    } catch (error: any) {
      setShowErrorModal(true)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!token) {
    navigate('/login')
    return null
  }

  if (!service) {
    return null
  }

  const userName = user ? `${user.first_name} ${user.last_name}` : 'User'

  return (
    <div className="payment-wrapper">
      <Header />

      <main className="payment-main">
        {/* Top Section: Profile and Balance */}
        <div className="payment-top-section">
          {/* Profile Section */}
          <div className="payment-profile-section">
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

        {/* Payment Section */}
        <div className="payment-section">
          <div className="payment-info">
            <p className="payment-label">PemBayaran</p>
            <div className="payment-service">
              <img src={service.service_icon} alt={service.service_name} className="payment-service-icon" />
              <h2 className="payment-service-name">{service.service_name}</h2>
            </div>
          </div>

          <div className="payment-form">
            <div className="payment-input-group">
              <div className="payment-input-wrapper">
                <MdMoney className="payment-input-icon" size={20} />
                <input
                  type="text"
                  value={service.service_tariff.toLocaleString('id-ID')}
                  readOnly
                  className="payment-input"
                />
              </div>
            </div>

            <button
              className="btn btn-primary payment-submit-btn"
              onClick={handlePaymentClick}
              disabled={isProcessing || balance < service.service_tariff}
            >
              Bayar
            </button>
          </div>
        </div>
      </main>

      <NotificationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        type="confirmation"
        message={`Beli ${service.service_name} senilai`}
        amount={service.service_tariff}
        confirmText="Ya, lanjutkan"
        cancelText="Batalkan"
        onConfirm={handleConfirmPayment}
        isLoading={isProcessing}
      />

      <NotificationModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        type="success"
        message={`Pembayaran ${service.service_name} sebesar`}
        amount={service.service_tariff}
        confirmText="Kembali ke Beranda"
        showCancelButton={false}
        onConfirm={() => {
          setShowSuccessModal(false)
          navigate('/dashboard')
        }}
      />

      <NotificationModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        type="error"
        message={balance < service.service_tariff 
          ? 'Saldo tidak mencukupi untuk melakukan pembayaran'
          : `Pembayaran ${service.service_name} gagal`}
        amount={service.service_tariff}
        confirmText="Kembali ke Beranda"
        showCancelButton={false}
        onConfirm={() => {
          setShowErrorModal(false)
          navigate('/dashboard')
        }}
      />
    </div>
  )
}
