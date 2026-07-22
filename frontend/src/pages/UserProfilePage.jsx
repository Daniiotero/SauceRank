import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { userApi } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function UserProfilePage() {
  const { id } = useParams()
  const { user: currentUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    userApi.getProfile(id)
      .then(res => setProfile(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: 60, color: '#888' }}>Cargando perfil...</div>
  }

  if (!profile) {
    return <div style={{ textAlign: 'center', marginTop: 60, color: '#888' }}>Usuario no encontrado</div>
  }

  const isOwnProfile = currentUser?.id === profile.id

  return (
    <div>
      <Link to="/users" style={{ color: '#888', fontSize: 14, marginBottom: 20, display: 'inline-block' }}>
        &larr; Buscar usuarios
      </Link>

      <div className="card" style={{ marginBottom: 32, textAlign: 'center', padding: 32 }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: '#1db954', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontWeight: 700, fontSize: 36, color: '#000',
          margin: '0 auto 16px'
        }}>
          {profile.username.charAt(0).toUpperCase()}
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>{profile.username}</h1>
        <p style={{ color: '#888', fontSize: 14 }}>{profile.email}</p>
        <p style={{ color: '#888', fontSize: 13, marginTop: 8 }}>
          {profile.votes.length} voto{profile.votes.length !== 1 ? 's' : ''} emitido{profile.votes.length !== 1 ? 's' : ''}
        </p>
      </div>

      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
        {isOwnProfile ? 'Tus votos' : `Canciones votadas por ${profile.username}`}
      </h2>

      {profile.votes.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <p style={{ color: '#888' }}>Este usuario no ha votado ninguna cancion aun</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          {profile.votes.map((v, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 20px', borderBottom: '1px solid #222'
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: '#1db954', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#000'
              }}>
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{v.title}</div>
                <div style={{ fontSize: 13, color: '#888' }}>
                  {v.albumName}
                  {v.featuredArtists && ` · ft. ${v.featuredArtists}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
