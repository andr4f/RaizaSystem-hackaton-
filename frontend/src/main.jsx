import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { AuthProvider } from './app/providers/AuthContext'
import Home from './pages/Home.jsx'
import Login from './auth/Login.jsx'
import ProtectedRoute from './auth/ProtectedRoute.jsx'
import ProducerDashboard from './pages/dashboards/producer/ProducerDashboard.jsx'
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
