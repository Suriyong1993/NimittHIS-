import { useEffect } from "react"
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom"

import { AppShell } from "./components/layout/AppShell"
import { useAuthStore } from "./store/authStore"
import { AnalyticsPage } from "./pages/AnalyticsPage"
import { AppointmentListPage } from "./pages/AppointmentListPage"
import { DashboardPage } from "./pages/DashboardPage"
import { LoginPage } from "./pages/LoginPage"
import { NoShowTrackingPage } from "./pages/NoShowTrackingPage"
import { PatientProfilePage } from "./pages/PatientProfilePage"

function ProtectedLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}

function AuthGate() {
  const { bootstrap, isAuthenticated, isBootstrapping } = useAuthStore()

  useEffect(() => {
    void bootstrap()
  }, [bootstrap])

  if (isBootstrapping) {
    return (
      <main className="grid min-h-screen place-items-center bg-nimitt-bg">
        <div className="rounded-3xl border border-nimitt-border bg-white px-6 py-4 text-sm text-nimitt-muted">
          กำลังเตรียมระบบ...
        </div>
      </main>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <ProtectedLayout />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AuthGate />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/appointments" element={<AppointmentListPage />} />
          <Route path="/noshow" element={<NoShowTrackingPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/patients/:id" element={<PatientProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
