import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Credenciales invalidas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fade-in" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - var(--header) - 48px)'
    }}>
      <div className="card" style={{
        width: '100%',
        maxWidth: 380,
        padding: 36
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="var(--accent)" style={{ marginBottom: 16, filter: 'drop-shadow(0 0 8px var(--accent-glow))' }}>
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141 4.14-1.38 9.48-.66 13.08 1.56.36.24.48.84.239 1.26zm.12-3.36c-3.84-2.28-10.14-2.52-13.8-1.38-.54.18-1.14-.12-1.32-.66-.18-.541.12-1.141.66-1.321 4.2-1.38 10.92-1.08 15.18 1.56.48.3.66 1.02.36 1.5-.301.36-.959.48-1.08.301z"/>
          </svg>
          <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-.01em', marginBottom: 4 }}>Bienvenido</h2>
          <p style={{ fontSize: 14, color: 'var(--text-dim)' }}>
            Ingresa a tu cuenta de SauceRank
          </p>
        </div>

        {error && (
          <div style={{
            padding: '10px 14px',
            background: 'rgba(200,74,74,0.1)',
            border: '1px solid var(--danger-border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--danger)',
            fontSize: 13,
            marginBottom: 20,
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: 'var(--text-dim)' }}>
              Usuario
            </label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="tu usuario"
              required
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: 'var(--text-dim)' }}>
              Contrasena
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="··········"
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '12px 20px', fontSize: 15 }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p style={{ marginTop: 20, textAlign: 'center', fontSize: 14, color: 'var(--text-dim)' }}>
          No tenes cuenta?{' '}
          <Link to="/register" style={{ fontWeight: 600 }}>Registrate</Link>
        </p>
      </div>
    </div>
  )
}