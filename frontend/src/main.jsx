import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { AuthProvider } from './app/providers/AuthContext'
import Home from './pages/Home.jsx'
import Login from './auth/Login.jsx'
import ProtectedRoute from './auth/ProtectedRoute.jsx'
import ProducerDashboard from './pages/dashboards/producer/ProducerDashboard.jsx'
import ProducerHome from './pages/dashboards/producer/sections/ProducerHome.jsx'
import LotsList from './pages/dashboards/producer/sections/LotsList.jsx'
import LotDetail from './pages/dashboards/producer/sections/LotDetail.jsx'
import TraceabilityEvents from './pages/dashboards/producer/sections/TraceabilityEvents.jsx'
import Certifications from './pages/dashboards/producer/sections/Certifications.jsx'
import QrLabels from './pages/dashboards/producer/sections/QrLabels.jsx'
import LeadsInbox from './pages/dashboards/producer/sections/LeadsInbox.jsx'
import Reports from './pages/dashboards/producer/sections/Reports.jsx'
import Finance from './pages/dashboards/producer/sections/Finance.jsx'
import ExporterDashboard from './pages/dashboards/exporter/ExporterDashboard.jsx'
import TourismDashboard from './pages/dashboards/tourism/TourismDashboard.jsx'
import RegisterFlow from './pages/register/RegisterFlow.jsx'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <RegisterFlow />,
  },
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/dashboard/producer',
    element: (
      <ProtectedRoute allowedRoles={['PRODUCER']}>
        <ProducerDashboard />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <ProducerHome /> },
      { path: 'lotes', element: <LotsList /> },
      { path: 'lotes/:lotId', element: <LotDetail /> },
      { path: 'trazabilidad', element: <TraceabilityEvents /> },
      { path: 'certificaciones', element: <Certifications /> },
      { path: 'qr', element: <QrLabels /> },
      { path: 'leads', element: <LeadsInbox /> },
      { path: 'reportes', element: <Reports /> },
      { path: 'finanzas', element: <Finance /> },
    ],
  },
  {
    path: '/dashboard/exporter',
    element: (
      <ProtectedRoute allowedRoles={['EXPORTER']}>
        <ExporterDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/tourism',
    element: (
      <ProtectedRoute allowedRoles={['TOURISM_OPERATOR']}>
        <TourismDashboard />
      </ProtectedRoute>
    ),
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
