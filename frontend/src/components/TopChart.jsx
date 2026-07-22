import { Link } from 'react-router-dom'

function getRankStyle(rank) {
  if (rank === 1) return { background: '#ffd700', color: '#000' }
  if (rank === 2) return { background: '#c0c0c0', color: '#000' }
  if (rank === 3) return { background: '#cd7f32', color: '#fff' }
  return { background: '#222', color: '#888' }
}

export default function TopChart({ songs }) {
  if (!songs || songs.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 40 }}>
        <p style={{ fontSize: 18, color: '#888' }}>Aun no hay votos. Se el primero en votar!</p>
      </div>
    )
  }

  return (
    <div>
      {songs.map(song => (
        <div key={song.songId} style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '14px 16px',
          background: song.rank === 1 ? '#1a2a1a' : song.rank <= 3 ? '#1a1a1a' : 'transparent',
          borderRadius: song.rank <= 3 ? 12 : 0,
          marginBottom: 4
        }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: 14,
            ...getRankStyle(song.rank)
          }}>
            {song.rank}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{song.title}</div>
            <div style={{ fontSize: 13, color: '#888' }}>
              {song.albumName} ({song.albumYear})
              {song.featuredArtists && ` · ft. ${song.featuredArtists}`}
            </div>
          </div>
          <div style={{
            background: '#1db954',
            color: '#000',
            fontWeight: 700,
            fontSize: 14,
            padding: '4px 14px',
            borderRadius: 20,
            whiteSpace: 'nowrap'
          }}>
            {song.voteCount} voto{song.voteCount !== 1 ? 's' : ''}
          </div>
        </div>
      ))}
    </div>
  )
}
