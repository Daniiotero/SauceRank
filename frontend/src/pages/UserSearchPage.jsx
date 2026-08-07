import { useState } from 'react'
import { Link } from 'react-router-dom'
import { userApi } from '../services/api'
import { PrimaryButton } from '../components/ui/Button'
import Avatar from '../components/ui/Avatar'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'
import Icon from '../components/ui/Icon'

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
      <PageHeader
        eyebrow="Comunidad"
        title="Usuarios"
        description="Encuentra usuarios y mira las canciones que han votado"
      />

      <form onSubmit={handleSearch} style={{ maxWidth: 460, marginBottom: 'var(--space-5)', display: 'flex', gap: 'var(--space-2)' }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar por nombre de usuario..."
          aria-label="Buscar usuarios"
        />
        <PrimaryButton type="submit" disabled={searching || !query.trim()} style={{ whiteSpace: 'nowrap' }}>
          {searching ? 'Buscando...' : 'Buscar'}
        </PrimaryButton>
      </form>

      {searched && !searching && users.length === 0 && (
        <EmptyState
          icon="search"
          title="No se encontraron usuarios"
          description={`No hay resultados para "${query}".`}
          style={{ maxWidth: 460 }}
        />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 460 }}>
        {users.map(u => (
          <Link key={u.id} to={`/users/${u.username}`} style={{ textDecoration: 'none' }}>
            <div className="card card-hover" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px' }}>
              <Avatar username={u.username} size={42} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                  {u.username}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
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
