import { createContext, useContext, useState, useCallback } from 'react'
import { authApi } from '../../shared/api/authApi.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  const login = useCallback(async (credentials) => {
    const response = await authApi.login(credentials)
    const authData = response.data
    localStorage.setItem('token', authData.token)
    localStorage.setItem('user', JSON.stringify(authData))
    setUser(authData)
    return authData
  }, [])

  const register = useCallback(async (userData) => {
    const response = await authApi.register(userData)
    const authData = response.data
    localStorage.setItem('token', authData.token)
    localStorage.setItem('user', JSON.stringify(authData))
    setUser(authData)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
