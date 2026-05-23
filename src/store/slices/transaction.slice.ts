import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { TransactionState, TopUpRequest, PaymentRequest } from '../../types/transaction.types.ts'
import { transactionService } from '../../services/transaction.service.ts'

const initialState: TransactionState = {
  transactions: [],
  balance: 0,
  isLoading: false,
  error: null,
}

export const fetchTransactionHistory = createAsyncThunk(
  'transaction/fetch-history',
  async ({ offset = 0, limit = 5 }: { offset?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await transactionService.getHistory(offset, limit)
      return response
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred')
    }
  }
)

export const fetchBalance = createAsyncThunk(
  'transaction/fetch-balance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await transactionService.getBalance()
      return response
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred')
    }
  }
)

export const topUp = createAsyncThunk(
  'transaction/topup',
  async (data: TopUpRequest, { rejectWithValue }) => {
    try {
      const response = await transactionService.topUp(data)
      return response
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred')
    }
  }
)

export const makePayment = createAsyncThunk(
  'transaction/payment',
  async (data: PaymentRequest, { rejectWithValue }) => {
    try {
      const response = await transactionService.makePayment(data)
      return response
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred')
    }
  }
)

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactionHistory.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchTransactionHistory.fulfilled, (state, action) => {
        state.isLoading = false
          const { offset, records } = action.payload.data || { offset: 0, records: [] }
          if (offset === 0) {
            state.transactions = records
          } else {
              const existingInvoices = new Set(state.transactions.map(t => t.invoice_number))
              const newRecords = records.filter(r => !existingInvoices.has(r.invoice_number))
              state.transactions = [...state.transactions, ...newRecords]
          }
      })
      .addCase(fetchTransactionHistory.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    builder
      .addCase(fetchBalance.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchBalance.fulfilled, (state, action) => {
        state.isLoading = false
        state.balance = action.payload.data?.balance || 0
      })
      .addCase(fetchBalance.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    builder
      .addCase(topUp.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(topUp.fulfilled, (state, action) => {
        state.isLoading = false
        state.balance = action.payload.data?.balance || 0
      })
      .addCase(topUp.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    builder
      .addCase(makePayment.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(makePayment.fulfilled, (state, action) => {
        state.isLoading = false
        state.balance = action.payload.data?.balance || 0
      })
      .addCase(makePayment.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError } = transactionSlice.actions
export default transactionSlice.reducer
