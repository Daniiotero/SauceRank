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

  useEffect(() => {
    userApi.getProfile(username)
      .then(res => setProfile(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [username])

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
        description="Este perfil no existe o fue eliminado."
        style={{ marginTop: 'var(--space-7)' }}
      />
    )
  }

  const isOwnProfile = currentUser?.id === profile.id

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
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 'var(--space-4)' }}>
          {profile.email}
        </p>
        <span className="chip">
          <Icon name="star" size={13} />
          {profile.votes.length} voto{profile.votes.length !== 1 ? 's' : ''}
        </span>
      </div>

      <h2 style={{ fontSize: 16, fontWeight: 600, fontFamily: 'var(--font-display)', letterSpacing: '0.02em', marginBottom: 'var(--space-4)' }}>
        {isOwnProfile ? 'Tus votos' : 'Canciones que voto'}
      </h2>

      {profile.votes.length === 0 ? (
        <EmptyState
          icon="star"
          title="Todavia no voto ninguna cancion"
          description={isOwnProfile ? 'Entra a un disco y puntua tus favoritas.' : null}
        />
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <SongList>
            {profile.votes.map((v, i) => (
              <SongList.Row key={i}>
                <SongList.TrackNumber>{i + 1}</SongList.TrackNumber>
                <SongList.Info
                  title={v.title}
                  subtitle={[
                    v.albumName,
                    v.featuredArtists ? `ft. ${v.featuredArtists}` : null
                  ].filter(Boolean).join(' · ')}
                />
                <SongList.Action>
                  <span className="vote-avg" title={`Puntaje de ${(v.score ?? 0)}/10`}>
                    <Icon name="star" size={13} />
                    {v.score ?? 0}/10
                  </span>
                </SongList.Action>
              </SongList.Row>
            ))}
          </SongList>
        </div>
      )}
    </div>
  )
}
