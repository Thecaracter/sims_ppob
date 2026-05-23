import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email tidak boleh kosong')
    .email('Email tidak valid')
    .toLowerCase(),
  password: z
    .string()
    .min(1, 'Password tidak boleh kosong')
    .min(8, 'Password minimal 8 karakter'),
})

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email tidak boleh kosong')
    .email('Email tidak valid')
    .toLowerCase(),
  first_name: z
    .string()
    .min(1, 'Nama depan tidak boleh kosong')
    .min(3, 'Nama depan minimal 3 karakter'),
  last_name: z
    .string()
    .min(1, 'Nama belakang tidak boleh kosong')
    .min(3, 'Nama belakang minimal 3 karakter'),
  password: z
    .string()
    .min(1, 'Password tidak boleh kosong')
    .min(8, 'Password minimal 8 karakter'),
  confirmPassword: z
    .string()
    .min(1, 'Konfirmasi password tidak boleh kosong'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Konfirmasi password tidak cocok dengan password',
  path: ['confirmPassword'],
})

export const profileUpdateSchema = z.object({
  first_name: z.string().min(1, 'Nama depan tidak boleh kosong'),
  last_name: z.string().min(1, 'Nama belakang tidak boleh kosong'),
  phone_number: z.string().optional(),
})

export const topUpSchema = z.object({
  amount: z.number().min(10000, 'Minimal top up Rp 10.000').max(1000000, 'Maksimal top up Rp 1.000.000'),
})

export const paymentSchema = z.object({
  service_code: z.string().min(1, 'Pilih layanan pembayaran'),
  amount: z.number().min(1, 'Jumlah tidak valid'),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>
export type TopUpData = z.infer<typeof topUpSchema>
export type PaymentData = z.infer<typeof paymentSchema>
