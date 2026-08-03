import { useState, useEffect } from 'react'
import { albumApi } from '../services/api'
import AlbumCard from '../components/AlbumCard'

function SkeletonGrid() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
      gap: 20
    }}>
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i}>
          <div className="skeleton" style={{ width: '100%', aspectRatio: '1/1' }} />
          <div style={{ padding: '14px 16px' }}>
            <div className="skeleton skeleton-text" style={{ width: '40%' }} />
            <div className="skeleton skeleton-text short" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function DiscographyPage() {
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    albumApi.getAll()
      .then(res => setAlbums(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const albumsList = albums.filter(a => a.type !== 'EP')
  const epsList = albums.filter(a => a.type === 'EP')

  return (
    <div className="fade-in">
      <header style={{ marginBottom: 40 }}>
        <h1 style={{
          fontSize: 36,
          fontWeight: 800,
          marginBottom: 8,
          letterSpacing: '-.02em'
        }}>
          Eladio Carrion
        </h1>
        <p style={{
          color: 'var(--text-dim)',
          fontSize: 15,
          lineHeight: 1.6,
          maxWidth: 520
        }}>
          Discografia completa. Vota por tus canciones favoritas y descubri el top de la comunidad.
        </p>
      </header>

      {loading ? (
        <SkeletonGrid />
      ) : (
        <>
          <section>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: 20
            }}>
              {albumsList.map(album => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          </section>

          {epsList.length > 0 && (
            <section style={{ marginTop: 44 }}>
              <h2 style={{
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 16,
                color: 'var(--text-muted)',
                letterSpacing: '.08em',
                textTransform: 'uppercase'
              }}>
                EPs
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: 20
              }}>
                {epsList.map(album => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}