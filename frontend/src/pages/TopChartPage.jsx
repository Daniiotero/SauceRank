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
    return <div style={{ textAlign: 'center', marginTop: 60, color: '#888' }}>Cargando top...</div>
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
          Top 20 <span style={{ color: '#1db954' }}>SauceRank</span>
        </h1>
        <p style={{ color: '#888', fontSize: 15 }}>
          Las canciones mas votadas por la comunidad
        </p>
      </div>
      <TopChart songs={songs} />
    </div>
  )
}
