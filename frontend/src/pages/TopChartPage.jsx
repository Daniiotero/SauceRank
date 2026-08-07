import { useState, useEffect } from 'react'
import { voteApi } from '../services/api'
import TopChart from '../components/TopChart'
import TopAlbums from '../components/TopAlbums'
import PageHeader from '../components/ui/PageHeader'
import Icon from '../components/ui/Icon'
import { Skeleton, SongListSkeleton } from '../components/ui/Skeleton'

function SectionHeader({ icon, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'var(--space-4)' }}>
      <Icon name={icon} size={16} className="text-ice" />
      <h2 style={{ fontSize: 18, fontWeight: 600, fontFamily: 'var(--font-display)', letterSpacing: '0.02em', margin: 0 }}>
        {title}
      </h2>
    </div>
  )
}

export default function TopChartPage() {
  const [songs, setSongs] = useState([])
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([voteApi.getTop(), voteApi.getTopAlbums()])
      .then(([songsRes, albumsRes]) => {
        setSongs(songsRes.data)
        setAlbums(albumsRes.data)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="page-enter">
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <Skeleton width={300} height={40} style={{ margin: '0 auto' }} />
        </div>
        <div className="card">
          <SongListSkeleton count={6} />
        </div>
      </div>
    )
  }

  return (
    <div className="page-enter">
      <PageHeader
        eyebrow="Comunidad"
        title={
          <>
            Top <span style={{ color: 'var(--accent-bright)' }}>SauceRank</span>
          </>
        }
        description="Los temas y discos más votados por la comunidad"
        align="center"
      />

      <SectionHeader icon="music" title="Top álbumes" />
      <TopAlbums albums={albums} />

      <div style={{ marginTop: 'var(--space-7)' }}>
        <SectionHeader icon="trophy" title="Top canciones" />
        <TopChart songs={songs} />
      </div>
    </div>
  )
}
