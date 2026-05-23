import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks.ts'
import { fetchProfile } from '../store/slices/auth.slice.ts'
import { fetchBalance, fetchTransactionHistory } from '../store/slices/transaction.slice.ts'
import { Header } from '../components/layout/index.ts'
import { ProfileGreeting } from '../components/common/index.ts'
import profileImage from '../assets/profile.png'
import balanceBackground from '../assets/dashboard/background_saldo.png'
import { MdOutlineVisibility, MdOutlineVisibilityOff } from 'react-icons/md'
import './styles/transaction.css'

export const TransactionPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user, token } = useAppSelector((state) => state.auth)
  const { balance, transactions, isLoading } = useAppSelector((state) => state.transaction)

  const [showBalance, setShowBalance] = useState(false)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    if (token) {
        dispatch(fetchProfile())
        dispatch(fetchBalance())
      loadTransactions()
    }
    }, [token, dispatch])

  const loadTransactions = async () => {
    try {
        const result = await dispatch(fetchTransactionHistory({ offset: 0, limit: 5 })).unwrap()
        setOffset(0)
        setHasMore(result.data.records.length === 5)
    } catch (error) {
      console.error('Failed to load transactions:', error)
    }
  }

  const loadMore = () => {
      if (!isLoading && hasMore) {
        const newOffset = offset + 5
        dispatch(fetchTransactionHistory({ offset: newOffset, limit: 5 }))
          .unwrap()
          .then((result) => {
            setOffset(newOffset)
            setHasMore(result.data.records.length === 5)
          })
          .catch((error) => {
            console.error('Failed to load more transactions:', error)
          })
    }
  }

  const formatCurrency = (amount: number) => {
    const absAmount = Math.abs(amount)
    return `Rp ${absAmount.toLocaleString('id-ID')}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${day} ${month} ${year} ${hours}:${minutes} WIB`
  }

  if (!token) {
    navigate('/login')
    return null
  }

  const userName = user ? `${user.first_name} ${user.last_name}` : 'User'

    const sortedTransactions = [...transactions].sort((a, b) => {
      return new Date(b.created_on).getTime() - new Date(a.created_on).getTime()
    })

  return (
    <div className="dashboard-wrapper">
      <Header />

      <main className="dashboard-main">
        {/* Top Section: Profile and Balance */}
        <div className="transaction-top-section">
          {/* Profile Section */}
          <ProfileGreeting
            userName={userName}
            profileImage={user?.profile_image || profileImage}
            defaultImage={profileImage}
          />

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

        {/* Transaction List Section */}
        <div className="transaction-list-section">
          <h2 className="transaction-list-title">Semua Transaksi</h2>

            {isLoading && sortedTransactions.length === 0 ? (
            <div className="transaction-loading">Loading...</div>
            ) : sortedTransactions.length === 0 ? (
            <div className="transaction-empty">
              <p>Belum ada transaksi</p>
            </div>
          ) : (
            <>
              <div className="transaction-list">
                  {sortedTransactions.map((transaction, index) => (
                    <div key={`${transaction.invoice_number}-${index}`} className="transaction-item">
                    <div className="transaction-amount-wrapper">
                      <span 
                        className={`transaction-amount ${
                            transaction.transaction_type === 'TOPUP' ? 'transaction-amount-positive' : 'transaction-amount-negative'
                        }`}
                      >
                          {transaction.transaction_type === 'TOPUP' ? '+ ' : '– '}{formatCurrency(transaction.total_amount)}
                      </span>
                      <span className="transaction-date">{formatDate(transaction.created_on)}</span>
                    </div>
                    <div className="transaction-details">
                      <span className="transaction-description">{transaction.description}</span>
                    </div>
                  </div>
                ))}
              </div>

              {hasMore && (
                <button 
                  className="transaction-load-more"
                  onClick={loadMore}
                    disabled={isLoading}
                >
                    {isLoading ? 'Loading...' : 'Show more'}
                </button>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
