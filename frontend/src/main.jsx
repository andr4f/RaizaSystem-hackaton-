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
import ExporterHome from './pages/dashboards/exporter/sections/ExporterHome.jsx'
import ExploreProducts from './pages/dashboards/exporter/sections/ExploreProducts.jsx'
import VerifiedLots from './pages/dashboards/exporter/sections/VerifiedLots.jsx'
import ExporterCertifications from './pages/dashboards/exporter/sections/ExporterCertifications.jsx'
import Opportunities from './pages/dashboards/exporter/sections/Opportunities.jsx'
import Contacts from './pages/dashboards/exporter/sections/Contacts.jsx'
import Orders from './pages/dashboards/exporter/sections/Orders.jsx'
import ExporterReports from './pages/dashboards/exporter/sections/ExporterReports.jsx'
import ExporterFinance from './pages/dashboards/exporter/sections/ExporterFinance.jsx'
import TourismDashboard from './pages/dashboards/tourism/TourismDashboard.jsx'
import TourismHome from './pages/dashboards/tourism/sections/TourismHome.jsx'
import Experiences from './pages/dashboards/tourism/sections/Experiences.jsx'
import NewExperience from './pages/dashboards/tourism/sections/NewExperience.jsx'
import ExperienceDetail from './pages/dashboards/tourism/sections/ExperienceDetail.jsx'
import AlliedProducers from './pages/dashboards/tourism/sections/AlliedProducers.jsx'
import TourismQr from './pages/dashboards/tourism/sections/TourismQr.jsx'
import Bookings from './pages/dashboards/tourism/sections/Bookings.jsx'
import TourismLeads from './pages/dashboards/tourism/sections/TourismLeads.jsx'
import TourismReports from './pages/dashboards/tourism/sections/TourismReports.jsx'
import TourismFinance from './pages/dashboards/tourism/sections/TourismFinance.jsx'
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
    children: [
      { index: true, element: <ExporterHome /> },
      { path: 'explorar', element: <ExploreProducts /> },
      { path: 'lotes', element: <VerifiedLots /> },
      { path: 'certificaciones', element: <ExporterCertifications /> },
      { path: 'oportunidades', element: <Opportunities /> },
      { path: 'contactos', element: <Contacts /> },
      { path: 'ordenes', element: <Orders /> },
      { path: 'reportes', element: <ExporterReports /> },
      { path: 'finanzas', element: <ExporterFinance /> },
    ],
  },
  {
    path: '/dashboard/tourism',
    element: (
      <ProtectedRoute allowedRoles={['TOURISM_OPERATOR']}>
        <TourismDashboard />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <TourismHome /> },
      { path: 'experiencias', element: <Experiences /> },
      { path: 'experiencias/nueva', element: <NewExperience /> },
      { path: 'experiencias/:experienceId', element: <ExperienceDetail /> },
      { path: 'aliados', element: <AlliedProducers /> },
      { path: 'qr', element: <TourismQr /> },
      { path: 'reservas', element: <Bookings /> },
      { path: 'leads', element: <TourismLeads /> },
      { path: 'reportes', element: <TourismReports /> },
      { path: 'finanzas', element: <TourismFinance /> },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
