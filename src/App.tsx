import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAppSelector } from './store/hooks.ts'
import { LoginPage, RegisterPage } from './pages/auth/index.ts'
import { DashboardPage } from './pages/DashboardPage.tsx'
import { AccountPage } from './pages/AccountPage.tsx'
import { TopUpPage } from './pages/TopUpPage.tsx'
import { TransactionPage } from './pages/TransactionPage.tsx'
import { PaymentPage } from './pages/PaymentPage.tsx'
import './App.css'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/topup"
          element={
            <ProtectedRoute>
              <TopUpPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transaction"
          element={
            <ProtectedRoute>
              <TransactionPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
