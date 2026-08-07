import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Icon from './ui/Icon'
import Avatar from './ui/Avatar'
import { PrimaryButton, SecondaryButton, GhostButton } from './ui/Button'

const NAV_LINKS = [
  { to: '/', label: 'Discos' },
  { to: '/top', label: 'Top' }
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)

  const links = user ? [...NAV_LINKS, { to: '/users', label: 'Usuarios' }] : NAV_LINKS

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!userMenuOpen) return
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [userMenuOpen])

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
          <Link to="/" className="brand">
            <img src="/image.png" alt="" className="brand-logo" />
            SAUCERANK
          </Link>

          <div className={`nav-links${menuOpen ? ' open' : ''}`}>
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link${isActive(link.to) ? ' active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          {user ? (
            <div style={{ position: 'relative' }} ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="btn btn-secondary btn-sm"
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
                style={{ padding: '5px 10px 5px 5px', gap: 10 }}
              >
                <Avatar username={user.username} size={28} />
                <span style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 600 }}>
                  {user.username}
                </span>
              </button>
              {userMenuOpen && (
                <div className="dropdown">
                  <Link to={`/users/${user.username}`} className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    <Icon name="user" size={15} />
                    Mi perfil
                  </Link>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <Icon name="logout" size={15} />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <SecondaryButton to="/login" size="sm">
                Iniciar sesión
              </SecondaryButton>
              <PrimaryButton to="/register" size="sm" className="hide-mobile">
                Registrarse
              </PrimaryButton>
            </>
          )}

          <button
            className="menu-toggle btn btn-ghost btn-sm"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
          >
            <Icon name="menu" size={18} />
          </button>
        </div>
      </div>
    </nav>
  )
}
