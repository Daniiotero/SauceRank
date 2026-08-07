import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PrimaryButton } from '../components/ui/Button'
import PasswordInput from '../components/ui/PasswordInput'

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
      setError(err.response?.data?.error || 'Credenciales no válidas')
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
      <div className="card" style={{ width: '100%', maxWidth: 400, padding: 'var(--space-6)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-5)' }}>
          <div className="brand" style={{ justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
            <img src="/image.png" alt="" className="brand-logo" />
            SAUCERANK
          </div>
          <h1 className="display" style={{ fontSize: 22, marginBottom: 4 }}>Bienvenido</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            Accede a tu cuenta de SauceRank
          </p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: 'var(--space-4)', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>
              Usuario
            </label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="tu usuario"
              autoComplete="username"
              required
            />
          </div>
          <div style={{ marginBottom: 'var(--space-5)' }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>
              Contraseña
            </label>
            <PasswordInput
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="··········"
              autoComplete="current-password"
              required
            />
          </div>
          <PrimaryButton
            type="submit"
            size="lg"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </PrimaryButton>
        </form>

        <p style={{ marginTop: 'var(--space-5)', textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)' }}>
          ¿No tienes cuenta?{' '}
          <Link to="/register" style={{ fontWeight: 600 }}>Regístrate</Link>
        </p>
      </div>
    </div>
  )
}
