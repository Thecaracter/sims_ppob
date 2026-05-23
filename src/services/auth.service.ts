import { apiClient } from './api.client.ts'
import { API_ENDPOINTS } from '../config/constants.ts'
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../types/auth.types.ts'

export const authService = {
  login: (credentials: LoginRequest) => apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials),

  register: (userData: RegisterRequest) => apiClient.post<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, userData),

  logout: () => {
    localStorage.removeItem('token')
    return Promise.resolve()
  },
}
