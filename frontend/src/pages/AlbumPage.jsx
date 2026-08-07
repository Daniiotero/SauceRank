import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { albumApi, voteApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import SongList from '../components/SongList'
import StarRating from '../components/StarRating'
import VotePopover from '../components/VotePopover'
import SpotifyPreview from '../components/SpotifyPreview'
import Icon from '../components/ui/Icon'
import EmptyState from '../components/ui/EmptyState'
import { Skeleton, SongListSkeleton } from '../components/ui/Skeleton'
import { PrimaryButton } from '../components/ui/Button'

const TYPE_LABEL = { ALBUM: 'Álbum', EP: 'EP', MIXTAPE: 'Mixtape' }

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
        <div style={{ display: 'flex', gap: 'var(--space-5)', marginBottom: 'var(--space-6)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <Skeleton width={200} height={200} style={{ borderRadius: 'var(--radius-md)' }} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <SkeletonText width={90} height={12} />
            <Skeleton width="60%" height={30} style={{ marginTop: 'var(--space-2)' }} />
            <SkeletonText width={45} />
          </div>
        </div>
        <div className="card">
          <SongListSkeleton count={8} />
        </div>
      </div>
    )
  }

  if (!album) {
    return (
      <EmptyState
        icon="music"
        title="Álbum no encontrado"
        description="El álbum que buscas no existe o ha sido movido."
        action={<PrimaryButton to="/" size="sm">Volver a discos</PrimaryButton>}
        style={{ marginTop: 'var(--space-7)' }}
      />
    )
  }

  return (
    <div className="fade-in">
      <Link to="/" style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 'var(--space-5)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <Icon name="arrowLeft" size={16} />
        Volver
      </Link>

      <div className="card" style={{
        display: 'flex',
        gap: 'var(--space-6)',
        marginBottom: 'var(--space-6)',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        padding: 'var(--space-5)',
        background: 'linear-gradient(180deg, rgba(110,184,208,0.04) 0%, var(--bg-raised) 100%)'
      }}>
        <div style={{
          width: 200,
          height: 200,
          flexShrink: 0,
          overflow: 'hidden',
          boxShadow: 'var(--shadow-3), var(--ice-glow)',
          borderRadius: 'var(--radius-md)'
        }}>
          {album.coverUrl ? (
            <img src={album.coverUrl} alt={`Portada de ${album.name}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              background: 'var(--surface-2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 64, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--accent)'
            }}>
              {album.name.charAt(0)}
            </div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <p className="eyebrow" style={{ marginBottom: 'var(--space-2)' }}>
            {TYPE_LABEL[album.type] || album.type}
          </p>
          <h1 className="display" style={{ fontSize: 'clamp(28px, 5vw, 42px)', marginBottom: 'var(--space-2)' }}>
            {album.name}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 14 }}>
            <span>{album.year}</span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--text-muted)' }} />
            <span>{album.songs.length} canciones</span>
          </div>
          {!user && (
            <p style={{ marginTop: 'var(--space-4)', fontSize: 13, color: 'var(--text-secondary)' }}>
              <PrimaryButton to="/login" size="sm" style={{ marginRight: 8 }}>Inicia sesión</PrimaryButton>
              para votar
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
          <Icon name="music" size={16} className="text-ice" />
          <h2 style={{ fontSize: 15, fontWeight: 600, fontFamily: 'var(--font-display)', letterSpacing: '0.02em' }}>
            Canciones
          </h2>
        </div>
        <SongList>
          {album.songs.map(song => (
            <SongList.Row key={song.id}>
              <SongList.TrackNumber>{song.trackNumber}</SongList.TrackNumber>
              <SongList.Info
                title={song.title}
                subtitle={song.featuredArtists ? `ft. ${song.featuredArtists}` : null}
              />
              <SongList.Action>
                <SpotifyPreview spotifyTrackId={song.spotifyTrackId} />
                {user && (
                  <>
                    <span className="vote-inline">
                      <StarRating
                        score={song.votedByCurrentUser ? song.userScore : 0}
                        onRate={score => handleVote(song.id, score)}
                        disabled={voting}
                        size={16}
                      />
                    </span>
                    <VotePopover
                      score={song.votedByCurrentUser ? song.userScore : 0}
                      onRate={score => handleVote(song.id, score)}
                      disabled={voting}
                    />
                  </>
                )}
              </SongList.Action>
            </SongList.Row>
          ))}
        </SongList>
      </div>
    </div>
  )
}

function SkeletonText({ width = '80%', height = 14 }) {
  return <Skeleton width={width} height={height} />
}
