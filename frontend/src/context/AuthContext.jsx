import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    if (stored && token) {
      authApi.check().then(() => {
        setUser(JSON.parse(stored))
      }).catch(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (username, password) => {
    const res = await authApi.login({ username, password })
    const data = res.data
    if (!data || !data.token) {
      throw new Error('Respuesta invalida del servidor')
    }
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify({ id: data.userId, username: data.username }))
    setUser({ id: data.userId, username: data.username })
    return data
  }

  const register = async (username, email, password) => {
    const res = await authApi.register({ username, email, password })
    const data = res.data
    if (!data || !data.token) {
      throw new Error('Respuesta invalida del servidor')
    }
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify({ id: data.userId, username: data.username }))
    setUser({ id: data.userId, username: data.username })
    return data
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
