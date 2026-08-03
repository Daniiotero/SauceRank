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
    return (
      <div className="fade-in">
        <Link to="/users" style={{ color: 'var(--text-dim)', fontSize: 14, marginBottom: 16, display: 'inline-block' }}>
          &larr; Volver
        </Link>
        <div className="card" style={{ textAlign: 'center', padding: 32, marginBottom: 28 }}>
          <div className="skeleton skeleton-circle" style={{ width: 72, height: 72, margin: '0 auto 16px' }} />
          <div className="skeleton skeleton-text" style={{ width: '40%', margin: '0 auto' }} />
          <div className="skeleton skeleton-text short" style={{ margin: '0 auto' }} />
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="fade-in" style={{ textAlign: 'center', marginTop: 60 }}>
        <p style={{ color: 'var(--text-dim)' }}>Usuario no encontrado</p>
      </div>
    )
  }

  const isOwnProfile = currentUser?.id === profile.id

  return (
    <div className="fade-in">
      <Link to="/users" style={{
        color: 'var(--text-dim)',
        fontSize: 14,
        marginBottom: 20,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        Volver
      </Link>

      <div className="card" style={{
        textAlign: 'center',
        padding: '36px 24px',
        marginBottom: 32
      }}>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'linear-gradient(180deg, #7cc4dc, #6eb8d0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: 34,
          color: '#08080a',
          margin: '0 auto 16px',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 0 12px var(--accent-glow)'
        }}>
          {profile.username.charAt(0).toUpperCase()}
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 2 }}>{profile.username}</h1>
        <p style={{ color: 'var(--text-dim)', fontSize: 14, marginBottom: 12 }}>{profile.email}</p>
        <span style={{
          display: 'inline-block',
          padding: '4px 14px',
          fontSize: 13,
          color: 'var(--text-dim)',
          background: 'linear-gradient(180deg, #1e1e22, #141416)',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)'
        }}>
          {profile.votes.length} voto{profile.votes.length !== 1 ? 's' : ''}
        </span>
      </div>

      <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>
        {isOwnProfile ? 'Tus votos' : 'Canciones que voto'}
      </h2>

      {profile.votes.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 36 }}>
          <p style={{ color: 'var(--text-dim)' }}>Todavia no voto ninguna cancion</p>
        </div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          {profile.votes.map((v, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 16px',
              borderBottom: i < profile.votes.length - 1 ? '1px solid var(--border)' : 'none',
              transition: 'background .15s'
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{
                width: 24,
                textAlign: 'center',
                fontWeight: 500,
                fontSize: 13,
                color: 'var(--text-dim)',
                flexShrink: 0
              }}>
                {i + 1}
              </span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 500, fontSize: 14, color: 'var(--text)' }}>{v.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>
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