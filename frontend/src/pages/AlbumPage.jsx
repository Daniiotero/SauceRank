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

  const handleVote = async (songId) => {
    setVoting(true)
    try {
      await voteApi.vote(songId)
      loadAlbum()
    } catch (err) {
      alert('Error al votar')
    } finally {
      setVoting(false)
    }
  }

  const handleUnvote = async (songId) => {
    setVoting(true)
    try {
      await voteApi.unvote(songId)
      loadAlbum()
    } catch (err) {
      alert('Error al quitar voto')
    } finally {
      setVoting(false)
    }
  }

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: 60, color: '#888' }}>Cargando album...</div>
  }

  if (!album) {
    return <div style={{ textAlign: 'center', marginTop: 60, color: '#888' }}>Album no encontrado</div>
  }

  return (
    <div>
      <Link to="/" style={{ color: '#888', fontSize: 14, marginBottom: 20, display: 'inline-block' }}>
        &larr; Volver a discos
      </Link>

      <div style={{ display: 'flex', gap: 24, marginBottom: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {album.coverUrl ? (
          <img src={album.coverUrl} alt={album.name}
            style={{ width: 200, height: 200, borderRadius: 12, objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            width: 200, height: 200, borderRadius: 12,
            background: 'linear-gradient(135deg, #1db954, #191414)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 72, fontWeight: 800, color: '#fff'
          }}>
            {album.name.charAt(0)}
          </div>
        )}
        <div>
          <p style={{ fontSize: 13, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
            {album.type === 'ALBUM' ? 'Album' : album.type === 'EP' ? 'EP' : 'Mixtape'}
          </p>
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 4 }}>{album.name}</h1>
          <p style={{ color: '#888', fontSize: 16 }}>{album.year} · {album.songs.length} canciones</p>
          {!user && (
            <p style={{ marginTop: 12, color: '#ff6b6b', fontSize: 13 }}>
              <Link to="/login" style={{ color: '#1db954' }}>Inicia sesion</Link> para votar
            </p>
          )}
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #222' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Canciones</h2>
        </div>
        <div style={{ padding: '0 20px' }}>
          {album.songs.map(song => (
            <SongRow
              key={song.id}
              song={song}
              onVote={handleVote}
              onUnvote={handleUnvote}
              disabled={voting || !user}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
