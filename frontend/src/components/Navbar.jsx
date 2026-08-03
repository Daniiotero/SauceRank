import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav style={{
      background: '#0c0c0e',
      borderBottom: '1px solid var(--border)',
      boxShadow: '0 1px 6px rgba(0,0,0,0.5)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      height: 'var(--header)'
    }}>
      <div style={{
        maxWidth: 'var(--max)',
        margin: '0 auto',
        padding: '0 20px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <Link to="/" style={{
            fontSize: 17,
            fontWeight: 800,
            color: 'var(--accent)',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            letterSpacing: '.02em',
            textShadow: '0 0 12px var(--accent-glow)'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141 4.14-1.38 9.48-.66 13.08 1.56.36.24.48.84.239 1.26zm.12-3.36c-3.84-2.28-10.14-2.52-13.8-1.38-.54.18-1.14-.12-1.32-.66-.18-.541.12-1.141.66-1.321 4.2-1.38 10.92-1.08 15.18 1.56.48.3.66 1.02.36 1.5-.301.36-.959.48-1.08.301z"/>
            </svg>
            SAUCERANK
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {[
              { to: '/', label: 'Discos' },
              { to: '/top', label: 'Top' },
              ...(user ? [{ to: '/users', label: 'Usuarios' }] : [])
            ].map(link => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  color: isActive(link.to) ? 'var(--accent)' : 'var(--text-dim)',
                  fontWeight: 500,
                  fontSize: 14,
                  padding: '4px 0',
                  position: 'relative',
                  transition: 'color .15s'
                }}
                onMouseEnter={e => { if (!isActive(link.to)) e.target.style.color = 'var(--text)' }}
                onMouseLeave={e => { if (!isActive(link.to)) e.target.style.color = 'var(--text-dim)' }}
              >
                {link.label}
                {isActive(link.to) && (
                  <div style={{
                    position: 'absolute', bottom: -2, left: 0, right: 0,
                    height: 2,
                    background: 'var(--accent)',
                    borderRadius: 1,
                    boxShadow: '0 0 6px var(--accent-glow)'
                  }} />
                )}
              </Link>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '4px 10px 4px 4px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-light)',
                  background: 'linear-gradient(180deg, #1c1c20, #141416)',
                  color: 'var(--text)',
                  fontSize: 14,
                  fontWeight: 500,
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)'
                }}
              >
                <div style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  background: 'linear-gradient(180deg, #7cc4dc, #6eb8d0)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 12,
                  color: '#08080a',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)'
                }}>
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span style={{ marginRight: 4 }}>{user.username}</span>
              </button>
              {menuOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: 6,
                  background: '#0e0e10',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  boxShadow: 'var(--shadow-lg)',
                  minWidth: 170,
                  overflow: 'hidden',
                  zIndex: 200
                }}>
                  <Link
                    to={`/users/${user.id}`}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: 'block',
                      padding: '10px 16px',
                      fontSize: 14,
                      color: 'var(--text)',
                      borderBottom: '1px solid var(--border)'
                    }}
                  >
                    Mi perfil
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setMenuOpen(false) }}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '10px 16px',
                      fontSize: 14,
                      color: 'var(--text-dim)',
                      background: 'none',
                      border: 'none'
                    }}
                  >
                    Cerrar sesion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-sm btn-secondary">
                Iniciar sesion
              </Link>
              <Link to="/register" className="btn btn-sm btn-primary">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}