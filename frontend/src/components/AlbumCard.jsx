import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'

export default function AlbumCard({ album }) {
  const [loaded, setLoaded] = useState(false)
  const onLoad = useCallback(() => setLoaded(true), [])

  return (
    <Link to={`/album/${album.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div className="album-card-wrapper">
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '1/1',
            background: 'var(--elevated)',
            overflow: 'hidden'
          }}>
            {album.coverUrl && (
              <img
                src={album.coverUrl}
                alt={album.name}
                loading="lazy"
                onLoad={onLoad}
                className="album-cover-img"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  opacity: loaded ? 1 : 0,
                  transition: 'opacity .4s ease, transform .35s ease'
                }}
              />
            )}
            {!loaded && (
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-muted)', fontSize: 13
              }}>
                Cargando...
              </div>
            )}
          </div>
          <div style={{ padding: '14px 16px' }}>
            <div style={{
              fontWeight: 600,
              fontSize: 15,
              color: 'var(--text)',
              marginBottom: 4,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {album.name}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>
              {album.year} &middot; {album.type === 'ALBUM' ? 'Album' : album.type === 'EP' ? 'EP' : 'Mixtape'}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}