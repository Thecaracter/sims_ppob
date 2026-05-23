import { apiClient } from './api.client.ts'
import { API_ENDPOINTS } from '../config/constants.ts'
import type { ProfileData, UpdateProfileRequest } from '../types/profile.types.ts'

interface GetProfileResponse {
  status: number
  message: string
  data: ProfileData
}

interface UpdateProfileResponse {
  status: number
  message: string
  data: ProfileData
}

export const profileService = {
  getProfile: () => apiClient.get<GetProfileResponse>(API_ENDPOINTS.PROFILE.GET),

  updateProfile: (data: UpdateProfileRequest) =>
    apiClient.put<UpdateProfileResponse>(API_ENDPOINTS.PROFILE.UPDATE, data),

  uploadProfilePhoto: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.put<UpdateProfileResponse>(API_ENDPOINTS.PROFILE.UPLOAD_PHOTO, formData)
  },
}
