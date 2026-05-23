import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { ProfileState, UpdateProfileRequest } from '../../types/profile.types.ts'
import { profileService } from '../../services/profile.service.ts'

const initialState: ProfileState = {
  data: null,
  isLoading: false,
  error: null,
}

export const fetchProfile = createAsyncThunk(
  'profile/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileService.getProfile()
      return response
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred')
    }
  }
)

export const updateProfile = createAsyncThunk(
  'profile/update',
  async (data: UpdateProfileRequest, { rejectWithValue }) => {
    try {
      const response = await profileService.updateProfile(data)
      return response
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred')
    }
  }
)

export const updateProfilePicture = createAsyncThunk(
  'profile/update-picture',
  async (file: File, { rejectWithValue }) => {
    try {
      const response = await profileService.uploadProfilePhoto(file)
      return response
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred')
    }
  }
)

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload.data
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload.data
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    builder
      .addCase(updateProfilePicture.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateProfilePicture.fulfilled, (state, action) => {
        state.isLoading = false
        if (state.data) {
          state.data.profile_image = action.payload.data.profile_image
        }
      })
      .addCase(updateProfilePicture.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError } = profileSlice.actions
export default profileSlice.reducer
