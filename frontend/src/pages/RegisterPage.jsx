import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PrimaryButton } from '../components/ui/Button'
import PasswordInput from '../components/ui/PasswordInput'

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [registered, setRegistered] = useState(false)
  const { register } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(username, email, password)
      setRegistered(true)
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo completar el registro. Intentalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (registered) {
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
            <h1 className="display" style={{ fontSize: 22, marginBottom: 4 }}>Revisa tu correo</h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Te enviamos un enlace de activacion. Abri el correo y hacé clic en el enlace
              para activar tu cuenta. Si no lo ves, revisa spam.
            </p>
          </div>
          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)' }}>
            Ya activaste tu cuenta?{' '}
            <Link to="/login" style={{ fontWeight: 600 }}>Inicia sesion</Link>
          </p>
        </div>
      </div>
    )
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
          <h1 className="display" style={{ fontSize: 22, marginBottom: 4 }}>Crear cuenta</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            Unite a la comunidad SauceRank
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
              minLength={3}
            />
          </div>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              autoComplete="email"
              required
            />
          </div>
          <div style={{ marginBottom: 'var(--space-5)' }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>
              Contrasena
            </label>
            <PasswordInput
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="··········"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={64}
            />
          </div>
          <PrimaryButton
            type="submit"
            size="lg"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </PrimaryButton>
        </form>

        <p style={{ marginTop: 'var(--space-5)', textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)' }}>
          Ya tenes cuenta?{' '}
          <Link to="/login" style={{ fontWeight: 600 }}>Inicia sesion</Link>
        </p>
      </div>
    </div>
  )
}
