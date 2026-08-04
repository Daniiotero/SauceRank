import { useState, useRef, useEffect } from 'react'
import Icon from './ui/Icon'

export default function SpotifyPreview({ spotifyTrackId }) {
  const [open, setOpen] = useState(false)
  const popupRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const handleClick = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    const handleKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  if (!spotifyTrackId) return null

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        className="star-btn"
        aria-label={open ? 'Cerrar preview de Spotify' : 'Escuchar preview en Spotify'}
        aria-expanded={open}
        style={{ border: '1px solid var(--border-strong)', width: 36, height: 36 }}
      >
        <Icon name="spotify" size={15} />
      </button>
      {open && (
        <div
          ref={popupRef}
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            zIndex: 30,
            width: 320,
            maxWidth: '80vw',
            background: 'var(--surface)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-3)',
            padding: 'var(--space-2)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
            <button
              onClick={() => setOpen(false)}
              className="star-btn"
              aria-label="Cerrar"
              style={{ width: 28, height: 28 }}
            >
              <Icon name="close" size={14} />
            </button>
          </div>
          <iframe
            src={`https://open.spotify.com/embed/track/${spotifyTrackId}?utm_source=generator`}
            width="100%"
            height="80"
            frameBorder="0"
            allow="encrypted-media; clipboard-write"
            style={{ borderRadius: 'var(--radius-sm)' }}
            title="Preview de Spotify"
          />
        </div>
      )}
    </div>
  )
}
