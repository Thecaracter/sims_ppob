import { memo, useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../store/hooks.ts'
import { fetchProfile } from '../store/slices/auth.slice.ts'
import { fetchBalance } from '../store/slices/transaction.slice.ts'
import { bannerService, serviceService } from '../services/index.ts'
import type { Banner } from '../types/banner.types.ts'
import type { Service } from '../types/service.types.ts'
import { Header } from '../components/layout/index.ts'
import { ProfileGreeting } from '../components/common/index.ts'
import profileImage from '../assets/profile.png'
import balanceBackground from '../assets/dashboard/background_saldo.png'
import { MdOutlineVisibility, MdOutlineVisibilityOff } from 'react-icons/md'

const DashboardPageComponent = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user, token } = useAppSelector((state) => state.auth)
  const { balance } = useAppSelector((state) => state.transaction)
    const servicesCarouselRef = useRef<HTMLDivElement>(null)
    const promosCarouselRef = useRef<HTMLDivElement>(null)
    const servicesIsDragging = useRef(false)
    const promosIsDragging = useRef(false)
    const servicesStartX = useRef(0)
    const promosStartX = useRef(0)
    const servicesScrollLeft = useRef(0)
    const promosScrollLeft = useRef(0)

  const [banners, setBanners] = useState<Banner[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showBalance, setShowBalance] = useState(false)

  useEffect(() => {
    if (token) {
      dispatch(fetchProfile())
      dispatch(fetchBalance())
    }
  }, [token, dispatch])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const [bannersResponse, servicesResponse] = await Promise.all([
          bannerService.getBanners(),
          serviceService.getServices(),
        ])
        
        const bannerData = bannersResponse.data || []
        const serviceData = servicesResponse.data || []
        setBanners(bannerData)
        setServices(serviceData)
      } catch {
        setError('Gagal memuat data dashboard')
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchData()
    }
  }, [token])

    const handleServicesMouseDown = (e: React.MouseEvent) => {
      if (!servicesCarouselRef.current) return
      servicesIsDragging.current = true
      servicesStartX.current = e.pageX - servicesCarouselRef.current.offsetLeft
      servicesScrollLeft.current = servicesCarouselRef.current.scrollLeft
      servicesCarouselRef.current.style.cursor = 'grabbing'
  }

    const handleServicesMouseMove = (e: React.MouseEvent) => {
      if (!servicesIsDragging.current || !servicesCarouselRef.current) return
    e.preventDefault()
      const x = e.pageX - servicesCarouselRef.current.offsetLeft
      const walk = (x - servicesStartX.current) * 1.5
      servicesCarouselRef.current.scrollLeft = servicesScrollLeft.current - walk
  }

    const handleServicesMouseUp = () => {
      servicesIsDragging.current = false
      if (servicesCarouselRef.current) servicesCarouselRef.current.style.cursor = 'grab'
    }

    const handlePromosMouseDown = (e: React.MouseEvent) => {
      if (!promosCarouselRef.current) return
      promosIsDragging.current = true
      promosStartX.current = e.pageX - promosCarouselRef.current.offsetLeft
      promosScrollLeft.current = promosCarouselRef.current.scrollLeft
      promosCarouselRef.current.style.cursor = 'grabbing'
    }

    const handlePromosMouseMove = (e: React.MouseEvent) => {
      if (!promosIsDragging.current || !promosCarouselRef.current) return
      e.preventDefault()
      const x = e.pageX - promosCarouselRef.current.offsetLeft
      const walk = (x - promosStartX.current) * 1.5
      promosCarouselRef.current.scrollLeft = promosScrollLeft.current - walk
    }

    const handlePromosMouseUp = () => {
      promosIsDragging.current = false
      if (promosCarouselRef.current) promosCarouselRef.current.style.cursor = 'grab'
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
        <section className="dashboard-top-section">
          <ProfileGreeting
            userName={userName}
            profileImage={user?.profile_image || profileImage}
            defaultImage={profileImage}
          />

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
              <h2 className="balance-amount">{showBalance ? `Rp ${balance.toLocaleString('id-ID')}` : 'Rp •••••••'}</h2>
              <button className="balance-button" onClick={() => setShowBalance(!showBalance)}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {showBalance ? 'Sembunyikan Saldo' : 'Lihat Saldo'} {showBalance ? <MdOutlineVisibilityOff size={16} /> : <MdOutlineVisibility size={16} />}
                </span>
              </button>
            </div>
          </div>
        </section>

        <section className="services-section">
          <div
            className="services-carousel"
              ref={servicesCarouselRef}
              onMouseDown={handleServicesMouseDown}
              onMouseMove={handleServicesMouseMove}
              onMouseUp={handleServicesMouseUp}
              onMouseLeave={handleServicesMouseUp}
          >
            {loading ? (
              <p className="text-gray-text">Memuat layanan...</p>
            ) : services.length > 0 ? (
              services.map((service) => (
                <div
                  key={service.service_code}
                  className="service-card"
                  onClick={() => navigate('/payment', { state: { service } })}
                  style={{ cursor: 'pointer' }}
                >
                  <img src={service.service_icon} alt={service.service_name} className="service-icon-img" />
                  <p className="service-label">{service.service_name}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-text">Tidak ada layanan tersedia</p>
            )}
          </div>
        </section>

        <section className="promos-section">
          <h3 className="promos-title">Temukan promo menarik</h3>
          {loading ? (
            <p className="text-gray-text">Memuat banner...</p>
          ) : error ? (
            <p className="text-red-primary">{error}</p>
          ) : banners.length > 0 ? (
            <div
              className="promos-carousel"
                ref={promosCarouselRef}
                onMouseDown={handlePromosMouseDown}
                onMouseMove={handlePromosMouseMove}
                onMouseUp={handlePromosMouseUp}
                onMouseLeave={handlePromosMouseUp}
            >
              {banners.map((banner, index) => (
                <div key={index} className="promo-card-img-wrapper">
                  <img
                    src={banner.banner_image}
                    alt={banner.banner_name}
                    className="promo-banner-img"
                    draggable={false}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-text">Tidak ada banner tersedia</p>
          )}
        </section>
      </main>
    </div>
  )
}

export const DashboardPage = memo(DashboardPageComponent)
