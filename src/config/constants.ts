const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://take-home-test-api.nutech-integrasi.com'

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
}

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/registration',
    LOGOUT: '/logout',
  },
  PROFILE: {
    GET: '/profile',
    UPDATE: '/profile/update',
    UPLOAD_PHOTO: '/profile/image',
  },
  TRANSACTION: {
      CREATE: '/transaction',
    HISTORY: '/transaction/history',
    TOPUP: '/topup',
    PAYMENT: '/payment',
  },
  BALANCE: '/balance',
  BANNER: '/banner',
  SERVICES: '/services',
}
