import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { authApi } from '../services/api'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      setStatus('error')
      return
    }
    authApi.verify(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [searchParams])

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
          {status === 'loading' && (
            <>
              <h1 className="display" style={{ fontSize: 22, marginBottom: 4 }}>Activando tu cuenta</h1>
              <div className="skeleton" style={{ width: 180, height: 16, margin: '16px auto 0' }} />
            </>
          )}
          {status === 'success' && (
            <>
              <h1 className="display" style={{ fontSize: 22, marginBottom: 4 }}>Cuenta activada</h1>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Tu cuenta ya está activa. Ya puedes iniciar sesión y votar tus temas favoritos.
              </p>
            </>
          )}
          {status === 'error' && (
            <>
              <h1 className="display" style={{ fontSize: 22, marginBottom: 4 }}>Enlace no válido o caducado</h1>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                El enlace de verificación no es válido o ya ha caducado. Regístrate de nuevo
                para recibir un correo nuevo.
              </p>
            </>
          )}
        </div>
        {status !== 'loading' && (
          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)' }}>
            <Link to="/login" style={{ fontWeight: 600 }}>Ir a iniciar sesión</Link>
          </p>
        )}
      </div>
    </div>
  )
}
