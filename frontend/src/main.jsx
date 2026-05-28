import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { AuthProvider } from './app/providers/AuthContext'
import Home from './pages/Home.jsx'
import Login from './auth/Login.jsx'
import Register from './auth/Register.jsx'
import ProtectedRoute from './auth/ProtectedRoute.jsx'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
    
  },
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <div>Dashboard</div>
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
