import { memo, useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppSelector, useAppDispatch } from '../store/hooks.ts'
import { fetchProfile as fetchAuthProfile, logoutUser } from '../store/slices/auth.slice.ts'
import { updateProfile, updateProfilePicture } from '../store/slices/profile.slice.ts'
import { Header } from '../components/layout/index.ts'
import { InputField, Button, Alert } from '../components/common/index.ts'
import { profileUpdateSchema, type ProfileUpdateData } from '../utils/validation.ts'
import { MdOutlineMailOutline, MdModeEdit } from 'react-icons/md'
import { BiUser } from 'react-icons/bi'
import profileImage from '../assets/profile.png'
import './styles/account.css'

const AccountPageComponent = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user, token } = useAppSelector((state) => state.auth)
  const { isLoading, error } = useAppSelector((state) => state.profile)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileUpdateData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
    },
  })

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    dispatch(fetchAuthProfile())
  }, [token, dispatch, navigate])

  useEffect(() => {
    if (user) {
      reset({
        first_name: user.first_name,
        last_name: user.last_name,
      })
      setImagePreview(user.profile_image)
    }
  }, [user, reset])

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleAvatarClick = () => {
    setShowImageModal(true)
  }

  const closeImageModal = () => {
    setShowImageModal(false)
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (!validTypes.includes(file.type.toLowerCase())) {
      setSuccessMessage('Format file harus JPEG atau PNG')
      setTimeout(() => setSuccessMessage(null), 3000)
      return
    }

  
    if (file.size > 100 * 1024) {
      setSuccessMessage('Ukuran file maksimal 100KB')
      setTimeout(() => setSuccessMessage(null), 3000)
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    const result = await dispatch(updateProfilePicture(file))
    if (updateProfilePicture.fulfilled.match(result)) {
      setSuccessMessage('Foto profil berhasil diperbarui')
      dispatch(fetchAuthProfile())
      setTimeout(() => setSuccessMessage(null), 3000)
    }
  }

  const onSubmit = async (data: ProfileUpdateData) => {
    setSuccessMessage(null)
    const result = await dispatch(updateProfile(data))
    if (updateProfile.fulfilled.match(result)) {
      setSuccessMessage('Profil berhasil diperbarui')
      dispatch(fetchAuthProfile())
      setIsEditMode(false)
      setTimeout(() => setSuccessMessage(null), 3000)
    }
  }

  const handleEdit = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault()
    e?.stopPropagation()
    setIsEditMode(true)
  }

  const handleCancel = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault()
    e?.stopPropagation()
    setIsEditMode(false)
    if (user) {
      reset({
        first_name: user.first_name,
        last_name: user.last_name,
      })
    }
  }

  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate('/login')
  }

  if (!token || !user) {
    return null
  }

  const userName = `${user.first_name} ${user.last_name}`

  return (
    <div className="account-wrapper">
      <Header />

      <main className="account-main">
        <div className="account-content">
          <div className="account-profile-section">
            <div className="account-avatar-wrapper">
              <div
                className="account-avatar"
                onClick={handleAvatarClick}
              >
                <img
                  src={imagePreview || user.profile_image || profileImage}
                  alt={userName}
                  className="account-avatar-img"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = profileImage
                  }}
                />
              </div>
              <button
                className="avatar-edit-btn"
                onClick={handleImageClick}
                type="button"
                aria-label="Edit profile picture"
              >
                <MdModeEdit />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            <h1 className="account-name">{userName}</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="account-form">
            <InputField
              type="email"
              placeholder="Email"
              value={user.email}
              icon={<MdOutlineMailOutline />}
              disabled
              className="account-input-disabled"
            />

            <InputField
              type="text"
              placeholder="Nama Depan"
              icon={<BiUser />}
              disabled={!isEditMode}
              {...register('first_name')}
              error={errors.first_name?.message}
            />

            <InputField
              type="text"
              placeholder="Nama Belakang"
              icon={<BiUser />}
              disabled={!isEditMode}
              {...register('last_name')}
              error={errors.last_name?.message}
            />

            {!isEditMode ? (
              <div className="account-button-group">
                <Button type="button" variant="secondary" onClick={handleEdit}>
                  Edit Profile
                </Button>
                <Button type="button" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="account-button-group">
                <Button type="submit" isLoading={isLoading}>
                  Simpan
                </Button>
                <Button type="button" variant="secondary" onClick={handleCancel}>
                  Batalkan
                </Button>
              </div>
            )}
          </form>

          <div className="account-alerts">
            {error && <Alert message={error} type="error" onClose={() => {}} />}
            {successMessage && <Alert message={successMessage} type="success" onClose={() => setSuccessMessage(null)} />}
          </div>
        </div>
      </main>

      {showImageModal && (
        <div className="image-modal-overlay" onClick={closeImageModal}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="image-modal-close" onClick={closeImageModal}>
              ×
            </button>
            <img
              src={imagePreview || user.profile_image || profileImage}
              alt={userName}
              className="image-modal-img"
              onError={(e) => {
                (e.target as HTMLImageElement).src = profileImage
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export const AccountPage = memo(AccountPageComponent)
