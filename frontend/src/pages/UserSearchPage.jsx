import { useState } from 'react'
import { Link } from 'react-router-dom'
import { userApi } from '../services/api'

export default function UserSearchPage() {
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState([])
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    try {
      const res = await userApi.search(query.trim())
      setUsers(res.data)
      setSearched(true)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
          Buscar <span style={{ color: '#1db954' }}>Usuarios</span>
        </h1>
        <p style={{ color: '#888', fontSize: 14 }}>
          Encuentra usuarios y ve sus canciones votadas
        </p>
      </div>

      <form onSubmit={handleSearch} style={{ maxWidth: 500, margin: '0 auto 32px', display: 'flex', gap: 8 }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar por nombre de usuario..."
        />
        <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
          Buscar
        </button>
      </form>

      {searched && users.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <p style={{ color: '#888' }}>No se encontraron usuarios</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 500, margin: '0 auto' }}>
        {users.map(u => (
          <Link key={u.id} to={`/users/${u.id}`} style={{ textDecoration: 'none' }}>
            <div className="card" style={{
              display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
              transition: 'background 0.2s'
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#222'}
              onMouseLeave={e => e.currentTarget.style.background = '#1a1a1a'}
            >
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: '#1db954', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontWeight: 700, fontSize: 18, color: '#000'
              }}>
                {u.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 16 }}>{u.username}</div>
                <div style={{ fontSize: 13, color: '#888' }}>{u.email}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
