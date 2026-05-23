import { apiClient } from './api.client.ts'
import { API_ENDPOINTS } from '../config/constants.ts'
import type { ServiceResponse } from '../types/service.types.ts'

export const serviceService = {
  getServices: () => apiClient.get<ServiceResponse>(API_ENDPOINTS.SERVICES),
}
