import { useState, useEffect } from 'react'
import { voteApi } from '../services/api'
import TopChart from '../components/TopChart'

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
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div className="skeleton" style={{ width: 280, height: 36, margin: '0 auto 12px' }} />
          <div className="skeleton skeleton-text" style={{ width: 220, margin: '0 auto' }} />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', marginBottom: 4 }}>
            <div className="skeleton" style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton skeleton-text" />
              <div className="skeleton" style={{ height: 12, width: '60%' }} />
            </div>
            <div className="skeleton" style={{ width: 80, height: 28, borderRadius: 'var(--radius-full)' }} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="page-enter">
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{
          fontSize: 34,
          fontWeight: 900,
          marginBottom: 8,
          letterSpacing: '-0.02em'
        }}>
          Top <span style={{ color: 'var(--accent)' }}>SauceRank</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
          Las canciones mas votadas por la comunidad
        </p>
      </div>
      <TopChart songs={songs} />
    </div>
  )
}
