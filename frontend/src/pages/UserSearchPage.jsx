import { useState } from 'react'
import { Link } from 'react-router-dom'
import { userApi } from '../services/api'

export default function UserSearchPage() {
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState([])
  const [searched, setSearched] = useState(false)
  const [searching, setSearching] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setSearching(true)
    try {
      const res = await userApi.search(query.trim())
      setUsers(res.data)
      setSearched(true)
    } catch (err) {
      console.error(err)
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="fade-in">
      <h1 style={{
        fontSize: 28,
        fontWeight: 800,
        marginBottom: 8,
        letterSpacing: '-.02em'
      }}>
        Usuarios
      </h1>
      <p style={{ color: 'var(--text-dim)', fontSize: 14, marginBottom: 28, maxWidth: 460 }}>
        Encontra usuarios y mira sus canciones votadas
      </p>

      <form onSubmit={handleSearch} style={{
        maxWidth: 460,
        marginBottom: 28,
        display: 'flex',
        gap: 8
      }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar por nombre de usuario..."
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={searching || !query.trim()}
          style={{ whiteSpace: 'nowrap' }}
        >
          {searching ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {searched && !searching && users.length === 0 && (
        <div className="card" style={{
          textAlign: 'center',
          padding: 36,
          maxWidth: 460
        }}>
          <p style={{ color: 'var(--text-dim)' }}>No se encontraron usuarios</p>
        </div>
      )}

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        maxWidth: 460
      }}>
        {users.map(u => (
          <Link
            key={u.id}
            to={`/users/${u.id}`}
            style={{ textDecoration: 'none' }}
          >
            <div className="card card-hover" style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '14px 18px'
            }}>
              <div style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                background: 'linear-gradient(180deg, #7cc4dc, #6eb8d0)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 16,
                color: '#08080a',
                flexShrink: 0,
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)'
              }}>
                {u.username.charAt(0).toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 500, fontSize: 15, color: 'var(--text)' }}>
                  {u.username}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>
                  {u.email}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}