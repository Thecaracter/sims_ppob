import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/auth.slice.ts'
import profileReducer from './slices/profile.slice.ts'
import transactionReducer from './slices/transaction.slice.ts'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    transaction: transactionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {

        ignoredActions: [],
        ignoredPaths: [],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
