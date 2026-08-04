import { useState, useEffect } from 'react'
import { albumApi } from '../services/api'
import AlbumCard from '../components/AlbumCard'
import PageHeader from '../components/ui/PageHeader'
import { AlbumGridSkeleton } from '../components/ui/Skeleton'

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

  const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 'var(--space-5)' }

  return (
    <div className="fade-in">
      <PageHeader
        eyebrow="Discografia"
        title="Eladio Carrion"
      />

      {loading ? (
        <AlbumGridSkeleton />
      ) : (
        <>
          <section>
            <div style={grid}>
              {albumsList.map(album => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          </section>

          {epsList.length > 0 && (
            <section style={{ marginTop: 'var(--space-7)' }}>
              <p className="eyebrow" style={{ marginBottom: 'var(--space-4)' }}>
                EPs
              </p>
              <div style={grid}>
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
