import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { albumApi, voteApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import SongRow from '../components/SongRow'

export default function AlbumPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [album, setAlbum] = useState(null)
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState(false)

  const loadAlbum = () => {
    setLoading(true)
    albumApi.getById(id)
      .then(res => setAlbum(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadAlbum() }, [id])

  const handleVote = async (songId, score) => {
    setVoting(true)
    try {
      await voteApi.vote(songId, score)
      loadAlbum()
    } catch (err) {
      alert('Error al votar')
    } finally {
      setVoting(false)
    }
  }

  if (loading) {
    return (
      <div className="fade-in">
        <div style={{ display: 'flex', gap: 24, marginBottom: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div className="skeleton" style={{ width: 200, height: 200 }} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <div className="skeleton skeleton-text" style={{ width: 80, height: 12 }} />
            <div className="skeleton" style={{ width: '60%', height: 28, marginTop: 8 }} />
            <div className="skeleton skeleton-text short" />
          </div>
        </div>
      </div>
    )
  }

  if (!album) {
    return (
      <div className="fade-in" style={{ textAlign: 'center', marginTop: 60 }}>
        <p style={{ color: 'var(--text-dim)', fontSize: 16 }}>Album no encontrado</p>
        <Link to="/" style={{ display: 'inline-block', marginTop: 16 }}>Volver a discos</Link>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <Link to="/" style={{
        color: 'var(--text-dim)',
        fontSize: 14,
        marginBottom: 24,
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
        display: 'flex',
        gap: 28,
        marginBottom: 36,
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        padding: 24,
        background: 'linear-gradient(180deg, rgba(110,184,208,0.03) 0%, #0c0c0e 100%)'
      }}>
        <div style={{
          width: 200,
          height: 200,
          flexShrink: 0,
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(0,0,0,0.6), 0 0 20px var(--accent-glow)'
        }}>
          {album.coverUrl ? (
            <img
              src={album.coverUrl}
              alt={album.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              background: 'var(--elevated)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 64, fontWeight: 900, color: 'var(--accent)'
            }}>
              {album.name.charAt(0)}
            </div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <p style={{
            fontSize: 11,
            color: 'var(--accent)',
            textTransform: 'uppercase',
            letterSpacing: '.1em',
            fontWeight: 600,
            marginBottom: 4
          }}>
            {album.type === 'ALBUM' ? 'Album' : album.type === 'EP' ? 'EP' : 'Mixtape'}
          </p>
          <h1 style={{
            fontSize: 32,
            fontWeight: 800,
            marginBottom: 8,
            lineHeight: 1.2,
            letterSpacing: '-.02em'
          }}>
            {album.name}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-dim)', fontSize: 14 }}>
            <span>{album.year}</span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--text-dim)' }} />
            <span>{album.songs.length} canciones</span>
          </div>
          {!user && (
            <p style={{ marginTop: 14, fontSize: 13, color: 'var(--text-dim)' }}>
              <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Inicia sesion</Link> para votar
            </p>
          )}
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{
          padding: '14px 16px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--accent)">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
          <h2 style={{ fontSize: 15, fontWeight: 600 }}>Canciones</h2>
        </div>
        <div>
          {album.songs.map(song => (
            <SongRow
              key={song.id}
              song={song}
              onVote={handleVote}
              loading={voting}
              disabled={!user}
            />
          ))}
        </div>
      </div>
    </div>
  )
}