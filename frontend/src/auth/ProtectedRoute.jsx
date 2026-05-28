import { Navigate } from 'react-router-dom'
import { useAuth } from '../app/providers/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default ProtectedRoute
