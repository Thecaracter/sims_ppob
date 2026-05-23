import { apiClient } from './api.client.ts'
import { API_ENDPOINTS } from '../config/constants.ts'
import type { TransactionHistoryData, TopUpRequest, PaymentRequest, TransactionRequest, TransactionResponse } from '../types/transaction.types.ts'

interface TransactionHistoryResponse {
  status: number
  message: string
  data: TransactionHistoryData
}

interface BalanceResponse {
  status: number
  message: string
  data: {
    balance: number
  }
}

interface TopUpResponse {
  status: number
  message: string
  data: {
    balance: number
  }
}

interface PaymentResponse {
  status: number
  message: string
  data: {
    balance: number
  }
}

export const transactionService = {
  createTransaction: (data: TransactionRequest) => 
    apiClient.post<TransactionResponse>(API_ENDPOINTS.TRANSACTION.CREATE, data),

  getHistory: (offset: number = 0, limit: number = 5) => 
    apiClient.get<TransactionHistoryResponse>(
      `${API_ENDPOINTS.TRANSACTION.HISTORY}?offset=${offset}&limit=${limit}`
    ),

  getBalance: () => apiClient.get<BalanceResponse>(API_ENDPOINTS.BALANCE),

  topUp: (data: TopUpRequest) => apiClient.post<TopUpResponse>(API_ENDPOINTS.TRANSACTION.TOPUP, data),

  makePayment: (data: PaymentRequest) =>
    apiClient.post<PaymentResponse>(API_ENDPOINTS.TRANSACTION.PAYMENT, data),
}
