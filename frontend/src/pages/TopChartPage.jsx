import { useState, useEffect } from 'react'
import { voteApi } from '../services/api'
import TopChart from '../components/TopChart'
import PageHeader from '../components/ui/PageHeader'
import { Skeleton, SongListSkeleton } from '../components/ui/Skeleton'

export default function TopChartPage() {
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    voteApi.getTop()
      .then(res => setSongs(res.data))
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
        description="Las canciones mas votadas por la comunidad"
        align="center"
      />
      <TopChart songs={songs} />
    </div>
  )
}
