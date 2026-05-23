import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts'
import { registerUser, clearError } from '../../store/slices/auth.slice.ts'
import { AuthForm } from '../../components/forms/index.ts'
import { AuthLayout } from '../../components/auth/index.ts'
import { registerSchema, type RegisterFormData } from '../../utils/validation.ts'
import { EmailIcon, PasswordIcon, UserIcon } from '../../utils/auth-icons.tsx'
import heroImage from '../../assets/Illustrasi_login.png'

export const RegisterPage = () => {
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
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setAlertMessage(null)
    const result = await dispatch(
      registerUser({
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        password: data.password,
      })
    )
    if (result.meta.requestStatus === 'fulfilled') {
      setAlertMessage('Registrasi berhasil! Silahkan login')
      setTimeout(() => navigate('/login'), 1500)
    }
  }

  const fields = [
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Masukkan email Anda', icon: <EmailIcon /> },
    { name: 'first_name', label: 'Nama Depan', type: 'text', placeholder: 'Masukkan nama depan', icon: <UserIcon /> },
    { name: 'last_name', label: 'Nama Belakang', type: 'text', placeholder: 'Masukkan nama belakang', icon: <UserIcon /> },
    { name: 'password', label: 'Password', type: 'password', placeholder: 'Masukkan password Anda', icon: <PasswordIcon /> },
    { name: 'confirmPassword', label: 'Konfirmasi Password', type: 'password', placeholder: 'Konfirmasi password Anda', icon: <PasswordIcon /> },
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
        subtitle="Lengkapi data untuk membuat akun"
        fields={fields}
        onSubmit={handleSubmit(onSubmit)}
        register={register}
        errors={errors}
        isLoading={isLoading}
        buttonText="Daftar"
        footerText={
          <>
            Sudah punya akun? <Link to="/login">Masuk di sini</Link>
          </>
        }
      />
    </AuthLayout>
  )
}
