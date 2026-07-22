import { Link } from 'react-router-dom'

export default function AlbumCard({ album }) {
  return (
    <Link to={`/album/${album.id}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
        overflow: 'hidden'
      }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-4px)'
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        {album.coverUrl ? (
          <img
            src={album.coverUrl}
            alt={album.name}
            style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: 8, marginBottom: 12 }}
          />
        ) : (
          <div style={{
            width: '100%',
            aspectRatio: '1/1',
            background: 'linear-gradient(135deg, #1db954, #191414)',
            borderRadius: 8,
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 48,
            fontWeight: 800,
            color: '#fff'
          }}>
            {album.name.charAt(0)}
          </div>
        )}
        <h3 style={{ fontSize: 15, color: '#fff', marginBottom: 4, lineHeight: 1.3 }}>{album.name}</h3>
        <p style={{ fontSize: 13, color: '#888' }}>
          {album.year} · {album.type === 'ALBUM' ? 'Album' : album.type === 'EP' ? 'EP' : 'Mixtape'}
        </p>
      </div>
    </Link>
  )
}
