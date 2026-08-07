import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { userApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Avatar from '../components/ui/Avatar'
import SongList from '../components/SongList'
import Icon from '../components/ui/Icon'
import EmptyState from '../components/ui/EmptyState'
import { Skeleton, SongListSkeleton } from '../components/ui/Skeleton'

export default function UserProfilePage() {
  const { username } = useParams()
  const { user: currentUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState({})

  useEffect(() => {
    userApi.getProfile(username)
      .then(res => setProfile(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [username])

  const toggleAlbum = albumId => {
    setExpanded(prev => ({ ...prev, [albumId]: !prev[albumId] }))
  }

  if (loading) {
    return (
      <div className="fade-in">
        <Link to="/users" style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 'var(--space-4)', display: 'inline-block' }}>
          <Icon name="arrowLeft" size={14} style={{ verticalAlign: -2 }} /> Volver
        </Link>
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
          <Skeleton width={72} height={72} circle style={{ margin: '0 auto 16px' }} />
          <Skeleton width="40%" height={20} style={{ margin: '0 auto 10px' }} />
          <Skeleton width="30%" height={14} style={{ margin: '0 auto' }} />
        </div>
        <div className="card">
          <SongListSkeleton count={4} />
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <EmptyState
        icon="user"
        title="Usuario no encontrado"
        description="Este perfil no existe o ha sido eliminado."
        style={{ marginTop: 'var(--space-7)' }}
      />
    )
  }

  const isOwnProfile = currentUser?.id === profile.id
  const totalVotes = profile.albums.reduce((total, album) => total + album.songs.length, 0)

  return (
    <div className="fade-in">
      <Link to="/users" style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 'var(--space-5)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <Icon name="arrowLeft" size={16} />
        Volver
      </Link>

      <div className="card" style={{ textAlign: 'center', padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
        <Avatar username={profile.username} size={80} style={{ margin: '0 auto 16px' }} />
        <h1 className="display" style={{ fontSize: 26, marginBottom: 2 }}>
          {profile.username}
        </h1>
        {isOwnProfile && profile.email && (
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 'var(--space-4)' }}>
            {profile.email}
          </p>
        )}
        <span className="chip">
          <Icon name="star" size={13} />
          {totalVotes} voto{totalVotes !== 1 ? 's' : ''}
        </span>
      </div>

      <h2 style={{ fontSize: 16, fontWeight: 600, fontFamily: 'var(--font-display)', letterSpacing: '0.02em', marginBottom: 'var(--space-4)' }}>
        {isOwnProfile ? 'Tus votos' : 'Canciones que ha votado'}
      </h2>

      {profile.albums.length === 0 ? (
        <EmptyState
          icon="star"
          title="Todavía no ha votado ninguna canción"
          description={isOwnProfile ? 'Entra en un disco y puntúa tus favoritas.' : null}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {profile.albums.map(album => {
            const isOpen = !!expanded[album.albumId]
            return (
              <div className="card" key={album.albumId} style={{ overflow: 'hidden', padding: 0 }}>
                <button
                  onClick={() => toggleAlbum(album.albumId)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '14px 16px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'inherit',
                    textAlign: 'left'
                  }}
                >
                  <div style={{
                    width: 44,
                    height: 44,
                    flexShrink: 0,
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    background: 'var(--surface-2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    fontWeight: 700,
                    fontFamily: 'var(--font-display)',
                    color: 'var(--accent)'
                  }}>
                    {album.coverUrl ? (
                      <img
                        src={album.coverUrl}
                        alt={`Portada de ${album.albumName}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    ) : (
                      album.albumName.charAt(0)
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: '0.02em' }}>
                      {album.albumName}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                      {album.albumYear} · {album.songs.length} voto{album.songs.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <Icon
                    name="chevronDown"
                    size={18}
                    style={{
                      color: 'var(--text-muted)',
                      flexShrink: 0,
                      transform: isOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s ease'
                    }}
                  />
                </button>
                {isOpen && (
                  <div style={{ borderTop: '1px solid var(--border)' }}>
                    <SongList>
                      {album.songs.map(song => (
                        <SongList.Row key={song.songId}>
                          <SongList.TrackNumber>{song.trackNumber}</SongList.TrackNumber>
                          <SongList.Info
                            title={song.title}
                            subtitle={song.featuredArtists ? `ft. ${song.featuredArtists}` : null}
                          />
                          <SongList.Action>
                            <span className="vote-avg" title={`Puntuación de ${song.score ?? 0}`}>
                              <Icon name="star" size={13} />
                              {song.score ?? 0}
                            </span>
                          </SongList.Action>
                        </SongList.Row>
                      ))}
                    </SongList>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
