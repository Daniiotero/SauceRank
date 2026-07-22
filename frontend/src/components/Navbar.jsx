import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav style={{
      background: '#111',
      padding: '16px 24px',
      borderBottom: '1px solid #222',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 12
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <Link to="/" style={{
          fontSize: 22,
          fontWeight: 800,
          color: '#1db954',
          textDecoration: 'none',
          letterSpacing: -0.5
        }}>
          SAUCERANK
        </Link>
        <Link to="/" style={{ color: '#ccc', fontSize: 14 }}>Discos</Link>
        <Link to="/top" style={{ color: '#ccc', fontSize: 14 }}>Top</Link>
        {user && (
          <Link to="/users" style={{ color: '#ccc', fontSize: 14 }}>Usuarios</Link>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {user ? (
          <>
            <Link to={`/users/${user.id}`} style={{ color: '#1db954', fontSize: 14 }}>
              {user.username}
            </Link>
            <button className="btn btn-secondary" onClick={handleLogout} style={{ padding: '6px 14px', fontSize: 13 }}>
              Salir
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: 13 }}>
              Login
            </Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '6px 14px', fontSize: 13 }}>
              Registro
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
