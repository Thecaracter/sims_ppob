export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  status: number
  message: string
  data: {
    token: string
  }
}

export interface RegisterRequest {
  first_name: string
  last_name: string
  email: string
  password: string
}

export interface RegisterResponse {
  status: number
  message: string
  data?: {
    email: string
    first_name: string
    last_name: string
  }
}

export interface AuthState {
  isAuthenticated: boolean
  token: string | null
  user: {
    email: string
    first_name: string
    last_name: string
    profile_image: string
  } | null
  isLoading: boolean
  error: string | null
}
