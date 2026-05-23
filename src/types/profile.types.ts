export interface ProfileData {
  email: string
  first_name: string
  last_name: string
  profile_image: string
}

export interface UpdateProfileRequest {
  first_name: string
  last_name: string
}

export interface ProfileState {
  data: ProfileData | null
  isLoading: boolean
  error: string | null
}
