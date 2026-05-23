export interface Transaction {
  invoice_number: string
  service_code?: string
  service_name?: string
  transaction_type: 'TOPUP' | 'PAYMENT'
  description: string
  total_amount: number
  created_on: string
}

export interface TransactionHistoryData {
  offset: number
  limit: number
  records: Transaction[]
}

export interface TransactionRequest {
  service_code: string
}

export interface TransactionResponse {
  status: number
  message: string
  data: {
    invoice_number: string
    service_code: string
    service_name: string
    transaction_type: 'PAYMENT'
    total_amount: number
    created_on: string
  } | null
}

export interface TopUpRequest {
  top_up_amount: number
}

export interface PaymentRequest {
  service_code: string
  amount: number
}

export interface TransactionState {
  transactions: Transaction[]
  balance: number
  isLoading: boolean
  error: string | null
}
