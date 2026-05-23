import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts'
import { loginUser, clearError } from '../../store/slices/auth.slice.ts'
import { AuthForm } from '../../components/forms/index.ts'
import { AuthLayout } from '../../components/auth/index.ts'
import { loginSchema, type LoginFormData } from '../../utils/validation.ts'
import { EmailIcon, PasswordIcon } from '../../utils/auth-icons.tsx'
import heroImage from '../../assets/Illustrasi_Login.png'

export const LoginPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [alertMessage, setAlertMessage] = useState<string | null>(null)
  const { isLoading, error } = useAppSelector((state) => state.auth)

  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setAlertMessage(null)
    const result = await dispatch(loginUser(data))
    if (result.meta.requestStatus === 'fulfilled') {
      setAlertMessage('Login berhasil!')
      setTimeout(() => navigate('/dashboard'), 1500)
    }
  }

  const fields = [
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Masukkan email Anda', icon: <EmailIcon /> },
    { name: 'password', label: 'Password', type: 'password', placeholder: 'Masukkan password Anda', icon: <PasswordIcon /> },
  ]

  return (
    <AuthLayout 
      illustration={heroImage} 
      error={error} 
      success={alertMessage}
      onAlertClose={() => dispatch(clearError())}
      onSuccessClose={() => setAlertMessage(null)}
    >
      <AuthForm
        title="SIMS PPOB"
        subtitle="Masuk atau buat akun untuk memulai"
        fields={fields}
        onSubmit={handleSubmit(onSubmit)}
        register={register}
        errors={errors}
        isLoading={isLoading}
        buttonText="Masuk"
        footerText={
          <>
            Belum punya akun? <Link to="/register">Daftar di sini</Link>
          </>
        }
      />
    </AuthLayout>
  )
}
