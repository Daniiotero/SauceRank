import { useState } from 'react'
import { Link } from 'react-router-dom'

const TYPE_LABEL = { ALBUM: 'Album', EP: 'EP', MIXTAPE: 'Mixtape' }

export default function AlbumCard({ album }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <Link to={`/album/${album.id}`} className="album-card" style={{ textDecoration: 'none' }}>
      <div className="album-cover-wrap">
        {album.coverUrl && (
          <img
            src={album.coverUrl}
            alt={`Portada de ${album.name}`}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className={`album-cover-img${loaded ? ' loaded' : ''}`}
          />
        )}
        {!loaded && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-display)',
              fontSize: 12,
              letterSpacing: '0.14em',
              textTransform: 'uppercase'
            }}
          >
            Cargando...
          </div>
        )}
      </div>
      <div className="album-meta">
        <div
          style={{
            fontWeight: 600,
            fontSize: 15,
            color: 'var(--text-primary)',
            marginBottom: 3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontFamily: 'var(--font-display)'
          }}
        >
          {album.name}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          {album.year} &middot; {TYPE_LABEL[album.type] || album.type}
        </div>
      </div>
    </Link>
  )
}
