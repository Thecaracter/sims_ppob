import { apiClient } from './api.client.ts'
import { API_ENDPOINTS } from '../config/constants.ts'
import type { BannerResponse } from '../types/banner.types.ts'

export const bannerService = {
  getBanners: () => apiClient.get<BannerResponse>(API_ENDPOINTS.BANNER),
}
