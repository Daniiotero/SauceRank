import { useState, useEffect } from 'react'
import { albumApi } from '../services/api'
import AlbumCard from '../components/AlbumCard'

export default function DiscographyPage() {
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    albumApi.getAll()
      .then(res => setAlbums(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: 60, color: '#888' }}>Cargando discografia...</div>
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8 }}>
          Discografia de <span style={{ color: '#1db954' }}>Eladio Carrion</span>
        </h1>
        <p style={{ color: '#888', fontSize: 16 }}>
          Explora sus albumes, vota por tus canciones favoritas y descubre el top de la comunidad
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: 20
      }}>
        {albums.map(album => (
          <AlbumCard key={album.id} album={album} />
        ))}
      </div>
    </div>
  )
}
