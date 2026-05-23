import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { AuthState, LoginRequest, RegisterRequest } from '../../types/auth.types.ts'
import { authService, profileService } from '../../services/index.ts'

const token = localStorage.getItem('token')

const initialState: AuthState = {
  isAuthenticated: !!token,
  token: token || null,
  user: null,
  isLoading: false,
  error: null,
}

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileService.getProfile()
      if (response.status === 0 && response.data) {
        return response.data
      }
      return rejectWithValue(response.message || 'Failed to fetch profile')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      return rejectWithValue(errorMessage)
    }
  }
)

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue, dispatch }) => {
    try {
      const response = await authService.login(credentials)
      if (response.status === 0 && response.data?.token) {
        localStorage.setItem('token', response.data.token)
        const profileResult = await dispatch(fetchProfile())
        if (fetchProfile.fulfilled.match(profileResult)) {
          return {
            token: response.data.token,
            user: profileResult.payload,
          }
        }
        return { token: response.data.token, user: null }
      }
      return rejectWithValue(response.message || 'Login failed')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      return rejectWithValue(errorMessage)
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData)
      if (response.status === 0) {
        return response.message
      }
      return rejectWithValue(response.message || 'Registration failed')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      return rejectWithValue(errorMessage)
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout()
      return null
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Logout failed')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.token = action.payload.token
        state.user = action.payload.user || null
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.token = null
        state.user = null
        state.error = null
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, setLoading } = authSlice.actions
export default authSlice.reducer
